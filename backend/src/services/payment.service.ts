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
} from '@prisma/client';
import { eventDispatcher, PaymentEvents, OrderEvents } from '../events';
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
   * Admin: Process a refund via Razorpay.
   */
  processRefund: async (
    paymentId: string,
    adminId: string,
    amount?: number,
    reason?: string
  ) => {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);

    if (payment.status !== PaymentStatus.CAPTURED) {
      throw new AppError('Only captured payments can be refunded', HTTP_STATUS.BAD_REQUEST);
    }

    if (!payment.providerPaymentId) {
      throw new AppError('Payment has no provider reference — cannot refund', HTTP_STATUS.BAD_REQUEST);
    }

    const refundAmountPaise = amount
      ? Math.round(amount * 100)
      : Math.round(Number(payment.amount) * 100);

    const refundResult = await paymentProvider.processRefund({
      providerPaymentId: payment.providerPaymentId,
      amount: refundAmountPaise,
      reason: reason || 'Customer refund',
    });

    const newStatus = amount && amount < Number(payment.amount)
      ? PaymentStatus.PARTIALLY_REFUNDED
      : PaymentStatus.REFUNDED;

    const refundAmountActual = amount || Number(payment.amount);

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: newStatus, metadata: { refundId: refundResult.refundId, ...refundResult.raw } as any },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: newStatus,
          orderStatus: newStatus === PaymentStatus.REFUNDED ? OrderStatus.REFUNDED : undefined,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId: payment.orderId,
          action: AuditAction.REFUND_INITIATED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: { refundId: refundResult.refundId, amount: refundAmountActual, reason },
        },
      });
    });

    const updatedPayment = await paymentRepository.findById(paymentId);
    const order = await orderRepository.findById(payment.orderId);

    eventDispatcher.emit(PaymentEvents.REFUND_INITIATED, {
      order,
      payment: updatedPayment,
      refundAmount: refundAmountActual,
    }).catch(() => {});

    return updatedPayment;
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
