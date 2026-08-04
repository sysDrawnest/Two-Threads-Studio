/**
 * Shipping Webhook Router
 *
 * Receives inbound webhook events from Shiprocket (and future providers).
 * Route: POST /api/v1/webhooks/shipping/:provider
 *
 * Security:
 *  - Shiprocket: HMAC-SHA256 signature on X-Shiprocket-Signature header
 *  - Mock: no verification (development only)
 *  - Unrecognized signatures → 401
 *
 * Processing:
 *  - Validates signature
 *  - Maps provider status → internal status
 *  - Appends ShipmentTimeline event
 *  - Updates Shipment.status in DB
 *  - Emits domain event for downstream notifications
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import logger from '../lib/logger';
import prisma from '../prisma';
import { mapProviderStatus } from '../providers/shipping/interfaces/ShipmentStatusMapper';
import type { SupportedProviderKey } from '../providers/shipping/interfaces/ShipmentStatusMapper';
import { ShipmentStatus, OrderStatus } from '@prisma/client';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// Signature Verification
// ─────────────────────────────────────────────────────────────────────────────

function verifyShiprocketSignature(req: Request): boolean {
  const secret = process.env['SHIPROCKET_WEBHOOK_SECRET'];
  if (!secret) {
    // No secret configured — accept all (dev mode only)
    logger.warn('[ShippingWebhook] SHIPROCKET_WEBHOOK_SECRET not set — accepting unverified webhooks');
    return true;
  }

  const signature = req.headers['x-shiprocket-signature'] as string | undefined;
  if (!signature) return false;

  const body = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Processing
// ─────────────────────────────────────────────────────────────────────────────

async function processShiprocketWebhook(body: any): Promise<void> {
  const awb: string | undefined = body.awb;
  const rawStatus: string | undefined = body.current_status;

  if (!awb || !rawStatus) {
    logger.warn({ body }, '[ShippingWebhook] Missing awb or current_status in Shiprocket payload');
    return;
  }

  // Find shipment by AWB
  const shipment = await prisma.shipment.findUnique({
    where: { externalAwbNumber: awb },
  });

  if (!shipment) {
    logger.warn({ awb }, '[ShippingWebhook] No shipment found for AWB');
    return;
  }

  const internalStatus = mapProviderStatus('shiprocket', rawStatus);
  const location: string | undefined = body.current_status_id
    ? undefined
    : body.location ?? body.city;

  const now = new Date(body.timestamp ?? Date.now());

  // Deduplication check: skip if identical event logged within last 60 seconds
  const recentDuplicate = await prisma.shipmentTimeline.findFirst({
    where: {
      shipmentId: shipment.id,
      status: internalStatus,
      description: rawStatus,
      occurredAt: { gte: new Date(Date.now() - 60_000) },
    },
  });

  if (recentDuplicate) {
    logger.info({ awb, rawStatus }, '[ShippingWebhook] Duplicate event within 60s — skipping timeline record');
  } else {
    // Append timeline event
    await prisma.shipmentTimeline.create({
      data: {
        shipmentId: shipment.id,
        status: internalStatus,
        location: location ?? undefined,
        description: rawStatus,
        source: 'WEBHOOK',
        raw: body,
        occurredAt: now,
      },
    });
  }

  // Update shipment status
  const deliveredAt =
    internalStatus === 'DELIVERED' ? (now ?? new Date()) : shipment.deliveredAt;
  const shippedAt =
    internalStatus === 'PICKED_UP' || internalStatus === 'IN_TRANSIT'
      ? (shipment.shippedAt ?? now)
      : shipment.shippedAt;

  await prisma.shipment.update({
    where: { id: shipment.id },
    data: {
      status: internalStatus as ShipmentStatus,
      shippedAt: shippedAt ?? undefined,
      deliveredAt: deliveredAt ?? undefined,
    },
  });

  // Sync Order.orderStatus with shipment status
  if (internalStatus === 'DELIVERED') {
    await prisma.order.update({
      where: { id: shipment.orderId },
      data: { orderStatus: OrderStatus.DELIVERED },
    }).catch(() => {});
  } else if (internalStatus === 'PICKED_UP' || internalStatus === 'IN_TRANSIT') {
    await prisma.order.update({
      where: { id: shipment.orderId },
      data: { orderStatus: OrderStatus.SHIPPED },
    }).catch(() => {});
  }

  logger.info(
    { awb, rawStatus, internalStatus, shipmentId: shipment.id },
    '[ShippingWebhook] Processed Shiprocket event'
  );
}

async function processIThinkWebhook(body: any): Promise<void> {
  const awb: string | undefined = body.waybill_number || body.awb_number || body.awb;
  const rawStatus: string | undefined = body.current_status || body.status;

  if (!awb || !rawStatus) {
    logger.warn({ body }, '[ShippingWebhook] Missing awb or status in IThink payload');
    return;
  }

  const shipment = await prisma.shipment.findUnique({
    where: { externalAwbNumber: awb },
  });

  if (!shipment) {
    logger.warn({ awb }, '[ShippingWebhook] No shipment found for IThink AWB');
    return;
  }

  const internalStatus = mapProviderStatus('ithink', rawStatus);
  const location: string | undefined = body.location || body.current_location;
  const now = new Date();

  // Deduplication check
  const recentDuplicate = await prisma.shipmentTimeline.findFirst({
    where: {
      shipmentId: shipment.id,
      status: internalStatus,
      description: rawStatus,
      occurredAt: { gte: new Date(Date.now() - 60_000) },
    },
  });

  if (!recentDuplicate) {
    await prisma.shipmentTimeline.create({
      data: {
        shipmentId: shipment.id,
        status: internalStatus,
        location: location ?? undefined,
        description: rawStatus,
        source: 'WEBHOOK',
        raw: body,
        occurredAt: now,
      },
    });
  }

  const deliveredAt = internalStatus === 'DELIVERED' ? now : shipment.deliveredAt;
  const shippedAt = internalStatus === 'PICKED_UP' || internalStatus === 'IN_TRANSIT' ? (shipment.shippedAt ?? now) : shipment.shippedAt;

  await prisma.shipment.update({
    where: { id: shipment.id },
    data: {
      status: internalStatus as ShipmentStatus,
      shippedAt: shippedAt ?? undefined,
      deliveredAt: deliveredAt ?? undefined,
    },
  });

  if (internalStatus === 'DELIVERED') {
    await prisma.order.update({
      where: { id: shipment.orderId },
      data: { orderStatus: OrderStatus.DELIVERED },
    }).catch(() => {});
  } else if (internalStatus === 'PICKED_UP' || internalStatus === 'IN_TRANSIT') {
    await prisma.order.update({
      where: { id: shipment.orderId },
      data: { orderStatus: OrderStatus.SHIPPED },
    }).catch(() => {});
  }

  logger.info({ awb, rawStatus, internalStatus, shipmentId: shipment.id }, '[ShippingWebhook] Processed IThink event');
}

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────

/** POST /api/v1/webhooks/shipping/ithink */
router.post('/ithink', async (req: Request, res: Response) => {
  res.status(200).json({ received: true });

  processIThinkWebhook(req.body).catch((err) => {
    logger.error({ err }, '[ShippingWebhook] Error processing IThink webhook');
  });
});

