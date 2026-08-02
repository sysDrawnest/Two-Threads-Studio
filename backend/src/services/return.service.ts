import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ReturnStatus, OrderStatus, ReturnDisposition, AuditAction, AuditActorType, PaymentStatus } from '@prisma/client';
import { paymentService } from './payment.service';
import { eventDispatcher, ReturnEvents } from '../events';
import logger from '../lib/logger';

export const returnService = {
  /**
   * Admin: list return requests with filters
   */
  listReturnRequests: async (filters: {
    status?: ReturnStatus;
    fraudFlagged?: boolean;
    autoApproved?: boolean;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.fraudFlagged !== undefined) where.fraudFlagged = filters.fraudFlagged;
    if (filters.autoApproved !== undefined) where.autoApproved = filters.autoApproved;
    if (filters.startDate || filters.endDate) {
      where.requestedAt = {};
      if (filters.startDate) where.requestedAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.requestedAt.lte = new Date(filters.endDate);
    }
    if (filters.search) {
      where.OR = [
        { order: { orderNumber: { contains: filters.search, mode: 'insensitive' } } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
        { user: { firstName: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const [requests, total] = await Promise.all([
      prisma.returnRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { requestedAt: 'desc' },
        include: {
          order: { select: { orderNumber: true, grandTotal: true, couponDiscount: true } },
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          items: { include: { orderItem: { select: { productName: true, productImage: true, quantity: true } } } },
          timeline: { orderBy: { createdAt: 'asc' } },
        },
      }),
      prisma.returnRequest.count({ where }),
    ]);

    return { requests, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Admin: get single return request with full detail
   */
  getReturnRequest: async (returnId: string) => {
    const request = await prisma.returnRequest.findUnique({
      where: { id: returnId },
      include: {
        order: {
          include: {
            items: true,
            payment: true,
            shippingAddress: true,
          },
        },
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        items: {
          include: {
            orderItem: true,
          },
        },
        timeline: { orderBy: { createdAt: 'asc' } },
        refunds: { include: { timeline: { orderBy: { createdAt: 'asc' } } } },
      },
    });

    if (!request) throw new AppError('Return request not found', HTTP_STATUS.NOT_FOUND);
    return request;
  },

  /**
   * Admin: approve a return request (→ APPROVED). Does NOT refund yet — refund happens after inspection.
   */
  approveReturn: async (returnId: string, adminId: string, data: { note?: string; approvedAmount?: number; refundType?: string }) => {
    const request = await returnService.getReturnRequest(returnId);

    if (request.status !== ReturnStatus.REQUESTED) {
      throw new AppError(`Cannot approve a return in status ${request.status}`, HTTP_STATUS.BAD_REQUEST);
    }

    const approvedAmount = data.approvedAmount ?? Number(request.requestedAmount);

    const updated = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.returnRequest.update({
        where: { id: returnId },
        data: {
          status: ReturnStatus.APPROVED,
          adminNote: data.note,
          approvedAmount: approvedAmount,
          refundType: (data.refundType as any) ?? request.refundType,
          approvedAt: new Date(),
        },
      });

      await tx.returnTimeline.create({
        data: {
          returnRequestId: returnId,
          status: ReturnStatus.APPROVED,
          note: data.note || 'Return approved by admin. Pickup instructions sent.',
          actorType: 'ADMIN',
          actorId: adminId,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId: request.orderId,
          action: AuditAction.STATUS_CHANGED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: { event: 'RETURN_APPROVED', returnId, approvedAmount },
        },
      });

      return updatedRequest;
    });

    logger.info({ returnId, adminId, approvedAmount }, '[Returns] Return approved');
    eventDispatcher.emit(ReturnEvents.APPROVED, { returnRequest: updated, adminId }).catch(() => {});
    return updated;
  },

  /**
   * Admin: reject a return request (→ REJECTED). Reverts order status to DELIVERED.
   */
  rejectReturn: async (returnId: string, adminId: string, note: string) => {
    const request = await returnService.getReturnRequest(returnId);

    if (!['REQUESTED', 'INSPECTION_FAILED'].includes(request.status)) {
      throw new AppError(`Cannot reject a return in status ${request.status}`, HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.$transaction(async (tx) => {
      await tx.returnRequest.update({
        where: { id: returnId },
        data: { status: ReturnStatus.REJECTED, adminNote: note, resolvedAt: new Date() },
      });

      // Revert order status back to DELIVERED
      await tx.order.update({
        where: { id: request.orderId },
        data: { orderStatus: OrderStatus.DELIVERED },
      });

      await tx.returnTimeline.create({
        data: {
          returnRequestId: returnId,
          status: ReturnStatus.REJECTED,
          note,
          actorType: 'ADMIN',
          actorId: adminId,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId: request.orderId,
          action: AuditAction.STATUS_CHANGED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: { event: 'RETURN_REJECTED', returnId, note },
        },
      });
    });

    logger.info({ returnId, adminId }, '[Returns] Return rejected');
    eventDispatcher.emit(ReturnEvents.REJECTED, { returnRequest: request, adminId, note }).catch(() => {});
  },

  /**
   * Admin: mark item as picked up from customer (→ PICKED_UP)
   */
  markPickedUp: async (returnId: string, adminId: string) => {
    const request = await returnService.getReturnRequest(returnId);
    if (request.status !== ReturnStatus.APPROVED) {
      throw new AppError(`Cannot mark picked up from status ${request.status}`, HTTP_STATUS.BAD_REQUEST);
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.returnRequest.update({
        where: { id: returnId },
        data: { status: ReturnStatus.PICKED_UP },
      });
      await tx.returnTimeline.create({
        data: { returnRequestId: returnId, status: ReturnStatus.PICKED_UP, actorType: 'ADMIN', actorId: adminId, note: 'Item picked up from customer.' },
      });
      eventDispatcher.emit(ReturnEvents.PICKED_UP, { returnRequest: updated, adminId }).catch(() => {});
      return updated;
    });
  },

  /**
   * Admin: mark item received at warehouse (→ RECEIVED → INSPECTION_PENDING)
   */
  markReceived: async (returnId: string, adminId: string) => {
    const request = await returnService.getReturnRequest(returnId);
    if (!['PICKED_UP', 'IN_TRANSIT'].includes(request.status)) {
      throw new AppError(`Cannot mark received from status ${request.status}`, HTTP_STATUS.BAD_REQUEST);
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.returnRequest.update({
        where: { id: returnId },
        data: { status: ReturnStatus.INSPECTION_PENDING, receivedAt: new Date() },
      });
      await tx.returnTimeline.create({
        data: { returnRequestId: returnId, status: ReturnStatus.RECEIVED, actorType: 'ADMIN', actorId: adminId, note: 'Package received at warehouse.' },
      });
      await tx.returnTimeline.create({
        data: { returnRequestId: returnId, status: ReturnStatus.INSPECTION_PENDING, actorType: 'SYSTEM', note: 'Queued for quality inspection.' },
      });
      eventDispatcher.emit(ReturnEvents.RECEIVED, { returnRequest: updated, adminId }).catch(() => {});
      return updated;
    });
  },

  /**
   * Admin: record inspection result.
   * If passed → trigger refund → REFUNDED → order = RETURNED.
   * If failed → INSPECTION_FAILED (admin can then reject).
   */
  recordInspection: async (
    returnId: string,
    adminId: string,
    data: {
      passed: boolean;
      disposition?: ReturnDisposition;
      note?: string;
      adjustedAmount?: number;
    }
  ) => {
    const request = await returnService.getReturnRequest(returnId);
    if (request.status !== ReturnStatus.INSPECTION_PENDING) {
      throw new AppError(`Cannot record inspection from status ${request.status}`, HTTP_STATUS.BAD_REQUEST);
    }

    if (!data.passed) {
      // Inspection failed
      await prisma.$transaction(async (tx) => {
        await tx.returnRequest.update({
          where: { id: returnId },
          data: {
            status: ReturnStatus.INSPECTION_FAILED,
            inspectorNote: data.note,
            inspectedAt: new Date(),
            inspectedBy: adminId,
            disposition: data.disposition,
          },
        });
        await tx.returnTimeline.create({
          data: {
            returnRequestId: returnId,
            status: ReturnStatus.INSPECTION_FAILED,
            note: data.note || 'Item did not pass quality inspection.',
            actorType: 'ADMIN',
            actorId: adminId,
          },
        });
      });
      logger.info({ returnId, adminId }, '[Returns] Inspection failed');
      eventDispatcher.emit(ReturnEvents.INSPECTION_FAILED, { returnRequest: request, adminId, note: data.note }).catch(() => {});
      return;
    }

    // Inspection passed — compute final refund amount
    const finalAmount = data.adjustedAmount ?? Number(request.approvedAmount ?? request.requestedAmount);
    const restockingFee = Number(request.restockingFee);
    const finalRefund = Math.max(0, finalAmount - restockingFee);

    // Handle inventory restock if disposition = RESTOCK
    await prisma.$transaction(async (tx) => {
      // Update return request
      await tx.returnRequest.update({
        where: { id: returnId },
        data: {
          status: ReturnStatus.REFUND_PROCESSING,
          inspectorNote: data.note,
          inspectedAt: new Date(),
          inspectedBy: adminId,
          disposition: data.disposition,
          finalRefundAmount: finalRefund,
        },
      });

      await tx.returnTimeline.create({
        data: {
          returnRequestId: returnId,
          status: ReturnStatus.INSPECTION_PASSED,
          note: data.note || 'Item passed quality inspection. Initiating refund.',
          actorType: 'ADMIN',
          actorId: adminId,
        },
      });

      await tx.returnTimeline.create({
        data: {
          returnRequestId: returnId,
          status: ReturnStatus.REFUND_PROCESSING,
          note: `Refund of ₹${finalRefund.toFixed(2)} being processed.`,
          actorType: 'SYSTEM',
        },
      });

      // Restock inventory if applicable
      if (data.disposition === 'RESTOCK') {
        for (const item of request.items) {
          const orderItem = item.orderItem as any;
          if (orderItem?.productId) {
            await tx.product.update({
              where: { id: orderItem.productId },
              data: { stockQuantity: { increment: item.quantity } },
            }).catch(() => { /* product may not have stock tracking */ });
          }
        }
      }
    });

    // Trigger refund process via paymentService
    try {
      const payment = request.order.payment as any;
      if (payment?.id) {
        await paymentService.processRefund(
          payment.id,
          adminId,
          finalRefund,
          `Return approved — ${request.reason}`,
          returnId
        );
      } else {
        // Fallback for orders without explicit payment record
        await prisma.$transaction(async (tx) => {
          await tx.returnRequest.update({
            where: { id: returnId },
            data: { status: ReturnStatus.REFUNDED, resolvedAt: new Date(), refundProcessedAt: new Date() },
          });
          await tx.order.update({
            where: { id: request.orderId },
            data: { orderStatus: OrderStatus.RETURNED, paymentStatus: PaymentStatus.REFUNDED },
          });
          await tx.returnTimeline.create({
            data: {
              returnRequestId: returnId,
              status: ReturnStatus.REFUNDED,
              note: `₹${finalRefund.toFixed(2)} refund processed to customer.`,
              actorType: 'SYSTEM',
            },
          });
        });
      }

      logger.info({ returnId, finalRefund }, '[Returns] Refund workflow step completed');
      eventDispatcher.emit(ReturnEvents.REFUND_INITIATED, { returnRequest: request, finalRefund }).catch(() => {});
    } catch (err: any) {
      logger.error({ returnId, err: err.message }, '[Returns] Refund failed after inspection');
      await prisma.returnTimeline.create({
        data: {
          returnRequestId: returnId,
          status: ReturnStatus.REFUND_PROCESSING,
          note: `Refund attempt failed: ${err.message}. Admin action required to retry.`,
          actorType: 'SYSTEM',
        },
      }).catch(() => {});
      throw err;
    }
  },

  /**
   * Admin: Schedule reverse pickup for approved return request
   */
  scheduleReturnPickup: async (
    returnId: string,
    adminId: string,
    data: {
      courierPartner: string;
      trackingNumber: string;
      trackingUrl?: string;
      shipmentId?: string;
      estimatedDeliveryDays?: number;
      pickupNote?: string;
    }
  ) => {
    const request = await prisma.returnRequest.findUnique({ where: { id: returnId } });
    if (!request) throw new AppError('Return request not found', HTTP_STATUS.NOT_FOUND);

    const now = new Date();
    const estimatedDelivery = data.estimatedDeliveryDays
      ? new Date(now.getTime() + data.estimatedDeliveryDays * 86400000)
      : new Date(now.getTime() + 3 * 86400000); // 3 days default

    const updated = await prisma.$transaction(async (tx) => {
      const updatedReq = await tx.returnRequest.update({
        where: { id: returnId },
        data: {
          status: ReturnStatus.PICKUP_SCHEDULED,
          courierPartner: data.courierPartner,
          trackingNumber: data.trackingNumber,
          trackingUrl: data.trackingUrl || `https://track.shiprocket.in/${data.trackingNumber}`,
          shipmentId: data.shipmentId || `SR-${Date.now()}`,
          pickupStatus: 'PICKUP_SCHEDULED',
          pickupScheduledAt: now,
          estimatedDelivery,
          lastTrackingSync: now,
        },
      });

      await tx.returnTimeline.create({
        data: {
          returnRequestId: returnId,
          status: ReturnStatus.PICKUP_SCHEDULED,
          note: data.pickupNote || `Pickup scheduled with ${data.courierPartner}. Tracking AWB: ${data.trackingNumber}`,
          actorType: 'ADMIN',
          actorId: adminId,
        },
      });

      return updatedReq;
    });

    eventDispatcher.emit(ReturnEvents.PICKUP_CREATED, { returnRequest: updated }).catch(() => {});
    return updated;
  },

  /**
   * Partner / Webhook / Admin: Update tracking status (picked up, transit, warehouse received)
   */
  updateReturnTracking: async (
    returnId: string,
    data: {
      status: ReturnStatus;
      pickupStatus?: string;
      note?: string;
      actorType?: 'SYSTEM' | 'ADMIN' | 'COURIER';
    }
  ) => {
    const now = new Date();
    const updateData: any = {
      status: data.status,
      lastTrackingSync: now,
    };
    if (data.pickupStatus) updateData.pickupStatus = data.pickupStatus;
    if (data.status === ReturnStatus.PICKED_UP || data.status === ReturnStatus.IN_TRANSIT) {
      updateData.pickedUpAt = now;
    }
    if (data.status === ReturnStatus.RECEIVED) {
      updateData.receivedAt = now;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedReq = await tx.returnRequest.update({
        where: { id: returnId },
        data: updateData,
      });

      await tx.returnTimeline.create({
        data: {
          returnRequestId: returnId,
          status: data.status,
          note: data.note || `Return package status updated to ${data.status.replace(/_/g, ' ')}`,
          actorType: data.actorType || 'COURIER',
        },
      });

      return updatedReq;
    });

    return updated;
  },

  /**
   * Analytics for admin dashboard
   */
  getReturnAnalytics: async (startDate?: string, endDate?: string) => {
    const where: any = {};
    if (startDate || endDate) {
      where.requestedAt = {};
      if (startDate) where.requestedAt.gte = new Date(startDate);
      if (endDate) where.requestedAt.lte = new Date(endDate);
    }

    const [total, byStatus, byReason, fraudFlagged, totalRefunded, avgStats] = await Promise.all([
      prisma.returnRequest.count({ where }),
      prisma.returnRequest.groupBy({ by: ['status'], _count: true, where }),
      prisma.returnRequest.groupBy({ by: ['reason'], _count: true, where }),
      prisma.returnRequest.count({ where: { ...where, fraudFlagged: true } }),
      prisma.returnRequest.aggregate({
        _sum: { finalRefundAmount: true },
        where: { ...where, status: ReturnStatus.REFUNDED },
      }),
      prisma.returnRequest.aggregate({
        _avg: {
          requestedAmount: true,
          approvedAmount: true,
          restockingFee: true,
          finalRefundAmount: true,
        },
        where: { ...where, resolvedAt: { not: null } },
      }),
    ]);

    const pending = byStatus.find(s => s.status === 'REQUESTED')?._count ?? 0;
    const approved = byStatus.find(s => s.status === 'APPROVED')?._count ?? 0;
    const refunded = byStatus.find(s => s.status === 'REFUNDED')?._count ?? 0;
    const rejected = byStatus.find(s => s.status === 'REJECTED')?._count ?? 0;
    const inspectionFailed = byStatus.find(s => s.status === 'INSPECTION_FAILED')?._count ?? 0;

    return {
      total,
      pending,
      approved,
      refunded,
      rejected,
      inspectionFailed,
      fraudFlagged,
      totalRefundedAmount: Number(totalRefunded._sum.finalRefundAmount ?? 0),
      averageRefundedAmount: Number(avgStats._avg.finalRefundAmount ?? 0),
      averageRequestedAmount: Number(avgStats._avg.requestedAmount ?? 0),
      byReason: byReason.map(r => ({ reason: r.reason, count: r._count })),
      byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
    };
  },
};

