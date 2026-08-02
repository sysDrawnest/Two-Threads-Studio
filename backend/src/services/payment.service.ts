/**
 * Payment Service
 *
 * Orchestrates the full payment lifecycle using:
 *   - paymentProvider (abstraction over Razorpay)
 *   - paymentRepository (database persistence)
 *   - orderRepository (order status transitions)
 *   - eventDispatcher (triggers notification listeners)
 *
 * Rules enforced here:
 *   1. Frontend never decides payment status — only verifyPayment() does
 *   2. Idempotency: providerPaymentId @unique prevents duplicate capture
 *   3. Inventory is restored on payment failure
 *   4. All status changes go through $transaction
 */

import prisma from '../prisma';
import { paymentProvider } from '../providers/payment';
import { paymentRepository } from '../repositories/payment.repository';
import { orderRepository } from '../repositories/order.repository';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  AuditAction,
  AuditActorType,
  RefundStatus,
  ReturnStatus,
} from '@prisma/client';
import { eventDispatcher, PaymentEvents, OrderEvents, RefundEvents } from '../events';
import logger from '../lib/logger';

export const paymentService = {
  /**
   * Step 1: Create a Razorpay order before opening the payment popup.
   * Called by the frontend before initiating checkout.
   *
   * Idempotent: if a PENDING payment already exists for this order,
   * a new Razorpay order is created and the existing Payment record is updated.
   */
  createRazorpayOrder: async (orderId: string, userId: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    if (order.paymentMethod === PaymentMethod.COD) {
      throw new AppError('COD orders do not require Razorpay order creation', HTTP_STATUS.BAD_REQUEST);
    }

    if ([OrderStatus.CANCELLED as string, OrderStatus.REFUNDED as string].includes(order.orderStatus as string)) {
      throw new AppError(
        `Cannot initiate payment for a ${order.orderStatus} order`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Amount in paise (INR smallest unit)
    const amountInPaise = Math.round(Number(order.grandTotal) * 100);

    const providerOrder = await paymentProvider.createOrder({
      orderId: order.id,
      amount: amountInPaise,
      currency: order.currency || 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order.id, orderNumber: order.orderNumber },
    });

    // Upsert Payment record
    const existingPayment = await paymentRepository.findByOrderId(orderId);
    let payment;
    if (existingPayment) {
      payment = await prisma.payment.update({
        where: { orderId },
        data: {
          providerOrderId: providerOrder.providerOrderId,
          status: PaymentStatus.PENDING,
          failureReason: null,
          failureCode: null,
        },
      });
    } else {
      payment = await paymentRepository.create({
        order: { connect: { id: orderId } },
        providerOrderId: providerOrder.providerOrderId,
        amount: order.grandTotal,
        currency: order.currency || 'INR',
        status: PaymentStatus.PENDING,
      });
    }

    return {
      razorpayOrderId: providerOrder.providerOrderId,
      amount: providerOrder.amount,
      currency: providerOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      payment,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        grandTotal: order.grandTotal,
      },
    };
  },

  /**
   * Step 2: Verify Razorpay payment after popup success callback.
   * NEVER trust the frontend — always verify HMAC signature server-side.
   *
   * On success: Payment → CAPTURED, Order → CONFIRMED → PROCESSING
   * On tamper/failure: throws 400
   */
  verifyPayment: async (
    orderId: string,
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    const payment = await paymentRepository.findByOrderId(orderId);
    if (!payment) throw new AppError('Payment record not found', HTTP_STATUS.NOT_FOUND);

    // Idempotency: if already captured, return success without re-processing
    if (payment.status === PaymentStatus.CAPTURED) {
      logger.warn({ orderId, razorpayPaymentId }, 'Payment already captured — idempotent return');
      return { order, payment };
    }

    // Verify HMAC signature — this is the security gate
    const isValid = paymentProvider.verifySignature({
      providerOrderId: razorpayOrderId,
      providerPaymentId: razorpayPaymentId,
      providerSignature: razorpaySignature,
    });

    if (!isValid) {
      // Record the tampered attempt
      await paymentRepository.updateStatus(payment.id, PaymentStatus.FAILED, {
        failureReason: 'Invalid payment signature — possible tampering',
        failureCode: 'SIGNATURE_MISMATCH',
      });
      throw new AppError('Payment verification failed — invalid signature', HTTP_STATUS.BAD_REQUEST);
    }

    // Capture in a transaction: update Payment + Order atomically
    const { updatedOrder, updatedPayment } = await prisma.$transaction(async (tx) => {
      const now = new Date();

      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          providerPaymentId: razorpayPaymentId,
          providerSignature: razorpaySignature,
          status: PaymentStatus.CAPTURED,
          paidAt: now,
          metadata: { razorpayOrderId, razorpayPaymentId, razorpaySignature } as any,
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.CAPTURED,
          orderStatus: OrderStatus.CONFIRMED,
          paymentReference: razorpayPaymentId,
          paidAt: now,
        },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          previousStatus: order.orderStatus,
          newStatus: OrderStatus.CONFIRMED,
          changedBy: 'SYSTEM',
          note: `Payment captured — Razorpay ID: ${razorpayPaymentId}`,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.PAYMENT_CAPTURED,
          actorType: AuditActorType.SYSTEM,
          actorId: userId,
          details: { razorpayPaymentId, razorpayOrderId },
        },
      });

      return { updatedOrder, updatedPayment };
    });

    // Emit events post-commit (non-blocking)
    eventDispatcher.emit(PaymentEvents.CAPTURED, {
      order: updatedOrder,
      payment: updatedPayment,
    }).catch((err) => logger.error({ err }, 'Failed to emit payment.captured event'));

    // Emit Order Created now that payment is confirmed
    eventDispatcher.emit(OrderEvents.CREATED, updatedOrder).catch((err) => {
      logger.error({ err }, 'Failed to emit order created event');
    });

    return { order: updatedOrder, payment: updatedPayment };
  },

  /**
   * COD order confirmation — mark payment PENDING, order CONFIRMED.
   * No Razorpay involved.
   */
  confirmCodOrder: async (orderId: string, userId: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    if (order.paymentMethod !== PaymentMethod.COD) {
      throw new AppError('This endpoint is only for COD orders', HTTP_STATUS.BAD_REQUEST);
    }

    if (order.orderStatus !== OrderStatus.PENDING) {
      throw new AppError('Order is not in a confirmable state', HTTP_STATUS.BAD_REQUEST);
    }

    const { updatedOrder, payment } = await prisma.$transaction(async (tx) => {
      // Create payment record with PENDING for COD
      const payment = await tx.payment.create({
        data: {
          order: { connect: { id: orderId } },
          amount: order.grandTotal,
          currency: order.currency || 'INR',
          status: PaymentStatus.PENDING,
          method: 'cod',
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { orderStatus: OrderStatus.CONFIRMED },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          previousStatus: OrderStatus.PENDING,
          newStatus: OrderStatus.CONFIRMED,
          changedBy: 'SYSTEM',
          note: 'COD order confirmed',
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.STATUS_CHANGED,
          actorType: AuditActorType.CUSTOMER,
          actorId: userId,
          details: { method: 'COD' },
        },
      });

      return { updatedOrder, payment };
    });

    // COD also triggers order confirmation email
    eventDispatcher.emit(OrderEvents.CREATED, updatedOrder).catch(() => {});

    return { order: updatedOrder, payment };
  },

  /**
   * Handle payment failure from webhook or frontend fallback.
   * Restores inventory on confirmed failures.
   */
  handlePaymentFailure: async (
    orderId: string,
    failureReason: string,
    failureCode?: string
  ) => {
    const payment = await paymentRepository.findByOrderId(orderId);
    if (!payment) throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);

    if (payment.status === PaymentStatus.FAILED) {
      return payment; // Already processed — idempotent
    }

    const order = await orderRepository.findById(orderId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED, failureReason, failureCode: failureCode || null },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { paymentStatus: PaymentStatus.FAILED },
      });

      // Restore inventory
      for (const item of order.items) {
        if (!item.productId) continue;
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        } else {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (product?.trackInventory) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { increment: item.quantity } },
            });
          }
        }
      }

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.PAYMENT_FAILED,
          actorType: AuditActorType.SYSTEM,
          actorId: 'SYSTEM',
          details: { failureReason, failureCode },
        },
      });
    });

    const updatedPayment = await paymentRepository.findByOrderId(orderId);
    const updatedOrder = await orderRepository.findById(orderId);

    eventDispatcher.emit(PaymentEvents.FAILED, {
      order: updatedOrder,
      payment: updatedPayment,
    }).catch(() => {});

    return updatedPayment;
  },

  /**
   * Admin: Process a refund (Razorpay or COD / Bank Transfer).
   * Creates a dedicated `Refund` entity, passes X-Payment-Idempotency header,
   * sets status to INITIATED, and relies on Webhook (or manual sync) for completion.
   */
  processRefund: async (
    paymentId: string,
    adminId: string,
    amount?: number,
    reason?: string,
    returnRequestId?: string
  ) => {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);

    const isOnline = payment.method === PaymentMethod.ONLINE && Boolean(payment.providerPaymentId);
    const refundAmountActual = amount || Number(payment.amount);
    const refundAmountPaise = Math.round(refundAmountActual * 100);

    // Derive X-Payment-Idempotency key from returnRequestId or paymentId
    const idempotencyKey = returnRequestId
      ? `idemp_rfnd_${returnRequestId}`
      : `idemp_rfnd_${paymentId}_${Date.now()}`;

    let refundResult: { refundId: string; raw?: any } = { refundId: '' };

    // Process external gateway refund for Razorpay online payments
    if (isOnline && payment.providerPaymentId) {
      try {
        const res = await paymentProvider.processRefund({
          providerPaymentId: payment.providerPaymentId,
          amount: refundAmountPaise,
          reason: reason || 'Customer refund',
          idempotencyKey,
        });
        refundResult = { refundId: res.refundId, raw: res.raw };
      } catch (err: any) {
        logger.error({ paymentId, err: err.message }, '[PaymentService] Razorpay gateway refund failed');

        // Record failed Refund attempt in DB for visibility & retry
        await prisma.refund.create({
          data: {
            paymentId,
            returnRequestId,
            orderId: payment.orderId,
            provider: payment.provider || 'RAZORPAY',
            status: RefundStatus.FAILED,
            amount: refundAmountActual,
            reason: reason || 'Customer refund',
            idempotencyKey,
            failureReason: err.message || 'Razorpay refund failed',
            gatewayErrorDesc: err.message,
            failedAt: new Date(),
          },
        }).catch(() => {});

        throw new AppError(`Gateway refund failed: ${err.message || 'Razorpay error'}`, HTTP_STATUS.BAD_GATEWAY);
      }
    } else {
      // Manual / COD refund reference
      refundResult = {
        refundId: `rfnd_manual_${Date.now().toString(36)}`,
        raw: { type: 'manual', note: 'Manual / COD / Store credit refund' },
      };
    }

    const isPartial = refundAmountActual < Number(payment.amount);
    const initialRefundStatus = isOnline ? RefundStatus.INITIATED : RefundStatus.PROCESSED;

    const refundRecord = await prisma.$transaction(async (tx) => {
      // 1. Create Refund record
      const refund = await tx.refund.create({
        data: {
          paymentId,
          returnRequestId,
          orderId: payment.orderId,
          provider: payment.provider || 'RAZORPAY',
          providerRefundId: refundResult.refundId,
          status: initialRefundStatus,
          amount: refundAmountActual,
          reason: reason || 'Customer return refund',
          idempotencyKey,
          providerPayload: refundResult.raw as any,
          initiatedAt: new Date(),
          processedAt: isOnline ? null : new Date(),
        },
      });

      // 2. Update Payment status & metadata
      const newPaymentStatus = isOnline
        ? (isPartial ? PaymentStatus.PARTIALLY_REFUNDED : payment.status)
        : (isPartial ? PaymentStatus.PARTIALLY_REFUNDED : PaymentStatus.REFUNDED);

      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: newPaymentStatus,
          metadata: {
            latestRefundId: refundResult.refundId,
            refundReason: reason || 'Customer return refund',
            refundAmount: refundAmountActual,
            ...(refundResult.raw || {}),
          } as any,
        },
      });

      // 3. Update Order status
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: isOnline ? PaymentStatus.PENDING : newPaymentStatus,
          orderStatus: isOnline ? OrderStatus.RETURNED : (isPartial ? OrderStatus.RETURNED : OrderStatus.REFUNDED),
        },
      });

      // 4. Update ReturnRequest status if attached
      if (returnRequestId) {
        await tx.returnRequest.update({
          where: { id: returnRequestId },
          data: {
            status: isOnline ? ReturnStatus.REFUND_PROCESSING : ReturnStatus.REFUNDED,
            razorpayRefundId: refundResult.refundId,
            refundStatus: isOnline ? 'initiated' : 'processed',
            refundInitiatedAt: new Date(),
            refundProcessedAt: isOnline ? null : new Date(),
          },
        });
      }

      await tx.orderAuditLog.create({
        data: {
          orderId: payment.orderId,
          action: AuditAction.REFUND_INITIATED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: { refundId: refundResult.refundId, amount: refundAmountActual, reason },
        },
      });

      return refund;
    });

    await paymentService.createTimelineEvent({
      refundId: refundRecord.id,
      status: initialRefundStatus,
      title: isOnline ? 'Refund Initiated' : 'Manual Refund Completed',
      description: isOnline 
        ? `Refund of ₹${refundAmountActual.toFixed(2)} submitted to Razorpay gateway.` 
        : `Manual refund of ₹${refundAmountActual.toFixed(2)} recorded successfully.`,
      source: isOnline ? 'SYSTEM' : 'ADMIN',
      metadata: { refundId: refundRecord.id, amount: refundAmountActual, isOnline },
    });

    const updatedPayment = await paymentRepository.findById(paymentId);
    const order = await orderRepository.findById(payment.orderId);

    eventDispatcher.emit(PaymentEvents.REFUND_INITIATED, {
      order,
      payment: updatedPayment,
      refund: refundRecord,
      refundAmount: refundAmountActual,
    }).catch(() => {});

    return { payment: updatedPayment, refund: refundRecord };
  },

  /**
   * Admin: Retry a failed refund using existing idempotency key
   */
  retryRefund: async (refundRecordId: string, adminId: string) => {
    const refund = await prisma.refund.findUnique({
      where: { id: refundRecordId },
      include: { payment: true },
    });

    if (!refund) throw new AppError('Refund record not found', HTTP_STATUS.NOT_FOUND);
    if (refund.status === RefundStatus.PROCESSED) {
      throw new AppError('Refund has already been processed successfully', HTTP_STATUS.BAD_REQUEST);
    }

    await paymentService.createTimelineEvent({
      refundId: refundRecordId,
      status: RefundStatus.INITIATED,
      title: 'Refund Retry Initiated',
      description: 'Retrying failed refund attempt on payment gateway.',
      source: 'ADMIN',
      metadata: { adminId },
    });

    return paymentService.processRefund(
      refund.paymentId,
      adminId,
      Number(refund.amount),
      refund.reason || 'Admin retry refund',
      refund.returnRequestId || undefined
    );
  },

  /**
   * Admin / Sync job: Fetch refund status directly from Razorpay for stuck refunds
   */
  syncRefundStatus: async (refundRecordId: string) => {
    const refund = await prisma.refund.findUnique({
      where: { id: refundRecordId },
      include: { payment: true, returnRequest: true },
    });

    if (!refund || !refund.providerRefundId) {
      throw new AppError('Refund record or Razorpay refund ID not found', HTTP_STATUS.NOT_FOUND);
    }

    if (!paymentProvider.fetchRefund) {
      throw new AppError('Gateway does not support fetching refund status', HTTP_STATUS.NOT_IMPLEMENTED);
    }

    const gatewayRefund = await paymentProvider.fetchRefund(refund.providerRefundId);

    if (gatewayRefund.status === 'processed' && refund.status !== RefundStatus.PROCESSED) {
      const now = new Date();
      const rrn = (gatewayRefund.raw as any)?.acquirer_data?.rrn || null;

      await prisma.$transaction(async (tx) => {
        await tx.refund.update({
          where: { id: refundRecordId },
          data: {
            status: RefundStatus.PROCESSED,
            processedAt: now,
            bankReferenceNumber: rrn,
            providerPayload: gatewayRefund.raw as any,
          },
        });

        await tx.payment.update({
          where: { id: refund.paymentId },
          data: { status: PaymentStatus.REFUNDED },
        });

        await tx.order.update({
          where: { id: refund.orderId },
          data: { paymentStatus: PaymentStatus.REFUNDED, orderStatus: OrderStatus.REFUNDED },
        });

        if (refund.returnRequestId) {
          await tx.returnRequest.update({
            where: { id: refund.returnRequestId },
            data: {
              status: ReturnStatus.REFUNDED,
              refundStatus: 'processed',
              bankReferenceNumber: rrn,
              refundProcessedAt: now,
              resolvedAt: now,
            },
          });

          await tx.returnTimeline.create({
            data: {
              returnRequestId: refund.returnRequestId,
              status: ReturnStatus.REFUNDED,
              note: `Bank Credit Completed — Credited to payment method${rrn ? ` (Bank RRN: ${rrn})` : ''}.`,
              actorType: 'SYSTEM',
            },
          });
        }
      });

      await paymentService.createTimelineEvent({
        refundId: refundRecordId,
        status: RefundStatus.PROCESSED,
        title: 'Refund Processed',
        description: `Refund completed successfully by bank${rrn ? ` (RRN: ${rrn})` : ''}.`,
        source: 'GATEWAY',
        metadata: { rrn },
      });

      logger.info({ refundRecordId }, '[PaymentService] Refund status synced successfully -> PROCESSED');
    }

    return prisma.refund.findUnique({ where: { id: refundRecordId } });
  },

  createTimelineEvent: async (params: {
    refundId: string;
    status: RefundStatus;
    title: string;
    description?: string;
    source: string;
    metadata?: any;
  }) => {
    const timeline = await prisma.refundTimeline.create({
      data: {
        refundId: params.refundId,
        status: params.status,
        title: params.title,
        description: params.description,
        source: params.source,
        metadata: params.metadata || {},
      },
    });

    eventDispatcher.emit(RefundEvents.TIMELINE_CREATED, { timeline }).catch(() => {});
    return timeline;
  },

  classifyFailureReason: (gatewayErrorCode?: string | null): string => {
    if (!gatewayErrorCode) return 'UNKNOWN_ERROR';
    const code = gatewayErrorCode.toUpperCase();
    if (code.includes('TIMEOUT') || code.includes('NETWORK')) return 'NETWORK_ERROR';
    if (code.includes('BALANCE')) return 'INSUFFICIENT_BALANCE';
    if (code.includes('REJECTED') || code.includes('DECLINED')) return 'BANK_REJECTED';
    if (code.includes('DUPLICATE')) return 'DUPLICATE_REQUEST';
    if (code.includes('BAD_REQUEST') || code.includes('INVALID')) return 'INVALID_PAYMENT';
    return 'GATEWAY_ERROR';
  },

  manualOverrideRefund: async (refundId: string, adminId: string, reason: string) => {
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: { payment: true },
    });

    if (!refund) throw new AppError('Refund record not found', HTTP_STATUS.NOT_FOUND);
    if (refund.status === RefundStatus.PROCESSED) {
      throw new AppError('Refund is already completed', HTTP_STATUS.BAD_REQUEST);
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.refund.update({
        where: { id: refundId },
        data: {
          status: RefundStatus.PROCESSED,
          processedAt: now,
          manualOverride: true,
          overrideReason: reason,
          overriddenBy: adminId,
          overriddenAt: now,
        },
      });

      await tx.payment.update({
        where: { id: refund.paymentId },
        data: { status: PaymentStatus.REFUNDED },
      });

      await tx.order.update({
        where: { id: refund.orderId },
        data: {
          paymentStatus: PaymentStatus.REFUNDED,
          orderStatus: OrderStatus.REFUNDED,
        },
      });

      if (refund.returnRequestId) {
        await tx.returnRequest.update({
          where: { id: refund.returnRequestId },
          data: {
            status: ReturnStatus.REFUNDED,
            refundStatus: 'processed',
            refundProcessedAt: now,
            resolvedAt: now,
          },
        });

        await tx.returnTimeline.create({
          data: {
            returnRequestId: refund.returnRequestId,
            status: ReturnStatus.REFUNDED,
            note: `Refund Manual Override — Completed offline by Admin. Reason: ${reason}`,
            actorType: 'ADMIN',
            actorId: adminId,
          },
        });
      }

      await tx.orderAuditLog.create({
        data: {
          orderId: refund.orderId,
          action: AuditAction.REFUND_OVERRIDDEN,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: { refundId, reason },
        },
      });
    });

    const updatedRefund = await prisma.refund.findUnique({ where: { id: refundId } });

    await paymentService.createTimelineEvent({
      refundId,
      status: RefundStatus.PROCESSED,
      title: 'Manual Override Applied',
      description: `Refund completed offline by administrator. Reason: ${reason}`,
      source: 'ADMIN',
      metadata: { adminId, reason },
    });

    return updatedRefund;
  },

  /**
   * Get payment by order ID (for customer)
   */
  getPaymentByOrderId: async (orderId: string, userId: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    return paymentRepository.findByOrderId(orderId);
  },

  /**
   * Admin: list all payments
   */
  adminListPayments: async (filters: { status?: PaymentStatus }, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      paymentRepository.findAll(filters, skip, limit),
      paymentRepository.countAll(filters),
    ]);
    return {
      payments,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  },
};
