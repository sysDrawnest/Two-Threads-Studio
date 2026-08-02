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

  // ── Refund Analytics Dashboard with 5-minute in-memory caching ────────────────
  getRefundAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nowMs = Date.now();
      if (cacheRefundAnalytics && nowMs < cacheRefundAnalyticsExpiry) {
        return successResponse(res, { ...cacheRefundAnalytics, fromCache: true });
      }

      // 1. Gather all refunds
      const refunds = await prisma.refund.findMany({
        select: {
          id: true,
          status: true,
          amount: true,
          gatewayErrorCode: true,
          createdAt: true,
          processedAt: true,
          manualOverride: true,
        },
      });

      // 2. Count totals
      let totalRefunded = 0;
      let totalInitiated = 0;
      let totalFailed = 0;
      let totalOverride = 0;
      const statusCounts: Record<string, number> = {
        INITIATED: 0,
        PROCESSING: 0,
        PROCESSED: 0,
        FAILED: 0,
      };

      const errorClassMap = new Map<string, number>();
      let totalErrors = 0;

      let totalSyncTimeMs = 0;
      let processedWithTimeCount = 0;

      for (const r of refunds) {
        statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
        if (r.status === 'PROCESSED') {
          totalRefunded += Number(r.amount);
          if (r.processedAt) {
            const timeDiff = r.processedAt.getTime() - r.createdAt.getTime();
            totalSyncTimeMs += timeDiff;
            processedWithTimeCount++;
          }
        } else if (r.status === 'INITIATED') {
          totalInitiated++;
        } else if (r.status === 'FAILED') {
          totalFailed++;
        }

        if (r.manualOverride) {
          totalOverride++;
        }

        if (r.gatewayErrorCode) {
          const errCode = r.gatewayErrorCode.toUpperCase();
          let cls = 'GATEWAY_ERROR';
          if (errCode.includes('TIMEOUT') || errCode.includes('NETWORK')) cls = 'NETWORK_ERROR';
          else if (errCode.includes('BALANCE')) cls = 'INSUFFICIENT_BALANCE';
          else if (errCode.includes('REJECTED') || errCode.includes('DECLINED')) cls = 'BANK_REJECTED';
          else if (errCode.includes('DUPLICATE')) cls = 'DUPLICATE_REQUEST';
          else if (errCode.includes('BAD_REQUEST') || errCode.includes('INVALID')) cls = 'INVALID_PAYMENT';

          errorClassMap.set(cls, (errorClassMap.get(cls) || 0) + 1);
          totalErrors++;
        }
      }

      // 3. Top Refund/Return Reasons
      const returns = await prisma.returnRequest.findMany({
        select: { reason: true },
      });
      const reasonCounts = new Map<string, number>();
      for (const ret of returns) {
        reasonCounts.set(ret.reason, (reasonCounts.get(ret.reason) || 0) + 1);
      }
      const topReasons = Array.from(reasonCounts.entries())
        .map(([reason, count]) => ({ reason, count, pct: Math.round((count / returns.length) * 100) || 0 }))
        .sort((a, b) => b.count - a.count);

      // 4. Rate metrics
      const totalOrdersCount = await prisma.order.count({
        where: { orderStatus: { in: ['CONFIRMED', 'DELIVERED', 'RETURNED', 'REFUNDED'] } },
      });
      const returnedOrdersCount = await prisma.order.count({
        where: { orderStatus: 'RETURNED' },
      });
      const refundedOrdersCount = await prisma.order.count({
        where: { orderStatus: 'REFUNDED' },
      });

      const returnRate = totalOrdersCount > 0 ? (returnedOrdersCount / totalOrdersCount) * 100 : 0;
      const refundRate = totalOrdersCount > 0 ? (refundedOrdersCount / totalOrdersCount) * 100 : 0;

      const avgProcessingTimeHours = processedWithTimeCount > 0
        ? Math.round((totalSyncTimeMs / processedWithTimeCount) / (1000 * 60 * 60) * 100) / 100
        : 0;

      cacheRefundAnalytics = {
        summary: {
          totalRefundedVolume: Math.round(totalRefunded * 100) / 100,
          pendingVolumeCount: totalInitiated,
          failedVolumeCount: totalFailed,
          manualOverrideCount: totalOverride,
          avgProcessingTimeHours,
        },
        rates: {
          returnRate: Math.round(returnRate * 100) / 100,
          refundRate: Math.round(refundRate * 100) / 100,
        },
        statuses: statusCounts,
        failureDistribution: Array.from(errorClassMap.entries()).map(([errorClass, count]) => ({
          errorClass,
          count,
          pct: Math.round((count / totalErrors) * 100) || 0,
        })),
        topReasons,
      };
      cacheRefundAnalyticsExpiry = nowMs + 5 * 60 * 1000; // 5-minute TTL

      return successResponse(res, cacheRefundAnalytics);
    } catch (err) {
      next(err);
    }
  },
};

let cacheRefundAnalytics: any = null;
let cacheRefundAnalyticsExpiry = 0;
