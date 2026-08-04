/**
 * Shipment Service
 *
 * Manages the shipment lifecycle using the ShippingProvider abstraction.
 * This service NEVER references a provider directly — it speaks only internal DTOs.
 *
 * Events are emitted post-commit. Notification listeners handle emails/SMS.
 * All provider-specific data is stored in the `metadata` JSON column for audit.
 */

import prisma from '../prisma';
import { shippingProvider } from '../providers/shipping';
import { shipmentRepository } from '../repositories/shipment.repository';
import { orderRepository } from '../repositories/order.repository';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import {
  OrderStatus,
  ShipmentStatus,
  AuditAction,
  AuditActorType,
} from '@prisma/client';
import { eventDispatcher, ShipmentEvents } from '../events';
import logger from '../lib/logger';
import type { CreateShipmentRequest } from '../providers/shipping';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Default fulfillment location code from ShippingSettings or env fallback */
async function getDefaultPickupLocationCode(): Promise<string> {
  try {
    const settings = await prisma.shippingSettings.findUnique({ where: { id: 'singleton' } });
    if (settings?.defaultLocationId) {
      const loc = await prisma.fulfillmentLocation.findUnique({
        where: { id: settings.defaultLocationId },
      });
      if (loc?.providerCode) return loc.providerCode;
    }
  } catch {
    // Fall through to env fallback
  }
  return process.env['SHIPROCKET_PICKUP_LOCATION'] ?? 'Primary';
}

