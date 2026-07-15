/**
 * Return Policy Repository — Phase 5C
 */

import { ReturnPolicy, ReturnEligibility } from '@prisma/client';
import prisma from '../prisma';

export const returnPolicyRepository = {
  upsert: async (data: {
    productId: string;
    eligibility: ReturnEligibility;
    windowDays: number;
    reason?: string;
  }): Promise<ReturnPolicy> => {
    return prisma.returnPolicy.upsert({
      where: { productId: data.productId },
      create: data,
      update: {
        eligibility: data.eligibility,
        windowDays: data.windowDays,
        reason: data.reason,
      },
    });
  },

  findByProductId: async (productId: string): Promise<ReturnPolicy | null> => {
    return prisma.returnPolicy.findUnique({ where: { productId } });
  },

  findMany: async (productIds: string[]): Promise<ReturnPolicy[]> => {
    return prisma.returnPolicy.findMany({
      where: { productId: { in: productIds } },
    });
  },

  delete: async (productId: string): Promise<void> => {
    await prisma.returnPolicy.delete({ where: { productId } });
  },

  /**
   * Check if a return is eligible for a given order item.
   * Returns the policy, or a default FULL_RETURN policy if none set.
   */
  checkEligibility: async (
    productId: string,
    orderCreatedAt: Date
  ): Promise<{
    eligible: boolean;
    reason: string;
    windowDays: number;
    eligibility: ReturnEligibility;
  }> => {
    const policy = await prisma.returnPolicy.findUnique({ where: { productId } });

    // Default policy: 7-day full return if no specific policy set
    if (!policy) {
      const daysSinceOrder = Math.floor(
        (Date.now() - orderCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      const eligible = daysSinceOrder <= 7;
      return {
        eligible,
        reason: eligible ? 'Within 7-day return window' : 'Return window has expired',
        windowDays: 7,
        eligibility: ReturnEligibility.FULL_RETURN,
      };
    }

    if (policy.eligibility === ReturnEligibility.NO_RETURN) {
      return {
        eligible: false,
        reason: policy.reason || 'This product is not eligible for returns.',
        windowDays: 0,
        eligibility: ReturnEligibility.NO_RETURN,
      };
    }

    const daysSinceOrder = Math.floor(
      (Date.now() - orderCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const eligible = policy.windowDays > 0 && daysSinceOrder <= policy.windowDays;

    return {
      eligible,
      reason: eligible
        ? `Within ${policy.windowDays}-day ${policy.eligibility === ReturnEligibility.EXCHANGE_ONLY ? 'exchange' : 'return'} window`
        : policy.reason || 'Return window has expired',
      windowDays: policy.windowDays,
      eligibility: policy.eligibility,
    };
  },
};
