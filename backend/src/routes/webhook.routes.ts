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
import prisma from '../prisma';
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

  // Check Webhook Idempotency before processing
  const eventId = event.event_id || event.id || `${event.event}_${Date.now()}`;
  try {
    const existingWebhook = await prisma.processedWebhook.findUnique({
      where: { eventId },
    });
    if (existingWebhook) {
      logger.info({ eventId, event: event.event }, '[Webhook] Duplicate webhook event received — skipping (idempotent)');
      return res.status(200).json({ status: 'ok', note: 'duplicate event skipped' });
    }

    // Save eventId to prevent future duplicates
    await prisma.processedWebhook.create({
      data: {
        eventId,
        eventType: event.event || 'unknown',
      },
    }).catch(() => {}); // ignore race condition unique constraint errors
  } catch (err: any) {
    logger.warn({ err: err.message }, '[Webhook] Failed to check webhook idempotency record');
  }

  // Respond 200 immediately — Razorpay retries if it doesn't get 200 within 5s
  res.status(200).json({ status: 'ok' });

  // Process asynchronously (non-blocking to Razorpay)
  setImmediate(async () => {
    try {
      const payload = event.payload?.payment?.entity;
      const refundEntity = event.payload?.refund?.entity;

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

          await paymentService.verifyPayment(
            payment.orderId,
            'WEBHOOK',
            payload.order_id,
            payload.id,
            payload.id
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

        case 'refund.created':
        case 'refund.speed_changed': {
          if (!refundEntity?.id) break;
          const providerRefundId = refundEntity.id;

          await prisma.refund.updateMany({
            where: { providerRefundId },
            data: {
              status: 'PROCESSING',
              providerPayload: refundEntity,
            },
          }).catch(() => {});
          logger.info({ providerRefundId }, '[Webhook] refund.created processed');
          break;
        }

        case 'refund.processed': {
          if (!refundEntity?.id) break;
          const providerRefundId = refundEntity.id;
          const rrn = refundEntity.acquirer_data?.rrn || null;
          const now = new Date();

          const refund = await prisma.refund.findUnique({
            where: { providerRefundId },
            include: { payment: true, returnRequest: true },
          });

          if (!refund) {
            logger.warn({ providerRefundId }, '[Webhook] No matching Refund record found for refund.processed');
            break;
          }

          if (refund.status === 'PROCESSED') {
            logger.info({ providerRefundId }, '[Webhook] Refund already marked PROCESSED — skipping');
            break;
          }

          await prisma.$transaction(async (tx) => {
            await tx.refund.update({
              where: { id: refund.id },
              data: {
                status: 'PROCESSED',
                processedAt: now,
                bankReferenceNumber: rrn,
                providerPayload: refundEntity,
              },
            });

            await tx.payment.update({
              where: { id: refund.paymentId },
              data: { status: 'REFUNDED' },
            });

            await tx.order.update({
              where: { id: refund.orderId },
              data: { paymentStatus: 'REFUNDED', orderStatus: 'REFUNDED' },
            });

            if (refund.returnRequestId) {
              await tx.returnRequest.update({
                where: { id: refund.returnRequestId },
                data: {
                  status: 'REFUNDED',
                  refundStatus: 'processed',
                  bankReferenceNumber: rrn,
                  refundProcessedAt: now,
                  resolvedAt: now,
                },
              });

              await tx.returnTimeline.create({
                data: {
                  returnRequestId: refund.returnRequestId,
                  status: 'REFUNDED',
                  note: `Bank Credit Completed — Credited to payment method${rrn ? ` (Bank RRN: ${rrn})` : ''}.`,
                  actorType: 'SYSTEM',
                },
              });
            }
          });

          logger.info({ refundId: refund.id, providerRefundId }, '[Webhook] refund.processed workflow completed successfully');
          break;
        }

        case 'refund.failed': {
          if (!refundEntity?.id) break;
          const providerRefundId = refundEntity.id;
          const errCode = refundEntity.error_code || 'GATEWAY_ERROR';
          const errDesc = refundEntity.error_description || 'Refund failed on gateway';

          const refund = await prisma.refund.findUnique({ where: { providerRefundId } });
          if (refund) {
            await prisma.refund.update({
              where: { id: refund.id },
              data: {
                status: 'FAILED',
                failedAt: new Date(),
                gatewayErrorCode: errCode,
                gatewayErrorDesc: errDesc,
                failureReason: errDesc,
                providerPayload: refundEntity,
              },
            });

            if (refund.returnRequestId) {
              await prisma.returnTimeline.create({
                data: {
                  returnRequestId: refund.returnRequestId,
                  status: 'REFUND_PROCESSING',
                  note: `Refund Failed on Gateway — ${errDesc}. Available for Admin Retry.`,
                  actorType: 'SYSTEM',
                },
              });
            }
          }
          logger.info({ providerRefundId, errDesc }, '[Webhook] refund.failed logged');
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
