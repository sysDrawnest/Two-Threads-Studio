/**
 * Analytics Controller — Phase 6A
 * Revenue, orders, customer growth, and product analytics
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';
import { PaymentStatus } from '@prisma/client';

type GroupBy = 'day' | 'week' | 'month';

function buildDateRange(period: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case '7d':   start.setDate(start.getDate() - 7);   break;
    case '30d':  start.setDate(start.getDate() - 30);  break;
    case '90d':  start.setDate(start.getDate() - 90);  break;
    case '1y':   start.setFullYear(start.getFullYear() - 1); break;
    default:     start.setDate(start.getDate() - 30);  break; // default 30d
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export const analyticsController = {
  // ── Revenue chart data ────────────────────────────────────────────────────
  getRevenue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = (req.query['period'] as string) || '30d';
      const groupBy: GroupBy = (req.query['groupBy'] as GroupBy) || 'day';
      const { start, end } = buildDateRange(period);

      // Fetch captured orders in date range
      const orders = await prisma.order.findMany({
        where: {
          createdAt: { gte: start, lte: end },
          paymentStatus: PaymentStatus.CAPTURED,
        },
        select: { grandTotal: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      });

      // Group by period
      const grouped = new Map<string, { revenue: number; orders: number }>();

      for (const order of orders) {
        const d = new Date(order.createdAt);
        let key: string;

        if (groupBy === 'day') {
          key = d.toISOString().slice(0, 10);
        } else if (groupBy === 'week') {
          const weekStart = new Date(d);
          weekStart.setDate(d.getDate() - d.getDay());
          key = weekStart.toISOString().slice(0, 10);
        } else {
          key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        }

        const existing = grouped.get(key) || { revenue: 0, orders: 0 };
        existing.revenue += Number(order.grandTotal);
        existing.orders += 1;
        grouped.set(key, existing);
      }

      const chartData = Array.from(grouped.entries()).map(([date, data]) => ({
        date,
        revenue: Math.round(data.revenue * 100) / 100,
        orders: data.orders,
      }));

      // Totals
      const totalRevenue = orders.reduce((s, o) => s + Number(o.grandTotal), 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return successResponse(res, {
        period,
        groupBy,
        chartData,
        totals: {
          revenue: Math.round(totalRevenue * 100) / 100,
          orders: totalOrders,
          avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // ── Orders breakdown ──────────────────────────────────────────────────────
  getOrderAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = (req.query['period'] as string) || '30d';
      const { start, end } = buildDateRange(period);

      const [byStatus, byPaymentMethod, byPaymentStatus] = await Promise.all([
        prisma.order.groupBy({
          by: ['orderStatus'],
          where: { createdAt: { gte: start, lte: end } },
          _count: { id: true },
        }),
        prisma.order.groupBy({
          by: ['paymentMethod'],
          where: { createdAt: { gte: start, lte: end } },
          _count: { id: true },
        }),
        prisma.order.groupBy({
          by: ['paymentStatus'],
          where: { createdAt: { gte: start, lte: end } },
          _count: { id: true },
        }),
      ]);

      return successResponse(res, {
        period,
        byStatus: byStatus.map(s => ({ status: s.orderStatus, count: s._count.id })),
        byPaymentMethod: byPaymentMethod.map(s => ({ method: s.paymentMethod, count: s._count.id })),
        byPaymentStatus: byPaymentStatus.map(s => ({ status: s.paymentStatus, count: s._count.id })),
      });
    } catch (err) {
      next(err);
    }
  },

  // ── Top products ──────────────────────────────────────────────────────────
  getTopProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = (req.query['period'] as string) || '30d';
      const limit = Math.min(20, parseInt(req.query['limit'] as string) || 10);
      const { start, end } = buildDateRange(period);

      const topItems = await prisma.orderItem.groupBy({
        by: ['productId', 'productName'],
        where: {
          order: {
            createdAt: { gte: start, lte: end },
            paymentStatus: PaymentStatus.CAPTURED,
          },
        },
        _sum: { quantity: true, lineTotal: true },
        _count: { id: true },
        orderBy: { _sum: { lineTotal: 'desc' } },
        take: limit,
      });

      return successResponse(res, {
        period,
        products: topItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          totalQuantity: item._sum.quantity || 0,
          totalRevenue: Number(item._sum.lineTotal || 0),
          orderCount: item._count.id,
        })),
      });
    } catch (err) {
      next(err);
    }
  },

  // ── Customer growth ───────────────────────────────────────────────────────
  getCustomerGrowth: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = (req.query['period'] as string) || '30d';
      const { start, end } = buildDateRange(period);

      const customers = await prisma.user.findMany({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: start, lte: end },
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      });

      const grouped = new Map<string, number>();
      for (const c of customers) {
        const key = new Date(c.createdAt).toISOString().slice(0, 10);
        grouped.set(key, (grouped.get(key) || 0) + 1);
      }

      const chartData = Array.from(grouped.entries()).map(([date, count]) => ({ date, count }));

      const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

      return successResponse(res, {
        period,
        chartData,
        newInPeriod: customers.length,
        totalCustomers,
      });
    } catch (err) {
      next(err);
    }
  },

  // ── Category revenue breakdown ────────────────────────────────────────────
  getCategoryBreakdown: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = (req.query['period'] as string) || '30d';
      const { start, end } = buildDateRange(period);

      // Get order items with product + category
      const items = await prisma.orderItem.findMany({
        where: {
          order: {
            createdAt: { gte: start, lte: end },
            paymentStatus: PaymentStatus.CAPTURED,
          },
          productId: { not: null },
        },
        select: {
          lineTotal: true,
          quantity: true,
          productId: true,
        },
      });

      // Fetch product → category mapping
      const productIds = [...new Set(items.map(i => i.productId).filter(Boolean))] as string[];
      const products = productIds.length > 0
        ? await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, category: { select: { id: true, name: true } } },
          })
        : [];

      const productCategoryMap = new Map(products.map(p => [p.id, p.category]));

      const categoryRevenue = new Map<string, { name: string; revenue: number; units: number }>();
      for (const item of items) {
        if (!item.productId) continue;
        const cat = productCategoryMap.get(item.productId);
        if (!cat) continue;

        const existing = categoryRevenue.get(cat.id) || { name: cat.name, revenue: 0, units: 0 };
        existing.revenue += Number(item.lineTotal);
        existing.units += item.quantity;
        categoryRevenue.set(cat.id, existing);
      }

      const breakdown = Array.from(categoryRevenue.entries())
        .map(([id, data]) => ({ categoryId: id, ...data, revenue: Math.round(data.revenue * 100) / 100 }))
        .sort((a, b) => b.revenue - a.revenue);

      return successResponse(res, { period, breakdown });
    } catch (err) {
      next(err);
    }
  },
};
