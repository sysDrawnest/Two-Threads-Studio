/**
 * Razorpay Webhook Routes
 *
 * IMPORTANT: This route must use express.raw() body parser (mounted in app.ts).
 * JSON parsing destroys the raw body needed for HMAC verification.
 *
 * Security:
 *   - Verifies X-Razorpay-Signature HMAC-SHA256 before any processing
 *   - All events are idempotent (duplicate webhooks do nothing)
 *
 * See docs/RAZORPAY_LOCAL_WEBHOOK_SETUP.md for local testing with ngrok.
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { paymentService } from '../services/payment.service';
import { paymentRepository } from '../repositories/payment.repository';
import logger from '../lib/logger';

const router = Router();

function verifyWebhookSignature(
  rawBody: Buffer,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    return false;
  }
}

router.post('/razorpay', async (req: Request, res: Response) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error('[Webhook] RAZORPAY_WEBHOOK_SECRET not configured');
    return res.status(500).send('Webhook secret not configured');
  }

  const signature = req.headers['x-razorpay-signature'] as string;
  if (!signature) {
    logger.warn('[Webhook] Missing X-Razorpay-Signature header');
    return res.status(400).send('Missing signature');
  }

  // req.body must be a Buffer (raw body) — see app.ts webhook route setup
  const isValid = verifyWebhookSignature(req.body as Buffer, signature, webhookSecret);
  if (!isValid) {
    logger.warn('[Webhook] Invalid signature — possible spoofing attempt');
    return res.status(400).send('Invalid signature');
  }

  let event: any;
  try {
    event = JSON.parse((req.body as Buffer).toString('utf8'));
  } catch {
    return res.status(400).send('Invalid JSON payload');
  }

  logger.info({ event: event.event }, '[Webhook] Received Razorpay event');

  // Respond 200 immediately — Razorpay retries if it doesn't get 200 within 5s
  res.status(200).json({ status: 'ok' });

  // Process asynchronously (non-blocking to Razorpay)
  setImmediate(async () => {
    try {
      const payload = event.payload?.payment?.entity;

      switch (event.event) {
        case 'payment.captured': {
          if (!payload?.order_id || !payload?.id) break;

          const payment = await paymentRepository.findByProviderOrderId(payload.order_id);

          if (!payment) {
            logger.warn({ razorpayOrderId: payload.order_id }, '[Webhook] No matching payment found');
            break;
          }

          if (payment.status === 'CAPTURED') {
            logger.info('[Webhook] Payment already captured — skipping (idempotent)');
            break;
          }

          // We already verified the webhook signature above — pass empty string to bypass re-verify
          // The service's verifyPayment will call verifySignature with providerOrderId|providerPaymentId
          // Since we already verified the webhook HMAC, we can trust the event data
          await paymentService.verifyPayment(
            payment.orderId,
            'WEBHOOK',
            payload.order_id,
            payload.id,
            payload.id  // Use paymentId as placeholder — webhook already verified above
          );
          logger.info({ orderId: payment.orderId }, '[Webhook] payment.captured processed');
          break;
        }

        case 'payment.failed': {
          if (!payload?.order_id) break;

          const payment = await paymentRepository.findByProviderOrderId(payload.order_id);

          if (!payment || payment.status === 'FAILED') break;

          await paymentService.handlePaymentFailure(
            payment.orderId,
            payload.error_description || 'Payment failed',
            payload.error_code
          );
          logger.info({ orderId: payment.orderId }, '[Webhook] payment.failed processed');
          break;
        }

        default:
          logger.info({ event: event.event }, '[Webhook] Unhandled event type — ignoring');
      }
    } catch (err) {
      logger.error({ err, event: event?.event }, '[Webhook] Error processing event');
    }
  });
});

export default router;
