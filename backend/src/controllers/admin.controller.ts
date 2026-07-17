/**
 * Admin Controller — Phase 6A
 * Dashboard KPIs + Customer management
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { OrderStatus, PaymentStatus } from '@prisma/client';

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

      // Compute total spend
      const totalSpend = await prisma.order.aggregate({
        where: { userId, paymentStatus: PaymentStatus.CAPTURED },
        _sum: { grandTotal: true },
      });

      return successResponse(res, {
        customer,
        totalSpend: Number(totalSpend?._sum?.grandTotal || 0),
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
};
