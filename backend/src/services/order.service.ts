import prisma from '../prisma';
import { orderRepository } from '../repositories/order.repository';
import { clearHomepageCache } from './product.service';
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
    const resultOrder = await prisma.$transaction(
      async (tx) => {
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

        // Increment sales count
        await tx.product.update({
          where: { id: product.id },
          data: { salesCount: { increment: item.quantity } },
        });

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
        }, tx);
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

      const dbUser = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          customerRisk: true,
        },
      });

      return {
        ...order,
        items: itemsToCreate.map((item) => ({ ...item, id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` })),
        statusHistory: [{
          id: `hist_${Date.now()}`,
          orderId: order.id,
          previousStatus: null,
          newStatus: OrderStatus.PENDING,
          changedBy: 'SYSTEM',
          note: 'Order created successfully',
          createdAt: new Date(),
        }],
        shippingAddress,
        billingAddress,
        user: dbUser || {
          id: userId,
          firstName: 'Customer',
          lastName: '',
          email: '',
          phone: null,
          customerRisk: null,
        },
      };
    }, { timeout: 20000 });

    if (resultOrder) {
      clearHomepageCache();
      // DO NOT emit OrderEvents.CREATED here.
      // For online orders, it should be emitted after payment is verified.
      // For COD orders, it's emitted after COD confirmation.
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

        if (product) {
          // Decrement sales count
          await tx.product.update({
            where: { id: item.productId },
            data: { salesCount: { decrement: item.quantity } },
          });
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
      clearHomepageCache();
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

          if (product) {
            // Decrement sales count
            await tx.product.update({
              where: { id: item.productId },
              data: { salesCount: { decrement: item.quantity } },
            });
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
      clearHomepageCache();
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

  /**
   * Customer: Request a return for a delivered order
   */
  requestReturn: async (
    orderId: string,
    userId: string,
    data: {
      reason: string;
      notes?: string;
      mediaUrls?: string[];
      refundType?: string;
      items: Array<{ orderItemId: string; quantity: number; reason?: string }>;
    }
  ) => {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            order: { select: { couponDiscount: true, subtotal: true } },
          },
        },
        payment: true,
        user: {
          select: {
            id: true,
            customerRisk: { select: { trustScore: true, tier: true } },
          },
        },
      },
    });

    if (!order) throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
    if (order.orderStatus !== OrderStatus.DELIVERED) {
      throw new AppError('Returns can only be requested for delivered orders.', HTTP_STATUS.BAD_REQUEST);
    }

    // ── 1. Return window check ─────────────────────────────
    const settings = await prisma.studioSettings.findFirst();
    const windowDays = settings?.returnWindowDays ?? 7;

    if (order.deliveredAt) {
      const expiresAt = new Date(order.deliveredAt);
      expiresAt.setDate(expiresAt.getDate() + windowDays);
      if (new Date() > expiresAt) {
        throw new AppError(
          `Return window of ${windowDays} days has expired. Orders must be returned within ${windowDays} days of delivery.`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // ── 2. Per-item validation & policy checks ──────────────
    for (const reqItem of data.items) {
      const orderItem = order.items.find(i => i.id === reqItem.orderItemId);
      if (!orderItem) throw new AppError(`Item ${reqItem.orderItemId} not found in order`, HTTP_STATUS.BAD_REQUEST);
      if (reqItem.quantity > orderItem.quantity) {
        throw new AppError(`Cannot return ${reqItem.quantity} units — order only has ${orderItem.quantity}`, HTTP_STATUS.BAD_REQUEST);
      }

      // Check per-product return policy
      if (orderItem.productId) {
        const policy = await prisma.returnPolicy.findUnique({ where: { productId: orderItem.productId } });
        if (policy?.eligibility === 'NO_RETURN') {
          throw new AppError(
            `"${orderItem.productName}" is not eligible for return. ${policy.reason || ''}`.trim(),
            HTTP_STATUS.BAD_REQUEST
          );
        }
        // Per-product window override
        if (policy?.windowDays && order.deliveredAt) {
          const productExpiry = new Date(order.deliveredAt);
          productExpiry.setDate(productExpiry.getDate() + policy.windowDays);
          if (new Date() > productExpiry) {
            throw new AppError(
              `Return window for "${orderItem.productName}" has expired (${policy.windowDays} days).`,
              HTTP_STATUS.BAD_REQUEST
            );
          }
        }
      }
    }

    // ── 3. Fraud detection ──────────────────────────────────
    const [totalDelivered, totalReturns] = await Promise.all([
      prisma.order.count({ where: { userId, orderStatus: OrderStatus.DELIVERED } }),
      prisma.returnRequest.count({ where: { userId } }),
    ]);
    const returnRate = totalDelivered > 0 ? totalReturns / totalDelivered : 0;

    let fraudFlagged = false;
    let fraudReason: string | undefined;

    if (returnRate > 0.4) {
      fraudFlagged = true;
      fraudReason = `High return rate: ${Math.round(returnRate * 100)}% of delivered orders returned`;
    }

    const trustScore = (order.user as any)?.customerRisk?.trustScore ?? 100;
    if (trustScore < 40) {
      fraudFlagged = true;
      fraudReason = (fraudReason ? fraudReason + '; ' : '') + 'Low trust score account';
    }

    // ── 4. Prorated refund calculation ──────────────────────
    const orderSubtotal = Number(order.subtotal);
    const couponDiscount = Number(order.couponDiscount);
    const returnItems: Array<{
      orderItemId: string;
      quantity: number;
      reason?: string;
      unitPrice: number;
      proratedDiscount: number;
      refundableAmount: number;
    }> = [];

    let totalRequestedAmount = 0;

    for (const reqItem of data.items) {
      const orderItem = order.items.find(i => i.id === reqItem.orderItemId)!;
      const unitPrice = Number(orderItem.unitPrice);
      const itemSubtotal = unitPrice * reqItem.quantity;

      // Prorate coupon: discount proportional to this item's share of order subtotal
      const itemShare = orderSubtotal > 0 ? (unitPrice * reqItem.quantity) / orderSubtotal : 0;
      const proratedDiscount = couponDiscount * itemShare;
      const refundableAmount = Math.max(0, itemSubtotal - proratedDiscount);

      totalRequestedAmount += refundableAmount;
      returnItems.push({
        orderItemId: reqItem.orderItemId,
        quantity: reqItem.quantity,
        reason: reqItem.reason,
        unitPrice,
        proratedDiscount,
        refundableAmount,
      });
    }

    // ── 5. Auto-approval logic ──────────────────────────────
    const tier = (order.user as any)?.customerRisk?.tier;
    let autoApproved = false;
    let autoApproveRule: string | undefined;
    let initialStatus = 'REQUESTED';

    if (!fraudFlagged) {
      if (tier === 'VIP') {
        autoApproved = true; autoApproveRule = 'VIP'; initialStatus = 'APPROVED';
      } else if (trustScore > 95 && totalRequestedAmount < 500) {
        autoApproved = true; autoApproveRule = 'HIGH_TRUST_LOW_VALUE'; initialStatus = 'APPROVED';
      } else if (totalRequestedAmount < 300) {
        autoApproved = true; autoApproveRule = 'LOW_VALUE'; initialStatus = 'APPROVED';
      }
    }

    // ── 6. Create ReturnRequest in transaction ──────────────
    const returnRequest = await prisma.$transaction(async (tx) => {
      const rr = await tx.returnRequest.create({
        data: {
          orderId,
          userId,
          status: initialStatus as any,
          reason: data.reason as any,
          notes: data.notes,
          mediaUrls: data.mediaUrls ?? [],
          refundType: (data.refundType as any) ?? 'ORIGINAL_PAYMENT',
          requestedAmount: totalRequestedAmount,
          approvedAmount: autoApproved ? totalRequestedAmount : undefined,
          autoApproved,
          autoApproveRule,
          fraudFlagged,
          fraudReason,
          approvedAt: autoApproved ? new Date() : undefined,
          items: {
            create: returnItems.map(item => ({
              orderItemId: item.orderItemId,
              quantity: item.quantity,
              reason: item.reason,
              unitPrice: item.unitPrice,
              proratedDiscount: item.proratedDiscount,
              refundableAmount: item.refundableAmount,
            })),
          },
        },
      });

      // Initial timeline entry
      await tx.returnTimeline.create({
        data: {
          returnRequestId: rr.id,
          status: 'REQUESTED' as any,
          note: `Return request submitted by customer. Reason: ${data.reason}`,
          actorType: 'CUSTOMER',
          actorId: userId,
        },
      });

      if (autoApproved) {
        await tx.returnTimeline.create({
          data: {
            returnRequestId: rr.id,
            status: 'APPROVED' as any,
            note: `Auto-approved. Rule: ${autoApproveRule}`,
            actorType: 'SYSTEM',
          },
        });
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { orderStatus: OrderStatus.RETURN_REQUESTED },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          previousStatus: OrderStatus.DELIVERED,
          newStatus: OrderStatus.RETURN_REQUESTED,
          changedBy: 'CUSTOMER',
          note: `Return requested. Reason: ${data.reason}`,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: AuditAction.STATUS_CHANGED,
          actorType: AuditActorType.CUSTOMER,
          actorId: userId,
          details: {
            previousStatus: 'DELIVERED',
            newStatus: 'RETURN_REQUESTED',
            returnRequestId: rr.id,
            reason: data.reason,
            fraudFlagged,
            autoApproved,
            requestedAmount: totalRequestedAmount,
          },
        },
      });

      return rr;
    });

    return returnRequest;
  },
};
