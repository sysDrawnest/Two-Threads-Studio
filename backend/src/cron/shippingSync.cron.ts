/**
 * Shipping Sync Cron Job
 *
 * Polls the active shipping provider for status updates on in-flight shipments.
 * This is the fallback for when webhooks miss events (dropped packets, downtime, etc.)
 *
 * Schedule: every 30 minutes (configurable via SHIPPING_SYNC_INTERVAL_MINUTES)
 *
 * Polling only runs for shipments in "active" states where a status change is expected.
 * Delivered or cancelled shipments are never polled.
 *
 * Uses CronJobLock to prevent concurrent execution across multiple server instances.
 */

import cron from 'node-cron';
import logger from '../lib/logger';
import prisma from '../prisma';
import { shippingProvider } from '../providers/shipping';
import { mapProviderStatus } from '../providers/shipping/interfaces/ShipmentStatusMapper';
import type { SupportedProviderKey } from '../providers/shipping/interfaces/ShipmentStatusMapper';
import { ShipmentStatus } from '@prisma/client';

// States that have not yet reached a terminal status and should be polled
const ACTIVE_SHIPMENT_STATUSES: ShipmentStatus[] = [
  ShipmentStatus.PACKING,
  ShipmentStatus.READY_TO_SHIP,
  ShipmentStatus.PICKUP_SCHEDULED,
  ShipmentStatus.PICKED_UP,
  ShipmentStatus.SHIPPED,
  ShipmentStatus.IN_TRANSIT,
  ShipmentStatus.OUT_FOR_DELIVERY,
  ShipmentStatus.FAILED_DELIVERY,
];

const LOCK_ID = 'shipping_sync';
const LOCK_TTL_MINUTES = 25; // Lock expires after 25 min (safe below 30-min interval)

async function acquireLock(): Promise<boolean> {
  try {
    const now = new Date();
    const lockExpiry = new Date(now.getTime() + LOCK_TTL_MINUTES * 60_000);

    const existing = await prisma.cronJobLock.findUnique({ where: { id: LOCK_ID } });
    if (existing && existing.expiresAt > now) {
      return false; // Lock is still held by another instance
    }

    await prisma.cronJobLock.upsert({
      where: { id: LOCK_ID },
      create: {
        id: LOCK_ID,
        lockedAt: now,
        lockedBy: 'shipping_sync_cron',
        expiresAt: lockExpiry,
      },
      update: {
        lockedAt: now,
        lockedBy: 'shipping_sync_cron',
        expiresAt: lockExpiry,
      },
    });
    return true;
  } catch {
    return false;
  }
}

async function releaseLock(): Promise<void> {
  try {
    // Reset expiry to epoch — makes it acquirable again immediately
    await prisma.cronJobLock.update({
      where: { id: LOCK_ID },
      data: { expiresAt: new Date(0) },
    });
  } catch {
    // Non-fatal
  }
}

async function syncShipments(): Promise<void> {
  const locked = await acquireLock();
  if (!locked) {
    logger.info('[ShippingSync] Lock acquisition failed — another instance is running, skipping');
    return;
  }

  try {
    // Find all in-flight shipments with an AWB number
    const activeShipments = await prisma.shipment.findMany({
      where: {
        status: { in: ACTIVE_SHIPMENT_STATUSES },
        externalAwbNumber: { not: null },
      },
      select: {
        id: true,
        externalAwbNumber: true,
        status: true,
        provider: true,
        shippedAt: true,
        deliveredAt: true,
      },
      take: 100, // Safety cap — avoid huge batches in a single cron run
    });

    if (activeShipments.length === 0) {
      logger.info('[ShippingSync] No active shipments to sync');
      return;
    }

    logger.info({ count: activeShipments.length }, '[ShippingSync] Syncing shipments');

    let updated = 0;
    let errors = 0;

    for (const shipment of activeShipments) {
      try {
        if (!shipment.externalAwbNumber) continue;

        const tracking = await shippingProvider.trackShipment(shipment.externalAwbNumber);

        // Map provider status to internal status
        const providerKey = (shipment.provider.toLowerCase()) as SupportedProviderKey;
        const internalStatus = mapProviderStatus(providerKey, tracking.status);

        // Only update if status changed
        if (internalStatus !== shipment.status) {
          const latestEvent = tracking.events[tracking.events.length - 1];

          await prisma.$transaction(async (tx) => {
            await tx.shipment.update({
              where: { id: shipment.id },
              data: {
                status: internalStatus as ShipmentStatus,
                deliveredAt:
                  internalStatus === 'DELIVERED' && !shipment.deliveredAt
                    ? (latestEvent?.timestamp ?? new Date())
                    : undefined,
                shippedAt:
                  (internalStatus === 'PICKED_UP' || internalStatus === 'IN_TRANSIT') && !shipment.shippedAt
                    ? (latestEvent?.timestamp ?? new Date())
                    : undefined,
              },
            });

            await tx.shipmentTimeline.create({
              data: {
                shipmentId: shipment.id,
                status: internalStatus,
                location: tracking.location ?? undefined,
                description: `Status synced via provider poll: ${internalStatus}`,
                source: 'PROVIDER_POLL',
                occurredAt: tracking.timestamp,
              },
            });
          });

          updated++;
          logger.info(
            { shipmentId: shipment.id, awb: shipment.externalAwbNumber, internalStatus },
            '[ShippingSync] Status updated'
          );
        }
      } catch (err) {
        errors++;
        logger.error(
          { err, shipmentId: shipment.id, awb: shipment.externalAwbNumber },
          '[ShippingSync] Failed to sync shipment'
        );
      }

      // Small delay between API calls to avoid rate limiting (300ms)
      await new Promise((r) => setTimeout(r, 300));
    }

    logger.info(
      { total: activeShipments.length, updated, errors },
      '[ShippingSync] Sync complete'
    );
  } finally {
    await releaseLock();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cron Registration
// ─────────────────────────────────────────────────────────────────────────────

const INTERVAL_MINUTES = Number(process.env['SHIPPING_SYNC_INTERVAL_MINUTES'] ?? 30);

export function registerShippingSyncCron(): void {
  // Clamp to valid cron range (1–59 minutes)
  const safeInterval = Math.min(59, Math.max(1, INTERVAL_MINUTES));
  const cronExpression = `*/${safeInterval} * * * *`;

  cron.schedule(cronExpression, () => {
    syncShipments().catch((err) => {
      logger.error({ err }, '[ShippingSync] Unhandled error in sync cron');
    });
  });

  logger.info(
    { interval: `every ${safeInterval} minutes` },
    '[ShippingSync] Cron registered'
  );
}
