/**
 * Phase 7.4 Enterprise Payment Service
 * Idempotent payment lifecycle orchestrator with formal state machine transitions and audit logging.
 */

import prisma from '../prisma';
import { paymentProvider } from '../providers/payment';
import { paymentRepository } from '../repositories/payment.repository';
import { orderRepository } from '../repositories/order.repository';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { OrderStatus, PaymentStatus, PaymentMethod, AuditAction, AuditActorType } from '@prisma/client';
import { eventDispatcher, PaymentEvents } from '../events';
import logger from '../lib/logger';
import { PaymentStateMachine } from './payment.types';

export const paymentService = {
  /**
   * Helper to log payment status transition in PaymentAuditLog
   */
  logPaymentAudit: async (
    paymentId: string,
    oldStatus: string | null,
    newStatus: string,
    reason?: string,
    actorType: string = 'SYSTEM',
    actorId?: string,
    details?: any
  ) => {
    try {
      await prisma.paymentAuditLog.create({
        data: {
          paymentId,
          oldStatus,
          newStatus,
          reason: reason || null,
          actorType,
          actorId: actorId || null,
          details: details ? (details as any) : undefined,
        },
      });
    } catch (err) {
      logger.error({ err, paymentId }, 'Failed to write payment audit log');
    }
  },

  /**
   * Get public payment config
   */
  getPaymentConfig: async () => {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    return {
      keyId,
      isLive: keyId.startsWith('rzp_live_'),
      currency: 'INR',
    };
  },

  /**
   * Step 1: Create a Razorpay Order
   */
  createRazorpayOrder: async (orderId: string, userId: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);

    if (order.paymentMethod === PaymentMethod.COD) {
      throw new AppError('COD orders do not require Razorpay online order creation', HTTP_STATUS.BAD_REQUEST);
    }

    if ([OrderStatus.CANCELLED as string, OrderStatus.REFUNDED as string].includes(order.orderStatus as string)) {
      throw new AppError(`Cannot initiate payment for a ${order.orderStatus} order`, HTTP_STATUS.BAD_REQUEST);
    }

    const amountInPaise = Math.round(Number(order.grandTotal) * 100);

    const providerOrder = await paymentProvider.createOrder({
      orderId: order.id,
      amount: amountInPaise,
      currency: order.currency || 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order.id, orderNumber: order.orderNumber },
    });

    const existingPayment = await paymentRepository.findByOrderId(orderId);
    let payment;

    if (existingPayment) {
      const oldStatus = existingPayment.status;
      payment = await prisma.payment.update({
        where: { orderId },
        data: {
          providerOrderId: providerOrder.providerOrderId,
          status: PaymentStatus.PENDING,
          failureReason: null,
          failureCode: null,
        },
      });
      await paymentService.logPaymentAudit(
        payment.id,
        oldStatus,
        PaymentStateMachine.INITIATED,
        'Razorpay Order recreated / resumed',
        'USER',
        userId
      );
    } else {
      payment = await paymentRepository.create({
        order: { connect: { id: orderId } },
        providerOrderId: providerOrder.providerOrderId,
        amount: order.grandTotal,
        currency: order.currency || 'INR',
        status: PaymentStatus.PENDING,
      });
      await paymentService.logPaymentAudit(
        payment.id,
        PaymentStateMachine.CREATED,
        PaymentStateMachine.INITIATED,
        'Initial Razorpay Order created',
        'USER',
        userId
      );
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
   * Step 2: Verify Razorpay payment from frontend popup HMAC signature callback
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

    if (payment.status === PaymentStatus.CAPTURED) {
      logger.warn({ orderId, razorpayPaymentId }, 'Payment already captured — idempotent return');
      return { order, payment };
    }

    // Verify HMAC signature
    const isValid = paymentProvider.verifySignature({
      providerOrderId: razorpayOrderId,
      providerPaymentId: razorpayPaymentId,
      providerSignature: razorpaySignature,
    });

    if (!isValid) {
      await paymentRepository.updateStatus(payment.id, PaymentStatus.FAILED, {
        failureReason: 'Invalid payment signature — possible tampering',
        failureCode: 'SIGNATURE_MISMATCH',
      });
      await paymentService.logPaymentAudit(
        payment.id,
        payment.status,
        PaymentStateMachine.FAILED_FINAL,
        'Signature mismatch detected during verification',
        'SYSTEM',
        userId
      );
      throw new AppError('Payment verification failed — invalid signature', HTTP_STATUS.BAD_REQUEST);
    }

    // Capture payment & order update in transaction
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

      return { updatedOrder, updatedPayment };
    });

    await paymentService.logPaymentAudit(
      payment.id,
      payment.status,
      PaymentStateMachine.CAPTURED,
      'Payment HMAC verified and captured via frontend callback',
      'USER',
      userId
    );

    eventDispatcher
      .emit(PaymentEvents.CAPTURED, {
        order: updatedOrder,
        payment: updatedPayment,
      })
      .catch((err) => logger.error({ err }, 'Failed to emit payment.captured event'));

    return { order: updatedOrder, payment: updatedPayment };
  },

  /**
   * Dedicated Webhook Payment Capture
   * Used when Razorpay sends a validated webhook event (signature verified via X-Razorpay-Signature)
   */
  captureWebhookPayment: async (orderId: string, providerOrderId: string, providerPaymentId: string) => {
    const payment = await paymentRepository.findByOrderId(orderId);
    if (!payment) {
      logger.warn({ orderId, providerOrderId }, '[PaymentService] Webhook capture — payment not found');
      return null;
    }

    if (payment.status === PaymentStatus.CAPTURED) {
      logger.info({ orderId }, '[PaymentService] Webhook capture — already captured (idempotent)');
      return payment;
    }

    const { updatedOrder, updatedPayment } = await prisma.$transaction(async (tx) => {
      const now = new Date();

      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          providerOrderId,
          providerPaymentId,
          status: PaymentStatus.CAPTURED,
          paidAt: now,
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.CAPTURED,
          orderStatus: OrderStatus.CONFIRMED,
          paymentReference: providerPaymentId,
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
          previousStatus: updatedOrder.orderStatus,
          newStatus: OrderStatus.CONFIRMED,
          changedBy: 'WEBHOOK',
          note: `Payment captured via Razorpay Webhook (Payment ID: ${providerPaymentId})`,
        },
      });

      return { updatedOrder, updatedPayment };
    });

    await paymentService.logPaymentAudit(
      payment.id,
      payment.status,
      PaymentStateMachine.CAPTURED,
      'Captured asynchronously via verified Razorpay Webhook',
      'WEBHOOK',
      'RAZORPAY'
    );

    eventDispatcher
      .emit(PaymentEvents.CAPTURED, {
        order: updatedOrder,
        payment: updatedPayment,
      })
      .catch((err) => logger.error({ err }, 'Failed to emit webhook payment.captured event'));

    return updatedPayment;
  },

  /**
   * Handle Payment Failure with Inventory Auto-Restoration
   */
  handlePaymentFailure: async (orderId: string, failureReason: string, failureCode?: string) => {
    const payment = await paymentRepository.findByOrderId(orderId);
    if (!payment) throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);

    if (payment.status === PaymentStatus.FAILED) {
      return payment;
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

      // Restore product stock
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
    });

    await paymentService.logPaymentAudit(
      payment.id,
      payment.status,
      PaymentStateMachine.FAILED,
      failureReason,
      'SYSTEM',
      'RAZORPAY',
      { failureCode }
    );

    const updatedPayment = await paymentRepository.findByOrderId(orderId);
    const updatedOrder = await orderRepository.findById(orderId);

    eventDispatcher
      .emit(PaymentEvents.FAILED, {
        order: updatedOrder,
        payment: updatedPayment,
      })
      .catch(() => {});

    return updatedPayment;
  },
};
