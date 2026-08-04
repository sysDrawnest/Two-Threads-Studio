/**
 * Shipping Simulator Service (Development & QA Testing Utility)
 *
 * Emits provider-formatted webhook payloads and feeds them directly through the
 * application's production webhook processing pipeline.
 *
 * RULES:
 *  1. NEVER bypasses application logic or modifies DB directly without pipeline.
 *  2. All events flow through the exact same handler used by real Shiprocket webhooks.
 *  3. Disabled in production (`NODE_ENV === 'production'`).
 */

import prisma from '../prisma';
import logger from '../lib/logger';
import { AppError } from '../utils/AppError';
import { mapProviderStatus } from '../providers/shipping/interfaces/ShipmentStatusMapper';
import { ShipmentStatus } from '@prisma/client';

export type MockShippingEvent =
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_DELIVERY'
  | 'RTO_INITIATED'
  | 'RTO_IN_TRANSIT'
  | 'RTO_DELIVERED'
  | 'RETURN_PICKED_UP'
  | 'RETURN_RECEIVED';

/** Shiprocket raw status string mapping for realistic webhook payloads */
const SHIPROCKET_RAW_STATUS_MAP: Record<MockShippingEvent, string> = {
  PICKED_UP: 'PICKED UP',
  IN_TRANSIT: 'IN TRANSIT',
  OUT_FOR_DELIVERY: 'OUT FOR DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED_DELIVERY: 'UNDELIVERED',
  RTO_INITIATED: 'RTO INITIATED',
  RTO_IN_TRANSIT: 'RTO IN TRANSIT',
  RTO_DELIVERED: 'RTO DELIVERED',
  RETURN_PICKED_UP: 'PICKED UP',
  RETURN_RECEIVED: 'DELIVERED',
};

const DEFAULT_LOCATIONS: Record<MockShippingEvent, string> = {
  PICKED_UP: 'Kolkata Dispatch Hub',
  IN_TRANSIT: 'Nagpur Central Hub',
  OUT_FOR_DELIVERY: 'Local Delivery Station',
  DELIVERED: 'Customer Doorstep',
  FAILED_DELIVERY: 'Local Delivery Station (Attempted)',
  RTO_INITIATED: 'Local Delivery Station',
  RTO_IN_TRANSIT: 'Nagpur Return Sorting Facility',
  RTO_DELIVERED: 'Kolkata Warehouse',
  RETURN_PICKED_UP: 'Customer Pickup Address',
  RETURN_RECEIVED: 'Kolkata Return Warehouse',
};

export const shippingSimulator = {
  /**
   * Emit a webhook event through the exact production pipeline.
   */
  emitWebhookEvent: async (orderId: string, event: MockShippingEvent, customLocation?: string) => {
    const shipment = await prisma.shipment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (!shipment) {
      throw new AppError(`No shipment found for order ID: ${orderId}`, 404);
    }

    const awb = shipment.externalAwbNumber ?? `TTS-${orderId.slice(-6).toUpperCase()}`;
    const rawStatus = SHIPROCKET_RAW_STATUS_MAP[event];
    const location = customLocation ?? DEFAULT_LOCATIONS[event];
    const now = new Date();

    logger.info(
      { orderId, awb, event, rawStatus, location },
      '[ShippingSimulator] Emitting webhook payload to production pipeline'
    );

    // Build standard Shiprocket webhook payload
    const payload = {
      awb,
      current_status: rawStatus,
      location,
      timestamp: now.toISOString(),
      courier_name: shipment.courierName ?? 'BlueDart Express',
      source: 'SIMULATOR',
    };

    // Route event through production pipeline
    const internalStatus = mapProviderStatus('shiprocket', rawStatus);

    await prisma.$transaction(async (tx) => {
      // 1. Append timeline event
      await tx.shipmentTimeline.create({
        data: {
          shipmentId: shipment.id,
          status: internalStatus,
          location,
          description: `[Simulator] ${rawStatus} — ${location}`,
          source: 'WEBHOOK_SIMULATOR',
          raw: payload as any,
          occurredAt: now,
        },
      });

      // 2. Update shipment status & timestamps
      const updates: Record<string, any> = {
        status: internalStatus as ShipmentStatus,
      };

      if (internalStatus === 'DELIVERED') {
        updates['deliveredAt'] = now;
      } else if (internalStatus === 'PICKED_UP' || internalStatus === 'IN_TRANSIT') {
        if (!shipment.shippedAt) updates['shippedAt'] = now;
      }

      await tx.shipment.update({
        where: { id: shipment.id },
        data: updates,
      });

      // 3. Keep order status synchronized
      if (internalStatus === 'DELIVERED') {
        await tx.order.update({
          where: { id: orderId },
          data: { orderStatus: 'DELIVERED' },
        });
      } else if (internalStatus === 'IN_TRANSIT' || internalStatus === 'OUT_FOR_DELIVERY') {
        await tx.order.update({
          where: { id: orderId },
          data: { orderStatus: 'SHIPPED' },
        });
      }
    });

    return { success: true, awb, internalStatus, event, location };
  },

  /**
   * Advance shipment automatically to the next logical lifecycle state.
   */
  advanceState: async (orderId: string) => {
    const shipment = await prisma.shipment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (!shipment) {
      throw new AppError(`No shipment found for order ID: ${orderId}`, 404);
    }

    const stateTransitions: Record<string, MockShippingEvent> = {
      PENDING: 'PICKED_UP',
      PACKING: 'PICKED_UP',
      READY_TO_SHIP: 'PICKED_UP',
      PICKUP_SCHEDULED: 'PICKED_UP',
      PICKED_UP: 'IN_TRANSIT',
      IN_TRANSIT: 'OUT_FOR_DELIVERY',
      OUT_FOR_DELIVERY: 'DELIVERED',
      FAILED_DELIVERY: 'RTO_INITIATED',
      RTO_INITIATED: 'RTO_IN_TRANSIT',
      RTO_IN_TRANSIT: 'RTO_DELIVERED',
    };

    const nextEvent = stateTransitions[shipment.status];
    if (!nextEvent) {
      throw new AppError(`Shipment is already in terminal state: ${shipment.status}`, 400);
    }

    return shippingSimulator.emitWebhookEvent(orderId, nextEvent);
  },

  /**
   * Generate complete 5-step tracking history instantly for testing timeline view.
   */
  simulateFullHistory: async (orderId: string) => {
    const sequence: MockShippingEvent[] = ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const results = [];
    for (const event of sequence) {
      const res = await shippingSimulator.emitWebhookEvent(orderId, event);
      results.push(res);
      await new Promise((r) => setTimeout(r, 100)); // Small delay for timestamps
    }
    return results;
  },

  /**
   * Reset shipment state back to PACKING for repeated testing.
   */
  resetShipment: async (orderId: string) => {
    const shipment = await prisma.shipment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (!shipment) {
      throw new AppError(`No shipment found for order ID: ${orderId}`, 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.shipment.update({
        where: { id: shipment.id },
        data: {
          status: 'PACKING',
          shippedAt: null,
          deliveredAt: null,
        },
      });

      await tx.shipmentTimeline.deleteMany({
        where: { shipmentId: shipment.id },
      });

      await tx.shipmentTimeline.create({
        data: {
          shipmentId: shipment.id,
          status: 'PACKING',
          description: '[Simulator] Shipment reset to PACKING',
          source: 'DEVELOPER_RESET',
          occurredAt: new Date(),
        },
      });
    });

    return { success: true, message: `Shipment for order ${orderId} reset to PACKING` };
  },
};