/** POST /api/v1/webhooks/shipping/shiprocket */
router.post('/shiprocket', async (req: Request, res: Response) => {
  if (!verifyShiprocketSignature(req)) {
    logger.warn('[ShippingWebhook] Shiprocket signature verification failed');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Acknowledge immediately — process async
  res.status(200).json({ received: true });

  processShiprocketWebhook(req.body).catch((err) => {
    logger.error({ err }, '[ShippingWebhook] Error processing Shiprocket webhook');
  });
});

/** POST /api/v1/webhooks/shipping/mock — used by integration tests */
router.post('/mock', async (req: Request, res: Response) => {
  if (process.env['NODE_ENV'] === 'production') {
    return res.status(403).json({ error: 'Mock webhook not available in production' });
  }

  res.status(200).json({ received: true });

  const { awb, status, location } = req.body;
  if (!awb || !status) return;

  const shipment = await prisma.shipment.findUnique({ where: { externalAwbNumber: awb } }).catch(() => null);
  if (!shipment) return;

  const internalStatus = mapProviderStatus('mock' as SupportedProviderKey, status, 'IN_TRANSIT');

  await prisma.shipmentTimeline.create({
    data: {
      shipmentId: shipment.id,
      status: internalStatus,
      location: location ?? undefined,
      description: `Mock webhook: ${status}`,
      source: 'WEBHOOK',
      occurredAt: new Date(),
    },
  }).catch(() => {});

  await prisma.shipment.update({
    where: { id: shipment.id },
    data: { status: internalStatus as ShipmentStatus },
  }).catch(() => {});
});

export default router;
