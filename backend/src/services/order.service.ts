import prisma from '../prisma';
import { orderRepository } from '../repositories/order.repository';
import { cartService } from './cart.service';
import { orderNotifications } from '../notifications/order.notifications';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

export const orderService = {
  /**
   * Helper to generate unique order number in format: TTSYYMMDD-000001
   */
  generateOrderNumber: async (tx: Prisma.TransactionClient): Promise<string> => {
    const now = new Date();
    // Get YYMMDD
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `TTS${yy}${mm}${dd}`;

    // Count existing orders for today to get next serial number
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
      paymentMethod?: string;
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

    // 3. Complete Transaction
    const resultOrder = await prisma.$transaction(async (tx) => {
      // Re-fetch products/variants to ensure stock and status are fresh/valid
      const itemsToCreate = [];
      let calculatedSubtotal = 0;

      for (const item of cart.items) {
        // Fetch product with status and trackInventory
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

          // Inventory validation
          if (product.trackInventory) {
            if (variant.stockQuantity < item.quantity) {
              throw new AppError(`Insufficient stock for "${item.productName} (${variantName})"`, HTTP_STATUS.BAD_REQUEST);
            }
            // Deduct stock from variant
            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stockQuantity: { decrement: item.quantity } },
            });
          }
        } else {
          // Inventory validation for non-variant product
          if (product.trackInventory) {
            if (product.stockQuantity < item.quantity) {
              throw new AppError(`Insufficient stock for "${item.productName}"`, HTTP_STATUS.BAD_REQUEST);
            }
            // Deduct stock from product
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

      // Generate order number
      const orderNumber = await orderService.generateOrderNumber(tx);

      // Default totals for Phase 5A
      const subtotal = calculatedSubtotal;
      const discount = 0;
      const shipping = 0;
      const tax = 0;
      const grandTotal = subtotal;

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
          paymentMethod: params.paymentMethod || 'razorpay',
        },
      });

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

      // Clear Cart Items
      const userCart = await tx.cart.findUnique({
        where: { userId },
      });
      if (userCart) {
        await tx.cartItem.deleteMany({
          where: { cartId: userCart.id },
        });
      }

      // Fetch the created order with relations
      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: 'asc' },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });
    });

    if (resultOrder) {
      // Trigger background notification hook
      orderNotifications.onOrderCreated(resultOrder).catch(() => {});
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

    // Allowed customer cancellation statuses
    const allowedStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.AWAITING_PAYMENT, OrderStatus.CONFIRMED];
    if (!allowedStatuses.includes(order.orderStatus)) {
      throw new AppError(
        `Cannot cancel order at "${order.orderStatus}" stage. Production has already started.`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const previousStatus = order.orderStatus;

    // Transactional status change + stock restoration
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Restore stocks
      for (const item of order.items) {
        if (!item.productId) continue;

        // Fetch product to see if we track inventory
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

      return updated;
    });

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

    // Determine corresponding payment status if order gets delivered or cancelled/refunded
    let finalPaymentStatus: PaymentStatus | undefined = undefined;
    if (status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED) {
      finalPaymentStatus = PaymentStatus.REFUNDED;
    }

    const updated = await prisma.$transaction(async (tx) => {
      // If we are transition to CANCELLED from a non-cancelled status, restore stock
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

      return updatedOrder;
    });

    // Trigger hooks
    if (status === OrderStatus.CONFIRMED) {
      orderNotifications.onOrderConfirmed(updated).catch(() => {});
    } else if (status === OrderStatus.SHIPPED) {
      orderNotifications.onOrderShipped(updated).catch(() => {});
    } else if (status === OrderStatus.DELIVERED) {
      orderNotifications.onOrderDelivered(updated).catch(() => {});
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
