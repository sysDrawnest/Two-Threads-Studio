/**
 * Phase 7.4 Payment Analytics & Observatory
 * Aggregates performance, gateway success rate, payment method mix, and audit logs.
 */

import prisma from '../prisma';
import { PaymentStatus } from '@prisma/client';

export const paymentAnalytics = {
  /**
   * Summary metrics for admin payment observatory
   */
  getAnalyticsSummary: async () => {
    const [
      totalCount,
      capturedCount,
      failedCount,
      refundedCount,
      totalVolume,
      methodGroups,
      failureGroups,
    ] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.count({ where: { status: PaymentStatus.CAPTURED } }),
      prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
      prisma.payment.count({ where: { status: { in: [PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED] } } }),
      prisma.payment.aggregate({
        where: { status: PaymentStatus.CAPTURED },
        _sum: { amount: true },
      }),
      prisma.payment.groupBy({
        by: ['method'],
        _count: { id: true },
      }),
      prisma.payment.groupBy({
        by: ['failureReason'],
        where: { status: PaymentStatus.FAILED, failureReason: { not: null } },
        _count: { id: true },
      }),
    ]);

    const successRate = totalCount > 0 ? Math.round((capturedCount / totalCount) * 1000) / 10 : 100;

    const methodBreakdown: Record<string, number> = {};
    for (const g of methodGroups) {
      methodBreakdown[g.method || 'online'] = g._count.id;
    }

    const failureReasonCounts: Record<string, number> = {};
    for (const g of failureGroups) {
      if (g.failureReason) {
        failureReasonCounts[g.failureReason] = g._count.id;
      }
    }

    return {
      totalPayments: totalCount,
      capturedCount,
      failedCount,
      refundedCount,
      successRate,
      totalVolume: Number(totalVolume._sum.amount || 0),
      methodBreakdown,
      failureReasonCounts,
    };
  },
};
