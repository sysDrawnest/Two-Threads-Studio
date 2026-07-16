import prisma from '../prisma';
import { orderRepository } from '../repositories/order.repository';
import { cartService } from './cart.service';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import {
  OrderStatus,
  PaymentStatus,
  Prisma,
  PaymentMethod,
  CouponType,
  AuditAction,
  AuditActorType,
} from '@prisma/client';
import { eventDispatcher, OrderEvents } from '../events';
import { riskService } from './risk.service';
import { reviewQueueRepository } from '../repositories/review-queue.repository';
import logger from '../lib/logger';

export const orderService = {
  /**
   * Helper to generate unique order number in format: TTSYYMMDD-000001
   */
  generateOrderNumber: async (tx: Prisma.TransactionClient): Promise<string> => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `TTS${yy}${mm}${dd}`;

    const count = await tx.order.count({
      where: {
        orderNumber: {
          startsWith: datePrefix,
        },
      },
    });

    const serial = String(count + 1).padStart(6, '0');
    return `${datePrefix}-${serial}`;
  },

  /**
   * Create an order from a user's cart
   */
  createOrder: async (
    userId: string,
    params: {
      shippingAddressId: string;
      billingAddressId: string;
      notes?: string | null;
      paymentMethod?: PaymentMethod;
      couponCode?: string | null;
      couponDiscount?: number;
      promotionId?: string | null;
      couponType?: CouponType | null;
    }
  ) => {
    // 1. Verify address ownership
    const [shippingAddress, billingAddress] = await Promise.all([
      prisma.address.findFirst({
        where: { id: params.shippingAddressId, userId, deletedAt: null },
      }),
      prisma.address.findFirst({
        where: { id: params.billingAddressId, userId, deletedAt: null },
      }),
    ]);

    if (!shippingAddress) {
      throw new AppError('Shipping address not found or does not belong to user', HTTP_STATUS.BAD_REQUEST);
    }
    if (!billingAddress) {
      throw new AppError('Billing address not found or does not belong to user', HTTP_STATUS.BAD_REQUEST);
    }

    // 2. Fetch the cart
    const cart = await cartService.getCart({ userId });
    if (!cart || cart.items.length === 0) {
      throw new AppError('Your cart is empty', HTTP_STATUS.BAD_REQUEST);
    }

    // 2.5 Phase 5C: Risk Evaluation
    const finalPaymentMethod = params.paymentMethod || PaymentMethod.ONLINE;
    // Calculate estimated total for risk engine (discounts will be applied later, but subtotal is fine for risk thresholds)
    let estimatedTotal = 0;
    for (const item of cart.items) {
      estimatedTotal += Number(item.unitPrice) * item.quantity;
    }
    const grandTotalEstimate = Math.max(0, estimatedTotal - (params.couponDiscount || 0));

    const riskEval = await riskService.evaluateCheckout(userId, {
      orderTotal: grandTotalEstimate,
      paymentMethod: finalPaymentMethod,
      cartItems: cart.items.map((i) => ({
        productId: i.productId,
        engravingText: i.engravingText,
        customization: i.customization,
      })),
      shippingAddressId: params.shippingAddressId,
    });

    if (riskEval.decision === 'BLOCKED') {
      throw new AppError(riskEval.userMessage || 'Blocked', HTTP_STATUS.FORBIDDEN);
    }
    if (riskEval.decision === 'PREPAID_ONLY' && finalPaymentMethod === 'COD') {
      throw new AppError(riskEval.userMessage || 'Prepaid only', HTTP_STATUS.BAD_REQUEST);
    }
    if (riskEval.decision === 'REQUIRES_OTP') {
      throw new AppError('OTP_REQUIRED: ' + (riskEval.userMessage || 'OTP needed'), HTTP_STATUS.PRECONDITION_REQUIRED);
    }

    // 3. Complete Transaction
    const resultOrder = await prisma.$transaction(async (tx) => {
      const itemsToCreate = [];
      let calculatedSubtotal = 0;

      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (!product || product.status !== 'ACTIVE') {
          throw new AppError(`Product "${item.productName}" is no longer active or available`, HTTP_STATUS.BAD_REQUEST);
        }

        let variantSku: string | null = product.sku;
        let variantName: string | null = null;
        let finalUnitPrice = Number(product.price);

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (!variant || !variant.isActive) {
            throw new AppError(`Selected variant for "${item.productName}" is no longer active`, HTTP_STATUS.BAD_REQUEST);
          }
          variantSku = variant.sku || product.sku;
          variantName = `${variant.name}: ${variant.value}`;
          finalUnitPrice += Number(variant.priceAdjustment);

          if (product.trackInventory) {
            if (variant.stockQuantity < item.quantity) {
              throw new AppError(`Insufficient stock for "${item.productName} (${variantName})"`, HTTP_STATUS.BAD_REQUEST);
            }
            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stockQuantity: { decrement: item.quantity } },
            });
          }
        } else {
          if (product.trackInventory) {
            if (product.stockQuantity < item.quantity) {
              throw new AppError(`Insufficient stock for "${item.productName}"`, HTTP_STATUS.BAD_REQUEST);
            }
            await tx.product.update({
              where: { id: product.id },
              data: { stockQuantity: { decrement: item.quantity } },
            });
          }
        }

        const lineTotal = finalUnitPrice * item.quantity;
        calculatedSubtotal += lineTotal;

        itemsToCreate.push({
          productId: item.productId,
          variantId: item.variantId,
          productName: product.name,
          productSlug: product.slug,
          productImage: item.primaryImage,
          sku: variantSku,
          variantName,
          unitPrice: finalUnitPrice,
          quantity: item.quantity,
          lineTotal,
          customization: item.customization as any,
          engravingText: item.engravingText,
          giftWrap: item.giftWrap,
        });
      }

      const orderNumber = await orderService.generateOrderNumber(tx);

      const subtotal = calculatedSubtotal;
      const discount = params.couponDiscount || 0;
      const shipping = 0;
      const tax = 0;
      const grandTotal = Math.max(0, subtotal - discount);

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          shippingAddressId: params.shippingAddressId,
          billingAddressId: params.billingAddressId,
          subtotal,
          discount,
          shipping,
          tax,
          grandTotal,
          currency: 'INR',
          orderStatus: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          notes: params.notes,
          paymentMethod: finalPaymentMethod,
          couponCode: params.couponCode || null,
          couponDiscount: discount,
          promotionId: params.promotionId || null,
          couponType: params.couponType || null,
          riskDecision: riskEval.decision,
          requiresReview: riskEval.decision === 'MANUAL_REVIEW',
        },
      });

      // If manual review is required, enqueue it
      if (riskEval.decision === 'MANUAL_REVIEW') {
        await reviewQueueRepository.enqueue({
          orderId: order.id,
          reason: riskEval.auditDetail || 'Manual review required',
          riskScore: riskEval.trustScore,
        });
      }

      // Create Order Items
      await tx.orderItem.createMany({
        data: itemsToCreate.map((item) => ({
          ...item,
          orderId: order.id,
        })),
      });

      // Create Initial Status History
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          previousStatus: null,
          newStatus: OrderStatus.PENDING,
          changedBy: 'SYSTEM',
          note: 'Order created successfully',
        },
      });

      // Create Audit Log
      await tx.orderAuditLog.create({
        data: {
          orderId: order.id,
          action: AuditAction.ORDER_CREATED,
          actorType: AuditActorType.CUSTOMER,
          actorId: userId,
          details: {
            couponCode: params.couponCode || null,
            discount,
            grandTotal,
            paymentMethod: params.paymentMethod || PaymentMethod.ONLINE,
          },
        },
      });

      // Clear Cart Items
      const userCart = await tx.cart.findUnique({
        where: { userId },
      });
      if (userCart) {
        await tx.cartItem.deleteMany({
          where: { cartId: userCart.id },
        });
      }

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  stockQuantity: true,
                  lowStockThreshold: true,
                },
              },
            },
          },
          statusHistory: {
            orderBy: { createdAt: 'asc' },
          },
          shippingAddress: true,
          billingAddress: true,
          user: {
            include: {
              customerRisk: true,
            },
          },
        },
      });
    }, { timeout: 20000 });

    if (resultOrder) {
      // Emit event post-commit
      eventDispatcher.emit(OrderEvents.CREATED, resultOrder).catch((err) => {
        logger.error({ err, orderId: resultOrder.id }, 'Failed to emit Order Created event');
      });
    }

    return resultOrder;
  },

  /**
   * Get paginated customer order history
   */
  getCustomerOrders: async (userId: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      orderRepository.findByUser(userId, skip, limit),
      orderRepository.countByUser(userId),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Detailed single order view for customer
   */
  getCustomerOrderById: async (orderId: string, userId: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    }
    return order;
  },

  /**
   * Cancel an order by a customer
   */
  cancelOrder: async (orderId: string, userId: string, reason?: string) => {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    }

    const allowedStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.AWAITING_PAYMENT, OrderStatus.CONFIRMED];
    if (!allowedStatuses.includes(order.orderStatus)) {
      throw new AppError(
        `Cannot cancel order at "${order.orderStatus}" stage. Production has already started.`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const previousStatus = order.orderStatus;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Restore stocks
      for (const item of order.items) {
        if (!item.productId) continue;

        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (product && product.trackInventory) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stockQuantity: { increment: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { increment: item.quantity } },
            });
          }
        }
      }

      // Update order status
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: OrderStatus.CANCELLED,
          paymentStatus: order.paymentStatus === PaymentStatus.PENDING ? PaymentStatus.PENDING : PaymentStatus.REFUNDED,
        },
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: 'asc' },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      // Add status history
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          previousStatus,
          newStatus: OrderStatus.CANCELLED,
          changedBy: 'CUSTOMER',
          note: reason || 'Cancelled by customer',
        },
      });

      // Add Audit Log
      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.ORDER_CANCELLED,
          actorType: AuditActorType.CUSTOMER,
          actorId: userId,
          details: { reason: reason || 'Cancelled by customer' },
        },
      });

      return updated;
    }, { timeout: 20000 });

    if (updatedOrder) {
      // Emit event post-commit
      eventDispatcher.emit(OrderEvents.CANCELLED, updatedOrder).catch((err) => {
        logger.error({ err, orderId: updatedOrder.id }, 'Failed to emit Order Cancelled event');
      });
    }

    return updatedOrder;
  },

  /**
   * Admin: List all orders with filters & pagination
   */
  adminListOrders: async (filters: { status?: OrderStatus; paymentStatus?: PaymentStatus }, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      orderRepository.findAll(filters, skip, limit),
      orderRepository.countAll(filters),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Admin: Detailed single order view
   */
  adminGetOrderById: async (orderId: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    }
    return order;
  },

  /**
   * Admin: Update order status & record history
   */
  adminUpdateStatus: async (orderId: string, adminId: string, status: OrderStatus, note?: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    }

    const previousStatus = order.orderStatus;
    if (previousStatus === status) {
      return order;
    }

    let finalPaymentStatus: PaymentStatus | undefined = undefined;
    if (status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED) {
      finalPaymentStatus = PaymentStatus.REFUNDED;
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (status === OrderStatus.CANCELLED && previousStatus !== OrderStatus.CANCELLED) {
        for (const item of order.items) {
          if (!item.productId) continue;
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          if (product && product.trackInventory) {
            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stockQuantity: { increment: item.quantity } },
              });
            } else {
              await tx.product.update({
                where: { id: item.productId },
                data: { stockQuantity: { increment: item.quantity } },
              });
            }
          }
        }
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: status,
          ...(finalPaymentStatus ? { paymentStatus: finalPaymentStatus } : {}),
        },
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: 'asc' },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          previousStatus,
          newStatus: status,
          changedBy: adminId,
          note: note || `Status updated by Admin`,
        },
      });

      // Add Audit Log
      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: status === OrderStatus.CANCELLED ? AuditAction.ORDER_CANCELLED : AuditAction.STATUS_CHANGED,
          actorType: AuditActorType.ADMIN,
          actorId: adminId,
          details: {
            previousStatus,
            newStatus: status,
            note: note || `Status updated by Admin`,
          },
        },
      });

      return updatedOrder;
    }, { timeout: 20000 });

    if (updated) {
      // Emit status changed event post-commit
      eventDispatcher
        .emit(OrderEvents.STATUS_CHANGED, {
          order: updated,
          previousStatus,
          newStatus: status,
          changedBy: adminId,
          note,
        })
        .catch((err) => {
          logger.error({ err, orderId: updated.id }, 'Failed to emit Order Status Changed event');
        });
    }

    return updated;
  },

  /**
   * Admin: Update internal order note
   */
  adminUpdateNote: async (orderId: string, note: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    }
    return orderRepository.updateNote(orderId, note);
  },
};
