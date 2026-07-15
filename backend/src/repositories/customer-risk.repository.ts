/**
 * CustomerRisk Repository — Phase 5C
 *
 * Upsert-based: always creates the record if it doesn't exist.
 * All counter increments use atomic Prisma increment operations.
 */

import { Prisma, CustomerRisk } from '@prisma/client';
import prisma from '../prisma';

export const customerRiskRepository = {
  /** Get or create a CustomerRisk record for a user */
  getOrCreate: async (userId: string): Promise<CustomerRisk> => {
    return prisma.customerRisk.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  },

  findByUserId: async (userId: string): Promise<CustomerRisk | null> => {
    return prisma.customerRisk.findUnique({ where: { userId } });
  },

  /** Atomically update trust score and timestamp */
  updateTrustScore: async (
    userId: string,
    trustScore: number
  ): Promise<CustomerRisk> => {
    return prisma.customerRisk.upsert({
      where: { userId },
      create: { userId, trustScore, lastRiskEvaluation: new Date() },
      update: { trustScore, lastRiskEvaluation: new Date() },
    });
  },

  /** Increment counters on order events */
  incrementCounters: async (
    userId: string,
    delta: Partial<{
      ordersPlaced: number;
      ordersDelivered: number;
      rtoCount: number;
      cancelledOrders: number;
      prepaidOrders: number;
      codOrders: number;
      chargebackCount: number;
      failedPayments: number;
    }>
  ): Promise<CustomerRisk> => {
    const data: Prisma.CustomerRiskUpdateInput = {};
    for (const [key, value] of Object.entries(delta)) {
      if (value !== undefined && value !== 0) {
        (data as any)[key] = { increment: value };
      }
    }

    return prisma.customerRisk.upsert({
      where: { userId },
      create: {
        userId,
        ...Object.fromEntries(
          Object.entries(delta).filter(([, v]) => v !== undefined)
        ),
      },
      update: { ...data, lastOrderAt: new Date() },
    });
  },

  /** Admin: block/unblock a customer */
  setBlocked: async (
    userId: string,
    isBlocked: boolean,
    blockReason?: string
  ): Promise<CustomerRisk> => {
    return prisma.customerRisk.upsert({
      where: { userId },
      create: { userId, isBlocked, blockReason },
      update: { isBlocked, blockReason: isBlocked ? blockReason : null },
    });
  },

  /** Admin: add notes to a customer risk record */
  updateAdminNotes: async (userId: string, notes: string): Promise<CustomerRisk> => {
    return prisma.customerRisk.upsert({
      where: { userId },
      create: { userId, adminNotes: notes },
      update: { adminNotes: notes },
    });
  },

  /** Paginated list for admin dashboard */
  list: async (
    filters: { isBlocked?: boolean; minTrustScore?: number; maxTrustScore?: number },
    page = 1,
    limit = 20
  ): Promise<{ records: CustomerRisk[]; total: number }> => {
    const where: Prisma.CustomerRiskWhereInput = {};
    if (filters.isBlocked !== undefined) where.isBlocked = filters.isBlocked;
    if (filters.minTrustScore !== undefined) where.trustScore = { gte: filters.minTrustScore };
    if (filters.maxTrustScore !== undefined)
      where.trustScore = { ...(where.trustScore as any), lte: filters.maxTrustScore };

    const [records, total] = await prisma.$transaction([
      prisma.customerRisk.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { trustScore: 'asc' },
      }),
      prisma.customerRisk.count({ where }),
    ]);

    return { records, total };
  },
};
