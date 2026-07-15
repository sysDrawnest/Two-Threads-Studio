/**
 * Fraud Flag Repository — Phase 5C
 */

import { FraudFlag, FraudFlagType, Prisma } from '@prisma/client';
import prisma from '../prisma';

export const fraudFlagRepository = {
  create: async (data: {
    userId?: string | null;
    orderId?: string | null;
    type: FraudFlagType;
    details?: Prisma.InputJsonValue;
  }): Promise<FraudFlag> => {
    return prisma.fraudFlag.create({ data });
  },

  createMany: async (
    flags: Array<{
      userId?: string | null;
      orderId?: string | null;
      type: FraudFlagType;
      details?: Prisma.InputJsonValue;
    }>
  ): Promise<number> => {
    const result = await prisma.fraudFlag.createMany({ data: flags });
    return result.count;
  },

  listByUser: async (userId: string): Promise<FraudFlag[]> => {
    return prisma.fraudFlag.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  listUnresolved: async (page = 1, limit = 20): Promise<{ flags: FraudFlag[]; total: number }> => {
    const [flags, total] = await prisma.$transaction([
      prisma.fraudFlag.findMany({
        where: { resolved: false },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.fraudFlag.count({ where: { resolved: false } }),
    ]);
    return { flags, total };
  },

  resolve: async (id: string, resolvedBy: string): Promise<FraudFlag> => {
    return prisma.fraudFlag.update({
      where: { id },
      data: { resolved: true, resolvedBy, resolvedAt: new Date() },
    });
  },

  /** Count fraud signals for a user in the last N hours */
  countRecentForUser: async (userId: string, hours = 24): Promise<number> => {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    return prisma.fraudFlag.count({
      where: { userId, createdAt: { gte: since } },
    });
  },
};
