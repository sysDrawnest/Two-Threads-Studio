/**
 * Manual Review Queue Repository — Phase 5C
 */

import { ManualReviewQueue, ReviewStatus } from '@prisma/client';
import prisma from '../prisma';

export const reviewQueueRepository = {
  enqueue: async (data: {
    orderId: string;
    reason: string;
    riskScore: number;
  }): Promise<ManualReviewQueue> => {
    return prisma.manualReviewQueue.upsert({
      where: { orderId: data.orderId },
      create: data,
      update: { reason: data.reason, riskScore: data.riskScore, status: ReviewStatus.PENDING },
    });
  },

  findByOrderId: async (orderId: string): Promise<ManualReviewQueue | null> => {
    return prisma.manualReviewQueue.findUnique({ where: { orderId } });
  },

  list: async (
    status?: ReviewStatus,
    page = 1,
    limit = 20
  ): Promise<{ items: ManualReviewQueue[]; total: number }> => {
    const where = status ? { status } : {};
    const [items, total] = await prisma.$transaction([
      prisma.manualReviewQueue.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { order: { include: { user: true, items: true } } },
      }),
      prisma.manualReviewQueue.count({ where }),
    ]);
    return { items, total };
  },

  approve: async (orderId: string, reviewedBy: string, note?: string) => {
    return prisma.manualReviewQueue.update({
      where: { orderId },
      data: {
        status: ReviewStatus.APPROVED,
        reviewedBy,
        reviewedAt: new Date(),
        reviewNote: note,
      },
    });
  },

  reject: async (orderId: string, reviewedBy: string, note: string) => {
    return prisma.manualReviewQueue.update({
      where: { orderId },
      data: {
        status: ReviewStatus.REJECTED,
        reviewedBy,
        reviewedAt: new Date(),
        reviewNote: note,
      },
    });
  },

  pendingCount: async (): Promise<number> => {
    return prisma.manualReviewQueue.count({ where: { status: ReviewStatus.PENDING } });
  },
};
