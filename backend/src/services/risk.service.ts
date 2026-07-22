/**
 * Risk Service — Phase 5C
 *
 * Provides the full risk evaluation workflow used by order.service.ts before
 * creating any order. Also exposes trust score recalculation, fraud flag persistence,
 * and review queue management.
 */

import { OtpPurpose, RiskDecision } from '@prisma/client';
import { customerRiskRepository } from '../repositories/customer-risk.repository';
import { fraudFlagRepository } from '../repositories/fraud-flag.repository';
import { reviewQueueRepository } from '../repositories/review-queue.repository';
import { evaluateRisk, RiskEvaluationInput } from '../engines/RiskEngine';
import { calculateTrustScore } from '../engines/TrustScoreEngine';
import { evaluateCodEligibility } from '../engines/CodEligibilityEngine';
import { validatePinCode } from '../utils/pinValidator';
import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import logger from '../lib/logger';


export const riskService = {
  /**
   * Full risk evaluation for a checkout attempt.
   * Called by order.service BEFORE creating an order.
   */
  evaluateCheckout: async (
    userId: string,
    input: {
      orderTotal: number;
      paymentMethod: 'ONLINE' | 'COD' | 'BANK_TRANSFER';
      cartItems: Array<{
        productId: string;
        engravingText?: string | null;
        customization?: any;
      }>;
      shippingAddressId: string;
    }
  ) => {
    // Fetch user + risk profile
    const [user, riskProfile] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { email: true, phone: true, phoneVerified: true, memberSince: true } }),
      customerRiskRepository.getOrCreate(userId),
    ]);

    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

    // Fetch address for PIN validation
    const address = await prisma.address.findUnique({
      where: { id: input.shippingAddressId },
      select: { postalCode: true, state: true, city: true, phone: true },
    });

    // Fetch product allowCod flags for items in cart
    const productIds = input.cartItems.map((i) => i.productId).filter((id): id is string => Boolean(id) && id !== 'null');
    const products = productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, allowCod: true, isPersonalizable: true, madeToOrder: true },
        })
      : [];

    const hasCodDisabledProducts = products.some((p: { allowCod: boolean }) => !p.allowCod);
    const hasPersonalizedItems =
      products.some((p: { isPersonalizable: boolean; madeToOrder: boolean }) => p.isPersonalizable || p.madeToOrder) ||
      input.cartItems.some(
        (i) => i.engravingText || (i.customization && Object.keys(i.customization).length > 0)
      );

    // Fraud check counts (last 24h)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [failedPaymentsLast24h, ordersLast24h, accountsWithSamePhone, accountsWithSameAddress] =
      await Promise.all([
        prisma.payment.count({
          where: { order: { userId }, status: 'FAILED', createdAt: { gte: yesterday } },
        }),
        prisma.order.count({ where: { userId, createdAt: { gte: yesterday } } }),
        user.phone
          ? prisma.user.count({ where: { phone: user.phone, id: { not: userId } } })
          : Promise.resolve(0),
        address?.postalCode
          ? prisma.address.count({
              where: {
                postalCode: address.postalCode,
                userId: { not: userId },
              },
            })
          : Promise.resolve(0),
      ]);

    // Account age in days
    const accountAgeDays = Math.floor(
      (Date.now() - (user.memberSince?.getTime() ?? Date.now())) / (1000 * 60 * 60 * 24)
    );

    // Recalculate trust score from current counters
    const { score: freshTrustScore } = calculateTrustScore({
      ordersPlaced: riskProfile.ordersPlaced,
      ordersDelivered: riskProfile.ordersDelivered,
      rtoCount: riskProfile.rtoCount,
      cancelledOrders: riskProfile.cancelledOrders,
      prepaidOrders: riskProfile.prepaidOrders,
      codOrders: riskProfile.codOrders,
      chargebackCount: riskProfile.chargebackCount,
      failedPayments: riskProfile.failedPayments,
      accountAgeDays,
      phoneVerified: user.phoneVerified,
    });

    // Persist updated trust score
    await customerRiskRepository.updateTrustScore(userId, freshTrustScore);

    // Run risk evaluation
    const riskInput: RiskEvaluationInput = {
      userId,
      email: user.email,
      risk: {
        isBlocked: riskProfile.isBlocked,
        trustScore: freshTrustScore,
        ordersPlaced: riskProfile.ordersPlaced,
        rtoCount: riskProfile.rtoCount,
        cancelledOrders: riskProfile.cancelledOrders,
        chargebackCount: riskProfile.chargebackCount,
        failedPayments: riskProfile.failedPayments,
      },
      phoneVerified: user.phoneVerified,
      orderTotal: input.orderTotal,
      paymentMethod: input.paymentMethod,
      hasPersonalizedItems,
      hasCodDisabledProducts,
      postalCode: address?.postalCode,
      phone: address?.phone || user.phone || undefined,
      failedPaymentsLast24h,
      ordersLast24h,
      accountsWithSamePhone,
      accountsWithSameAddress,
    };

    const evaluation = evaluateRisk(riskInput);

    // Persist fraud flags if any
    if (evaluation.fraudFlags.length > 0) {
      await fraudFlagRepository.createMany(
        evaluation.fraudFlags.map((f) => ({
          userId,
          type: f.type,
          details: f.details as any,
        }))
      );
    }

    // PIN validation (best-effort, async, non-blocking)
    let pinValidation = null;
    if (address?.postalCode) {
      validatePinCode(address.postalCode, address.city, address.state)
        .then((result) => {
          if (result.apiAvailable && result.addressMatch === false) {
            fraudFlagRepository.create({
              userId,
              type: 'ADDRESS_MISMATCH',
              details: { postalCode: address.postalCode, providedState: address.state },
            });
          }
        })
        .catch(() => {}); // graceful — never blocks
    }

    return {
      ...evaluation,
      pinValidation,
    };
  },

  /**
   * Get COD eligibility for the checkout screen (before cart is finalized).
   * Lighter than evaluateCheckout — no order created yet.
   */
  getCodEligibility: async (
    userId: string,
    orderTotal: number,
    productIds: string[]
  ) => {
    const validProductIds = (productIds || []).filter((id): id is string => Boolean(id) && id !== 'null');
    const [user, riskProfile, products] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { phoneVerified: true, memberSince: true, phone: true },
      }),
      customerRiskRepository.getOrCreate(userId),
      validProductIds.length > 0
        ? prisma.product.findMany({
            where: { id: { in: validProductIds } },
            select: { id: true, allowCod: true, isPersonalizable: true, madeToOrder: true },
          })
        : Promise.resolve([]),
    ]);

    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

    const accountAgeDays = Math.floor(
      (Date.now() - (user.memberSince?.getTime() ?? Date.now())) / (1000 * 60 * 60 * 24)
    );

    const { score: trustScore } = calculateTrustScore({
      ordersPlaced: riskProfile.ordersPlaced,
      ordersDelivered: riskProfile.ordersDelivered,
      rtoCount: riskProfile.rtoCount,
      cancelledOrders: riskProfile.cancelledOrders,
      prepaidOrders: riskProfile.prepaidOrders,
      codOrders: riskProfile.codOrders,
      chargebackCount: riskProfile.chargebackCount,
      failedPayments: riskProfile.failedPayments,
      accountAgeDays,
      phoneVerified: user.phoneVerified,
    });

    const hasCodDisabledProducts = products.some((p: { allowCod: boolean }) => !p.allowCod);
    const hasPersonalizedItems = products.some(
      (p: { isPersonalizable: boolean; madeToOrder: boolean }) => p.isPersonalizable || p.madeToOrder
    );

    const result = evaluateCodEligibility({
      isBlocked: riskProfile.isBlocked,
      trustScore,
      ordersPlaced: riskProfile.ordersPlaced,
      rtoCount: riskProfile.rtoCount,
      cancelledOrders: riskProfile.cancelledOrders,
      phoneVerified: user.phoneVerified,
      orderTotal,
      hasPersonalizedItems,
      hasCodDisabledProducts,
    });

    const prepaidDiscountPct = Number(process.env.PREPAID_DISCOUNT_PERCENT || 0);

    return {
      codEligible: result.eligible,
      reason: result.reason,
      trustScore,
      prepaidDiscountPct,
      prepaidDiscountAmount:
        prepaidDiscountPct > 0
          ? Number(((orderTotal * prepaidDiscountPct) / 100).toFixed(2))
          : 0,
    };
  },

  /**
   * Recalculate and persist trust score for a user.
   * Called by risk event listeners after every order outcome event.
   */
  recalculateTrustScore: async (userId: string): Promise<number> => {
    const [riskProfile, user] = await Promise.all([
      customerRiskRepository.getOrCreate(userId),
      prisma.user.findUnique({
        where: { id: userId },
        select: { phoneVerified: true, memberSince: true },
      }),
    ]);

    if (!user) return 50;

    const accountAgeDays = Math.floor(
      (Date.now() - (user.memberSince?.getTime() ?? Date.now())) / (1000 * 60 * 60 * 24)
    );

    const { score } = calculateTrustScore({
      ordersPlaced: riskProfile.ordersPlaced,
      ordersDelivered: riskProfile.ordersDelivered,
      rtoCount: riskProfile.rtoCount,
      cancelledOrders: riskProfile.cancelledOrders,
      prepaidOrders: riskProfile.prepaidOrders,
      codOrders: riskProfile.codOrders,
      chargebackCount: riskProfile.chargebackCount,
      failedPayments: riskProfile.failedPayments,
      accountAgeDays,
      phoneVerified: user.phoneVerified,
    });

    await customerRiskRepository.updateTrustScore(userId, score);
    logger.info({ userId, score }, '[RiskService] Trust score recalculated');
    return score;
  },

  /** Admin: get risk dashboard summary */
  getDashboardSummary: async () => {
    const [
      totalOrders,
      prepaidOrders,
      codOrders,
      pendingReviews,
      blockedCustomers,
      highRiskCustomers,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { paymentMethod: 'ONLINE' } }),
      prisma.order.count({ where: { paymentMethod: 'COD' } }),
      reviewQueueRepository.pendingCount(),
      customerRiskRepository.list({ isBlocked: true }),
      customerRiskRepository.list({ maxTrustScore: 40 }),
    ]);

    const prepaidRatio = totalOrders > 0 ? Math.round((prepaidOrders / totalOrders) * 100) : 0;
    const codRatio = totalOrders > 0 ? Math.round((codOrders / totalOrders) * 100) : 0;

    const rtoStats = await prisma.customerRisk.aggregate({
      _sum: { rtoCount: true },
      _avg: { trustScore: true },
    });

    return {
      totalOrders,
      prepaidOrders,
      codOrders,
      prepaidRatio,
      codRatio,
      totalRtos: rtoStats._sum.rtoCount || 0,
      avgTrustScore: Math.round(rtoStats._avg.trustScore || 50),
      pendingReviews,
      blockedCustomers: blockedCustomers.total,
      highRiskCustomers: highRiskCustomers.total,
    };
  },
};
