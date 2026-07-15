/**
 * Shipment Service
 *
 * Manages shipment lifecycle using the ShippingProvider abstraction.
 * Events are emitted post-commit — notification listeners handle emails.
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

export const shipmentService = {
  /**
   * Admin: Create a shipment for a CONFIRMED/PROCESSING/HANDCRAFTING order.
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

    // Call shipping provider
    const shipmentDetails = await shippingProvider.createShipment({
      orderId: order.id,
      orderNumber: order.orderNumber,
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
      items: order.items.map((item) => ({
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
      })),
    });

    const { shipment: createdShipment } = await prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.create({
        data: {
          order: { connect: { id: orderId } },
          provider: process.env.SHIPPING_PROVIDER?.toUpperCase() || 'MOCK',
          trackingNumber: shipmentDetails.trackingNumber,
          carrier: shipmentDetails.carrier,
          shippingMethod: shipmentDetails.shippingMethod,
          estimatedDelivery: shipmentDetails.estimatedDelivery,
          labelUrl: shipmentDetails.labelUrl,
          status: ShipmentStatus.PACKING,
          metadata: shipmentDetails.raw as any,
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
          note: `Shipment created — ${shipmentDetails.carrier} / ${shipmentDetails.trackingNumber}`,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.SHIPMENT_CREATED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: { trackingNumber: shipmentDetails.trackingNumber, carrier: shipmentDetails.carrier },
        },
      });

      return { shipment };
    });

    eventDispatcher.emit(ShipmentEvents.CREATED, {
      order,
      shipment: createdShipment,
    }).catch((err) => logger.error({ err }, 'Failed to emit shipment.created'));

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
          note: `Shipped via ${shipment.carrier} — ${shipment.trackingNumber}`,
        },
      });

      return updated;
    });

    eventDispatcher.emit(ShipmentEvents.SHIPPED, {
      order,
      shipment: updatedShipment,
    }).catch((err) => logger.error({ err }, 'Failed to emit shipment.shipped'));

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

      return updated;
    });

    eventDispatcher.emit(ShipmentEvents.DELIVERED, {
      order,
      shipment: updatedShipment,
    }).catch((err) => logger.error({ err }, 'Failed to emit shipment.delivered'));

    return updatedShipment;
  },

  /**
   * Customer: Get tracking info for their order's shipment
   */
  getShipmentForOrder: async (orderId: string, userId: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    return shipmentRepository.findByOrderId(orderId);
  },

  /**
   * Get live tracking from provider
   */
  getLiveTracking: async (orderId: string, userId: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    const shipment = await shipmentRepository.findByOrderId(orderId);
    if (!shipment) throw new AppError('No shipment found for this order', HTTP_STATUS.NOT_FOUND);
    if (!shipment.trackingNumber) throw new AppError('Tracking number not yet assigned', HTTP_STATUS.NOT_FOUND);

    return shippingProvider.getTrackingStatus(shipment.trackingNumber);
  },
};