/** Build CreateShipmentRequest from order data and settings defaults */
async function buildCreateShipmentRequest(
  order: any,
  idempotencyKey: string
): Promise<CreateShipmentRequest> {
  // Try to get weight/dimensions from PackageProfile of first item, else use ShippingSettings defaults
  let weightGrams = 500;
  let dimensions = { length: 20, breadth: 15, height: 10 };

  try {
    const settings = await prisma.shippingSettings.findUnique({ where: { id: 'singleton' } });
    if (settings) {
      weightGrams = settings.defaultWeightGrams + settings.packagingExtraGrams;
      dimensions = {
        length: settings.defaultLength,
        breadth: settings.defaultBreadth,
        height: settings.defaultHeight,
      };
    }
  } catch {
    // Use defaults above
  }

  const isCOD = order.paymentMethod === 'COD';
  const pickupLocationCode = await getDefaultPickupLocationCode();

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    direction: 'FORWARD',
    shippingAddress: {
      fullName: order.shippingAddress.fullName,
      phone: order.shippingAddress.phone,
      line1: order.shippingAddress.line1,
      line2: order.shippingAddress.line2,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      country: order.shippingAddress.country,
      postalCode: order.shippingAddress.postalCode,
    },
    items: order.items.map((item: any) => ({
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: Number(item.price),
    })),
    weightGrams,
    dimensions,
    isCOD,
    codAmount: isCOD ? Number(order.totalAmount) : undefined,
    pickupLocationCode,
    idempotencyKey,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

export const shipmentService = {
  /**
   * Admin: Create a shipment for a CONFIRMED/PROCESSING/HANDCRAFTING/etc order.
   * Triggers ShipmentEvents.CREATED → notification listener.
   */
  createShipment: async (orderId: string, adminId: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shippingAddress: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    const allowedStatuses = [
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.HANDCRAFTING,
      OrderStatus.QUALITY_CHECK,
      OrderStatus.READY_TO_SHIP,
    ] as string[];

    if (!allowedStatuses.includes(order.orderStatus)) {
      throw new AppError(
        `Cannot ship an order with status: ${order.orderStatus}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Idempotency: if shipment already exists, return it
    const existingShipment = await shipmentRepository.findByOrderId(orderId);
    if (existingShipment) {
      logger.warn({ orderId }, 'Shipment already exists — returning existing');
      return existingShipment;
    }

    const idempotencyKey = `create:${orderId}`;
    const request = await buildCreateShipmentRequest(order, idempotencyKey);

    // Call shipping provider — returns provider-neutral DTOs
    const result = await shippingProvider.createShipment(request);

    const { shipment: createdShipment } = await prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.create({
        data: {
          order: { connect: { id: orderId } },
          provider: process.env['SHIPPING_PROVIDER']?.toUpperCase() ?? 'MOCK',
          externalShipmentId: result.externalShipmentId,
          externalOrderId: result.externalOrderId,
          externalAwbNumber: result.externalAwbNumber,
          courierName: result.courierName,
          courierCode: result.courierCode,
          trackingUrl: result.trackingUrl,
          labelUrl: result.labelUrl,
          estimatedDelivery: result.estimatedDelivery,
          shippingCost: result.shippingCost,
          weightGrams: request.weightGrams,
          dimensions: request.dimensions as any,
          status: ShipmentStatus.PACKING,
          metadata: result.raw as any,
        },
      });

      // Append first timeline event
      await tx.shipmentTimeline.create({
        data: {
          shipmentId: shipment.id,
          status: 'PACKING',
          description: `Shipment created — ${result.courierName} / AWB: ${result.externalAwbNumber}`,
          source: 'ADMIN',
          occurredAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { orderStatus: OrderStatus.PROCESSING },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          previousStatus: order.orderStatus,
          newStatus: OrderStatus.PROCESSING,
          changedBy: adminId,
          note: `Shipment created — ${result.courierName} / AWB: ${result.externalAwbNumber}`,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.SHIPMENT_CREATED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: {
            externalAwbNumber: result.externalAwbNumber,
            courierName: result.courierName,
            externalShipmentId: result.externalShipmentId,
          },
        },
      });

      return { shipment };
    });

    eventDispatcher
      .emit(ShipmentEvents.CREATED, { order, shipment: createdShipment })
      .catch((err) => logger.error({ err }, 'Failed to emit shipment.created'));

    return createdShipment;
  },

  /**
   * Admin: Mark a shipment as SHIPPED (handed to courier).
   */
  markShipped: async (orderId: string, adminId: string) => {
    const shipment = await shipmentRepository.findByOrderId(orderId);
    if (!shipment) throw new AppError('Shipment not found', HTTP_STATUS.NOT_FOUND);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        shippingAddress: true,
      },
    });
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    const now = new Date();

    const updatedShipment = await prisma.$transaction(async (tx) => {
      const updated = await tx.shipment.update({
        where: { id: shipment.id },
        data: { status: ShipmentStatus.SHIPPED, shippedAt: now },
      });

      await tx.shipmentTimeline.create({
        data: {
          shipmentId: shipment.id,
          status: 'SHIPPED',
          description: `Marked as shipped — ${shipment.courierName ?? 'Courier'} / AWB: ${shipment.externalAwbNumber ?? 'N/A'}`,
          source: 'ADMIN',
          occurredAt: now,
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { orderStatus: OrderStatus.SHIPPED },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          previousStatus: order.orderStatus,
          newStatus: OrderStatus.SHIPPED,
          changedBy: adminId,
          note: `Shipped via ${shipment.courierName ?? 'Courier'} — AWB: ${shipment.externalAwbNumber ?? 'N/A'}`,
        },
      });

      return updated;
    });

    eventDispatcher
      .emit(ShipmentEvents.SHIPPED, { order, shipment: updatedShipment })
      .catch((err) => logger.error({ err }, 'Failed to emit shipment.shipped'));

    return updatedShipment;
  },

  /**
   * Admin: Mark a shipment as DELIVERED.
   */
  markDelivered: async (orderId: string, adminId: string) => {
    const shipment = await shipmentRepository.findByOrderId(orderId);
    if (!shipment) throw new AppError('Shipment not found', HTTP_STATUS.NOT_FOUND);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    const now = new Date();

    const updatedShipment = await prisma.$transaction(async (tx) => {
      const updated = await tx.shipment.update({
        where: { id: shipment.id },
        data: { status: ShipmentStatus.DELIVERED, deliveredAt: now },
      });

      await tx.shipmentTimeline.create({
        data: {
          shipmentId: shipment.id,
          status: 'DELIVERED',
          description: 'Marked as delivered by admin',
          source: 'ADMIN',
          occurredAt: now,
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { orderStatus: OrderStatus.DELIVERED },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          previousStatus: order.orderStatus,
          newStatus: OrderStatus.DELIVERED,
          changedBy: adminId,
          note: 'Marked as delivered by admin',
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.SHIPMENT_DELIVERED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: { deliveredAt: now.toISOString() },
        },
      });

      return updated;
    });

    eventDispatcher
      .emit(ShipmentEvents.DELIVERED, { order, shipment: updatedShipment })
      .catch((err) => logger.error({ err }, 'Failed to emit shipment.delivered'));

    return updatedShipment;
  },

  /**
   * Customer: Get shipment details for their own order.
   */
  getShipmentForOrder: async (orderId: string, userId: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    return shipmentRepository.findByOrderId(orderId);
  },

  /**
   * Get live tracking from the active shipping provider.
   */
  getLiveTracking: async (orderId: string, userId: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    const shipment = await shipmentRepository.findByOrderId(orderId);
    if (!shipment) throw new AppError('No shipment found for this order', HTTP_STATUS.NOT_FOUND);
    if (!shipment.externalAwbNumber)
      throw new AppError('Tracking number not yet assigned', HTTP_STATUS.NOT_FOUND);

    return shippingProvider.trackShipment(shipment.externalAwbNumber);
  },

  /**
   * Get the shipment event timeline for an order.
   * Customer can only see their own orders; admin can query any.
   */
  getTimeline: async (orderId: string, userId?: string) => {
    if (userId) {
      const order = await orderRepository.findById(orderId, userId);
      if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    }

    const shipment = await shipmentRepository.findByOrderId(orderId);
    if (!shipment) return [];

    return prisma.shipmentTimeline.findMany({
      where: { shipmentId: shipment.id },
      orderBy: { occurredAt: 'asc' },
    });
  },

  /**
   * Provider health check — returns auth status, capabilities, and latency.
   */
  getProviderHealth: async () => {
    return shippingProvider.healthCheck();
  },

  /**
   * Get the active provider's capability map for UI rendering.
   */
  getCapabilities: () => {
    return shippingProvider.capabilities;
  },

  // ─── Phase 2: Extended Admin Actions ──────────────────────────────────────

  /**
   * Admin: Schedule a courier pickup for a shipment.
   */
  schedulePickup: async (orderId: string, adminId: string, pickupDate?: Date) => {
    if (!shippingProvider.capabilities.supportsPickup) {
      throw new AppError('Active shipping provider does not support pickup scheduling', 400);
    }

    const shipment = await shipmentRepository.findByOrderId(orderId);
    if (!shipment) throw new AppError('Shipment not found', HTTP_STATUS.NOT_FOUND);
    if (!shipment.externalShipmentId)
      throw new AppError('Shipment has no external provider ID yet', HTTP_STATUS.BAD_REQUEST);

    const pickupSettings = await prisma.fulfillmentLocation.findFirst({ where: { isDefault: true } });
    const locationCode = shipment.locationId
      ? (await prisma.fulfillmentLocation.findUnique({ where: { id: shipment.locationId } }))?.providerCode ?? 'Primary'
      : pickupSettings?.providerCode ?? process.env['SHIPROCKET_PICKUP_LOCATION'] ?? 'Primary';

    const idempotencyKey = `pickup:${shipment.id}`;
    const result = await shippingProvider.schedulePickup({
      externalShipmentId: shipment.externalShipmentId,
      pickupDate,
      pickupLocationCode: locationCode,
      idempotencyKey,
    });

    const now = new Date();
    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.shipment.update({
        where: { id: shipment.id },
        data: {
          status: ShipmentStatus.PICKUP_SCHEDULED,
          pickupId: result.pickupId,
        },
      });

      await tx.shipmentTimeline.create({
        data: {
          shipmentId: shipment.id,
          status: 'PICKUP_SCHEDULED',
          description: `Pickup scheduled${result.scheduledDate ? ` for ${result.scheduledDate.toDateString()}` : ''}`,
          source: 'ADMIN',
          occurredAt: now,
          raw: result.raw as any,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.SHIPMENT_PICKUP_SCHEDULED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: {
            pickupId: result.pickupId,
            scheduledDate: result.scheduledDate?.toISOString(),
          },
        },
      });

      return s;
    });

    return { shipment: updated, pickup: result };
  },

  /**
   * Admin: Generate a shipping label for a shipment.
   */
  generateLabel: async (orderId: string, adminId: string) => {
    if (!shippingProvider.capabilities.supportsLabelPDF) {
      throw new AppError('Active shipping provider does not support label generation', 400);
    }

    const shipment = await shipmentRepository.findByOrderId(orderId);
    if (!shipment) throw new AppError('Shipment not found', HTTP_STATUS.NOT_FOUND);
    if (!shipment.externalShipmentId)
      throw new AppError('Shipment has no external provider ID yet', HTTP_STATUS.BAD_REQUEST);

    const result = await shippingProvider.generateLabel(shipment.externalShipmentId);

    await prisma.shipment.update({
      where: { id: shipment.id },
      data: { labelUrl: result.labelUrl },
    });

    logger.info({ orderId, adminId, labelUrl: result.labelUrl }, 'Label generated');
    return result;
  },

  /**
   * Admin: Generate an invoice PDF for a shipment.
   */
  generateInvoice: async (orderId: string, adminId: string) => {
    if (!shippingProvider.capabilities.supportsInvoicePDF) {
      throw new AppError('Active shipping provider does not support invoice generation', 400);
    }

    const shipment = await shipmentRepository.findByOrderId(orderId);
    if (!shipment) throw new AppError('Shipment not found', HTTP_STATUS.NOT_FOUND);
    if (!shipment.externalShipmentId)
      throw new AppError('Shipment has no external provider ID yet', HTTP_STATUS.BAD_REQUEST);

    const result = await shippingProvider.generateInvoice(shipment.externalShipmentId);

    await prisma.shipment.update({
      where: { id: shipment.id },
      data: { invoiceUrl: result.invoiceUrl },
    });

    logger.info({ orderId, adminId, invoiceUrl: result.invoiceUrl }, 'Invoice generated');
    return result;
  },

  /**
   * Admin: Cancel a shipment with the provider.
   */
  cancelShipment: async (orderId: string, adminId: string, reason?: string) => {
    if (!shippingProvider.capabilities.supportsCancellation) {
      throw new AppError('Active shipping provider does not support shipment cancellation', 400);
    }

    const shipment = await shipmentRepository.findByOrderId(orderId);
    if (!shipment) throw new AppError('Shipment not found', HTTP_STATUS.NOT_FOUND);
    if (!shipment.externalShipmentId)
      throw new AppError('Shipment has no external provider ID yet', HTTP_STATUS.BAD_REQUEST);

    await shippingProvider.cancelShipment({
      externalShipmentId: shipment.externalShipmentId,
      externalOrderId: shipment.externalOrderId ?? undefined,
      reason,
      idempotencyKey: `cancel:${shipment.id}`,
    });

    const now = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.shipment.update({
        where: { id: shipment.id },
        data: { status: ShipmentStatus.CANCELLED },
      });

      await tx.shipmentTimeline.create({
        data: {
          shipmentId: shipment.id,
          status: 'CANCELLED',
          description: reason ? `Shipment cancelled: ${reason}` : 'Shipment cancelled by admin',
          source: 'ADMIN',
          occurredAt: now,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.SHIPMENT_CANCELLED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: { reason },
        },
      });
    });
  },

  /**
   * Admin: Create a return (reverse logistics) shipment.
   */
  createReturnShipmentForOrder: async (orderId: string, adminId: string) => {
    if (!shippingProvider.capabilities.supportsReturns) {
      throw new AppError('Active shipping provider does not support return shipments', 400);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shippingAddress: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    const pickupLocation = await prisma.fulfillmentLocation.findFirst({ where: { isDefault: true } });
    const locationCode =
      pickupLocation?.providerCode ??
      process.env['SHIPROCKET_PICKUP_LOCATION'] ??
      'Primary';

    const idempotencyKey = `return:${orderId}:${Date.now()}`;
    const result = await shippingProvider.createReturnShipment({
      orderId: order.id,
      orderNumber: `R-${order.orderNumber}`,
      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        line1: order.shippingAddress.line1,
        line2: order.shippingAddress.line2,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        country: order.shippingAddress.country,
        postalCode: order.shippingAddress.postalCode,
      },
      items: order.items.map((i: any) => ({
        productName: i.productName,
        sku: i.sku,
        quantity: i.quantity,
        unitPrice: Number(i.price),
      })),
      weightGrams: 500,
      dimensions: { length: 20, breadth: 15, height: 10 },
      isCOD: false,
      pickupLocationCode: locationCode,
      idempotencyKey,
    });

    const now = new Date();
    return prisma.$transaction(async (tx) => {
      const s = await tx.shipment.create({
        data: {
          order: { connect: { id: orderId } },
          provider: process.env['SHIPPING_PROVIDER']?.toUpperCase() ?? 'MOCK',
          externalShipmentId: result.externalShipmentId,
          externalOrderId: result.externalOrderId,
          externalAwbNumber: result.externalAwbNumber,
          courierName: result.courierName,
          courierCode: result.courierCode,
          trackingUrl: result.trackingUrl,
          status: ShipmentStatus.RETURN_REQUESTED,
          metadata: result.raw as any,
        },
      });

      await tx.shipmentTimeline.create({
        data: {
          shipmentId: s.id,
          status: 'RETURN_REQUESTED',
          description: `Return shipment created — AWB: ${result.externalAwbNumber}`,
          source: 'ADMIN',
          occurredAt: now,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.RETURN_SHIPMENT_CREATED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: { externalAwbNumber: result.externalAwbNumber },
        },
      });

      return s;
    });
  },

  /**
   * Append a timeline event to a shipment (used by webhook and cron sync).
   */
  appendTimeline: async (
    shipmentId: string,
    event: {
      status: string;
      location?: string;
      description: string;
      source: string;
      raw?: Record<string, unknown>;
      occurredAt?: Date;
    }
  ) => {
    return prisma.shipmentTimeline.create({
      data: {
        shipmentId,
        status: event.status,
        location: event.location,
        description: event.description,
        source: event.source,
        raw: event.raw as any,
        occurredAt: event.occurredAt ?? new Date(),
      },
    });
  },

  /**
   * Get ShippingSettings singleton (create with defaults if it doesn't exist).
   */
  getShippingSettings: async () => {
    return prisma.shippingSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton' },
      update: {},
    });
  },

  /**
   * Admin: Update shipping settings at runtime.
   */
  updateShippingSettings: async (data: {
    provider?: string;
    selectionStrategy?: string;
    autoAssignCourier?: boolean;
    autoSchedulePickup?: boolean;
    codEnabled?: boolean;
    defaultWeightGrams?: number;
    defaultLength?: number;
    defaultBreadth?: number;
    defaultHeight?: number;
    packagingExtraGrams?: number;
    defaultLocationId?: string | null;
    fragileHandlingNote?: string | null;
  }) => {
    return prisma.shippingSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...data },
      update: data,
    });
  },
};
