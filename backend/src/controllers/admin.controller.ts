/**
 * Admin Controller — Phase 6A
 * Dashboard KPIs + Customer management
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { OrderStatus, PaymentStatus, Role } from '@prisma/client';

export const adminController = {
  // ── Dashboard ─────────────────────────────────────────────────────────────

  getDashboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        // Revenue aggregates
        revenueToday,
        revenueWeek,
        revenueMonth,
        revenueAllTime,
        // Order counts
        ordersToday,
        ordersByStatus,
        // Customers
        totalCustomers,
        newCustomersToday,
        newCustomersWeek,
        // Inventory alerts
        lowStockProducts,
        outOfStockProducts,
        // Risk alerts
        manualReviewCount,
        fraudFlagCount,
        blockedCount,
        // Recent data
        recentOrders,
        recentCustomers,
      ] = await Promise.all([
        // Revenue today
        prisma.order.aggregate({
          where: { createdAt: { gte: todayStart }, paymentStatus: PaymentStatus.CAPTURED },
          _sum: { grandTotal: true },
        }),
        // Revenue this week
        prisma.order.aggregate({
          where: { createdAt: { gte: weekStart }, paymentStatus: PaymentStatus.CAPTURED },
          _sum: { grandTotal: true },
        }),
        // Revenue this month
        prisma.order.aggregate({
          where: { createdAt: { gte: monthStart }, paymentStatus: PaymentStatus.CAPTURED },
          _sum: { grandTotal: true },
        }),
        // Revenue all time
        prisma.order.aggregate({
          where: { paymentStatus: PaymentStatus.CAPTURED },
          _sum: { grandTotal: true },
        }),
        // Orders today
        prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
        // Orders by status (all time counts for current pipeline)
        prisma.order.groupBy({
          by: ['orderStatus'],
          _count: { id: true },
        }),
        // Total customers
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        // New customers today
        prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: todayStart } } }),
        // New customers this week
        prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: weekStart } } }),
        // Low stock products
        prisma.$queryRaw<{ id: string; name: string; stockQuantity: number; lowStockThreshold: number }[]>`
          SELECT id, name, "stockQuantity", "lowStockThreshold"
          FROM products
          WHERE "stockQuantity" > 0 AND "stockQuantity" <= "lowStockThreshold" AND status = 'ACTIVE'
          ORDER BY "stockQuantity" ASC
          LIMIT 5
        `,
        // Out of stock products
        prisma.product.findMany({
          where: { stockQuantity: 0, status: 'ACTIVE' },
          select: { id: true, name: true, stockQuantity: true, sku: true },
          take: 5,
          orderBy: { updatedAt: 'desc' },
        }),
        // Manual review queue count
        prisma.manualReviewQueue.count({ where: { status: 'PENDING' } }),
        // Unresolved fraud flags
        prisma.fraudFlag.count({ where: { resolved: false } }),
        // Blocked customers
        prisma.customerRisk.count({ where: { isBlocked: true } }),
        // Recent orders
        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            items: { select: { productName: true, quantity: true } },
          },
        }),
        // Recent customers
        prisma.user.findMany({
          where: { role: 'CUSTOMER' },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, firstName: true, lastName: true, email: true,
            createdAt: true, isActive: true,
            customerRisk: { select: { trustScore: true } },
          },
        }),
      ]);

      // Build status map
      const statusMap: Record<string, number> = {};
      for (const s of ordersByStatus) {
        statusMap[s.orderStatus] = s._count.id;
      }

      return successResponse(res, {
        revenue: {
          today: Number(revenueToday._sum.grandTotal || 0),
          thisWeek: Number(revenueWeek._sum.grandTotal || 0),
          thisMonth: Number(revenueMonth._sum.grandTotal || 0),
          allTime: Number(revenueAllTime._sum.grandTotal || 0),
        },
        orders: {
          today: ordersToday,
          byStatus: statusMap,
          pending: statusMap[OrderStatus.PENDING] || 0,
          confirmed: statusMap[OrderStatus.CONFIRMED] || 0,
          processing: statusMap[OrderStatus.PROCESSING] || 0,
          handcrafting: statusMap[OrderStatus.HANDCRAFTING] || 0,
          shipped: statusMap[OrderStatus.SHIPPED] || 0,
          delivered: statusMap[OrderStatus.DELIVERED] || 0,
          cancelled: statusMap[OrderStatus.CANCELLED] || 0,
        },
        customers: {
          total: totalCustomers,
          newToday: newCustomersToday,
          newThisWeek: newCustomersWeek,
        },
        inventory: {
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
        },
        riskAlerts: {
          manualReview: manualReviewCount,
          fraudFlags: fraudFlagCount,
          blocked: blockedCount,
        },
        recentOrders,
        recentCustomers,
      });
    } catch (err) {
      next(err);
    }
  },

  // ── Customer Management ────────────────────────────────────────────────────

  listCustomers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
      const limit = Math.min(50, parseInt(req.query['limit'] as string) || 20);
      const search = (req.query['search'] as string) || '';
      const isActive = req.query['isActive'] as string | undefined;
      const isBlocked = req.query['isBlocked'] as string | undefined;

      const skip = (page - 1) * limit;

      const where: any = { role: 'CUSTOMER' };
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (isActive !== undefined) where.isActive = isActive === 'true';

      // For blocked filter we need to join through customerRisk
      const riskWhere = isBlocked !== undefined ? { isBlocked: isBlocked === 'true' } : undefined;

      const [customers, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            phoneVerified: true,
            avatarUrl: true,
            isActive: true,
            isVerified: true,
            memberSince: true,
            createdAt: true,
            customerRisk: {
              select: {
                trustScore: true,
                isBlocked: true,
                ordersPlaced: true,
                ordersDelivered: true,
                rtoCount: true,
                cancelledOrders: true,
              },
            },
            _count: { select: { orders: true } },
          },
        }),
        prisma.user.count({ where }),
      ]);

      // Filter by blocked after fetch if needed
      let filtered = customers;
      if (isBlocked !== undefined) {
        const blockedVal = isBlocked === 'true';
        filtered = customers.filter(c => (c.customerRisk?.isBlocked ?? false) === blockedVal);
      }

      return successResponse(res, {
        customers: filtered,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  },

  getCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params['userId'] as string;

      const customer = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          phoneVerified: true,
          avatarUrl: true,
          isActive: true,
          isVerified: true,
          memberSince: true,
          createdAt: true,
          updatedAt: true,
          marketingConsent: true,
          newsletterSubscribed: true,
          preferredLanguage: true,
          lastLogin: true,
          role: true,
          addresses: {
            where: { deletedAt: null },
            orderBy: { isDefaultShipping: 'desc' },
          },
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: {
              items: { select: { productName: true, quantity: true, lineTotal: true } },
              payment: { select: { status: true, method: true, paidAt: true } },
            },
          },
          customerRisk: true,
          _count: { select: { orders: true, reviews: true, wishlist: true } },
        },
      });

      if (!customer) throw new AppError('Customer not found', HTTP_STATUS.NOT_FOUND);

      // Compute detailed statistics
      const orders = await prisma.order.findMany({
        where: { userId },
        select: {
          grandTotal: true,
          orderStatus: true,
          paymentStatus: true,
          couponCode: true,
        },
      });

      const totalOrdersCount = orders.length;
      const deliveredCount = orders.filter(o => o.orderStatus === 'DELIVERED').length;
      const cancelledCount = orders.filter(o => o.orderStatus === 'CANCELLED').length;
      const refundedCount = orders.filter(o => o.orderStatus === 'REFUNDED' || o.paymentStatus === 'REFUNDED').length;
      const couponsCount = orders.filter(o => o.couponCode !== null).length;

      const totalSpend = orders
        .filter(o => o.paymentStatus === 'CAPTURED')
        .reduce((sum, o) => sum + Number(o.grandTotal), 0);

      const averageOrderValue = deliveredCount > 0 ? totalSpend / deliveredCount : (totalOrdersCount > 0 ? totalSpend / totalOrdersCount : 0);

      const [wishlistCount, reviewsCount] = await Promise.all([
        prisma.wishlist.count({ where: { userId } }),
        prisma.review.count({ where: { userId } }),
      ]);

      // Calculate customer tier
      let tier = 'Bronze';
      if (totalSpend >= 50000) {
        tier = 'VIP';
      } else if (totalSpend >= 20000) {
        tier = 'Gold';
      } else if (totalSpend >= 10000) {
        tier = 'Silver';
      }

      // Get review timeline for the customer
      const reviewTimeline = await prisma.review.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, slug: true } },
          media: true,
        },
      });

      return successResponse(res, {
        customer,
        totalSpend,
        stats: {
          totalOrders: totalOrdersCount,
          delivered: deliveredCount,
          cancelled: cancelledCount,
          refunded: refundedCount,
          wishlistCount,
          reviewsCount,
          couponsUsed: couponsCount,
          averageOrderValue: Math.round(averageOrderValue),
          tier,
        },
        reviewTimeline,
      });
    } catch (err) {
      next(err);
    }
  },

  updateCustomerStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params['userId'] as string;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        throw new AppError('isActive must be a boolean', HTTP_STATUS.BAD_REQUEST);
      }

      const customer = await prisma.user.update({
        where: { id: userId },
        data: { isActive },
        select: { id: true, firstName: true, lastName: true, email: true, isActive: true },
      });

      return successResponse(
        res,
        customer,
        isActive ? 'Customer account activated' : 'Customer account deactivated'
      );
    } catch (err) {
      next(err);
    }
  },

  deleteCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params['userId'] as string;
      const adminId = req.user?.id;

      // Prevent admin from accidentally deleting their own account
      if (userId === adminId) {
        throw new AppError('You cannot delete your own admin account', HTTP_STATUS.BAD_REQUEST);
      }

      // Check if target user exists
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, firstName: true, lastName: true, email: true },
      });

      if (!targetUser) {
        throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
      }

      // Prevent deleting other ADMIN users through this endpoint
      if (targetUser.role === Role.ADMIN) {
        throw new AppError('Admin users cannot be deleted through customer management', HTTP_STATUS.FORBIDDEN);
      }

      // Permanently delete user from database in a transaction (cascading relations)
      await prisma.$transaction(async (tx) => {
        // Delete related dependent models that don't auto-cascade on Delete
        await tx.refreshToken.deleteMany({ where: { userId } });
        await tx.address.deleteMany({ where: { userId } });
        await tx.review.deleteMany({ where: { userId } });
        await tx.wishlist.deleteMany({ where: { userId } });
        await tx.customerRisk.deleteMany({ where: { userId } });
        await tx.otpVerification.deleteMany({ where: { userId } });
        
        // Disconnect cart items and cart if present
        const cart = await tx.cart.findUnique({ where: { userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
          await tx.cart.delete({ where: { id: cart.id } });
        }

        // Delete orders and order items
        const userOrders = await tx.order.findMany({ where: { userId }, select: { id: true } });
        const orderIds = userOrders.map(o => o.id);
        if (orderIds.length > 0) {
          await tx.payment.deleteMany({ where: { orderId: { in: orderIds } } });
          await tx.orderStatusHistory.deleteMany({ where: { orderId: { in: orderIds } } });
          await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
          await tx.order.deleteMany({ where: { userId } });
        }

        // Finally delete the user record permanently
        await tx.user.delete({ where: { id: userId } });
      });

      return successResponse(
        res,
        { id: userId, email: targetUser.email },
        `User ${targetUser.firstName} ${targetUser.lastName} (${targetUser.email}) permanently deleted.`
      );
    } catch (err) {
      next(err);
    }
  },
};
