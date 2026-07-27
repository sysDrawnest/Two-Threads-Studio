/**
 * Phase 7.4 Idempotent Webhook Processor & Observability Logger
 * Secured via X-Razorpay-Signature HMAC-SHA256 & WebhookEvent table deduplication.
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../prisma';
import { paymentService } from './payment.service';
import { paymentRepository } from '../repositories/payment.repository';
import logger from '../lib/logger';

const router = Router();

function verifyWebhookSignature(rawBody: Buffer, signature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

router.post('/', async (req: Request, res: Response) => {
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

  const rawBody = req.body as Buffer;
  const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

  if (!isValid) {
    logger.warn('[Webhook] Invalid HMAC signature — possible spoofing attempt');
    return res.status(400).send('Invalid signature');
  }

  let event: any;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).send('Invalid JSON payload');
  }

  const eventId = event.event_id || event.payload?.payment?.entity?.id || `evt_${Date.now()}`;
  const eventType = event.event || 'unknown';

  logger.info({ eventId, eventType }, '[Webhook] Razorpay signature verified');

  // Idempotency Check
  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { eventId },
  });

  if (existingEvent) {
    logger.info({ eventId }, '[Webhook] Duplicate event detected — skipping (idempotent)');
    return res.status(200).json({ status: 'already_processed' });
  }

  // Record Event in WebhookEvent and PaymentWebhookLog
  try {
    await prisma.webhookEvent.create({
      data: {
        provider: 'razorpay',
        eventId,
        eventType,
      },
    });

    await prisma.paymentWebhookLog.create({
      data: {
        provider: 'razorpay',
        eventId,
        eventType,
        payload: event as any,
        status: 'SUCCESS',
      },
    });
  } catch (dbErr) {
    logger.warn({ dbErr, eventId }, '[Webhook] Failed to save webhook idempotency log');
  }

  // Return HTTP 200 immediately to prevent Razorpay timeout retries
  res.status(200).json({ status: 'ok' });

  // Asynchronous Execution
  setImmediate(async () => {
    try {
      const payload = event.payload?.payment?.entity;

      switch (eventType) {
        case 'payment.captured':
        case 'payment.authorized': {
          if (!payload?.order_id || !payload?.id) break;

          const payment = await paymentRepository.findByProviderOrderId(payload.order_id);
          if (!payment) {
            logger.warn({ razorpayOrderId: payload.order_id }, '[Webhook] No matching payment found');
            break;
          }

          await paymentService.captureWebhookPayment(payment.orderId, payload.order_id, payload.id);
          logger.info({ orderId: payment.orderId }, '[Webhook] payment.captured handled successfully');
          break;
        }

        case 'payment.failed': {
          if (!payload?.order_id) break;

          const payment = await paymentRepository.findByProviderOrderId(payload.order_id);
          if (!payment || payment.status === 'FAILED') break;

          await paymentService.handlePaymentFailure(
            payment.orderId,
            payload.error_description || 'Payment failed via Razorpay',
            payload.error_code
          );
          logger.info({ orderId: payment.orderId }, '[Webhook] payment.failed handled successfully');
          break;
        }

        default:
          logger.info({ eventType }, '[Webhook] Unhandled event type — logged');
      }
    } catch (err: any) {
      logger.error({ err, eventId }, '[Webhook] Exception processing webhook payload');
    }
  });
});

export default router;
