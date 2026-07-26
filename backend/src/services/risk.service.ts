/**
 * Risk Service — Phase 5C / COD Policy 2.0
 *
 * Provides full risk evaluation workflow used by order.service.ts before
 * creating any order. Fetches dynamic StudioSettings and evaluates customer tiers.
 */

import { OtpPurpose, RiskDecision } from '@prisma/client';
import { customerRiskRepository } from '../repositories/customer-risk.repository';
import { fraudFlagRepository } from '../repositories/fraud-flag.repository';
import { reviewQueueRepository } from '../repositories/review-queue.repository';
import { evaluateRisk, RiskEvaluationInput } from '../engines/RiskEngine';
import { calculateTrustScore } from '../engines/TrustScoreEngine';
import { evaluateCodEligibility } from '../engines/CodEligibilityEngine';
import { evaluateCustomerTier } from './CustomerTierService';
import { validatePinCode } from '../utils/pinValidator';
import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import logger from '../lib/logger';

async function getStudioSettings() {
  const settings = await prisma.studioSettings.findUnique({
    where: { singleton: true },
  });
  if (settings) return settings;

  // Fallback defaults if table is empty
  return {
    codEnabled: true,
    codMaxOrderValue: 5000 as any,
    prepaidDiscountPercent: 5 as any,
    firstOrderCodLimit: 2000 as any,
    trustedCustomerCodLimit: 5000 as any,
    loyalCustomerCodLimit: 10000 as any,
    vipCustomerCodLimit: 25000 as any,
    tier1TrustScore: 50,
    tier2TrustScore: 70,
    tier3TrustScore: 85,
    tier2LifetimeSpendINR: 15000 as any,
    tier3LifetimeSpendINR: 40000 as any,
    allowFirstOrderCod: true,
    requirePhoneVerification: true,
    requireEmailVerification: false,
    codOtpRequired: true,
  };
}

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
    // Fetch user + risk profile + settings
    const [user, riskProfile, settings] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { email: true, phone: true, phoneVerified: true, memberSince: true } }),
      customerRiskRepository.getOrCreate(userId),
      getStudioSettings(),
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

    // Run risk evaluation with dynamic StudioSettings
    const riskInput: RiskEvaluationInput = {
      userId,
      email: user.email,
      risk: {
        isBlocked: riskProfile.isBlocked,
        trustScore: freshTrustScore,
        ordersPlaced: riskProfile.ordersPlaced,
        ordersDelivered: riskProfile.ordersDelivered,
        rtoCount: riskProfile.rtoCount,
        cancelledOrders: riskProfile.cancelledOrders,
        chargebackCount: riskProfile.chargebackCount,
        failedPayments: riskProfile.failedPayments,
        totalLifetimeSpend: Number(riskProfile.totalLifetimeSpend || 0),
        forceCodAllowed: riskProfile.forceCodAllowed,
        forcePrepaidOnly: riskProfile.forcePrepaidOnly,
        tierOverride: riskProfile.tierOverride,
      },
      settings: {
        codEnabled: settings.codEnabled,
        codMaxOrderValue: Number(settings.codMaxOrderValue),
        prepaidDiscountPercent: Number(settings.prepaidDiscountPercent),
        firstOrderCodLimit: Number(settings.firstOrderCodLimit),
        trustedCustomerCodLimit: Number(settings.trustedCustomerCodLimit),
        loyalCustomerCodLimit: Number(settings.loyalCustomerCodLimit),
        vipCustomerCodLimit: Number(settings.vipCustomerCodLimit),
        tier1TrustScore: settings.tier1TrustScore,
        tier2TrustScore: settings.tier2TrustScore,
        tier3TrustScore: settings.tier3TrustScore,
        tier2LifetimeSpendINR: Number(settings.tier2LifetimeSpendINR),
        tier3LifetimeSpendINR: Number(settings.tier3LifetimeSpendINR),
        allowFirstOrderCod: settings.allowFirstOrderCod,
        requirePhoneVerification: settings.requirePhoneVerification,
        requireEmailVerification: settings.requireEmailVerification,
        codOtpRequired: settings.codOtpRequired,
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
        .catch(() => {});
    }

    return {
      ...evaluation,
      pinValidation,
    };
  },

  /**
   * Get COD eligibility for the checkout screen.
   */
  getCodEligibility: async (
    userId: string,
    orderTotal: number,
    productIds: string[]
  ) => {
    const validProductIds = (productIds || []).filter((id): id is string => Boolean(id) && id !== 'null');
    const [user, riskProfile, products, settings] = await Promise.all([
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
      getStudioSettings(),
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

    const customerTier = evaluateCustomerTier(
      {
        ordersDelivered: riskProfile.ordersDelivered,
        rtoCount: riskProfile.rtoCount,
        trustScore,
        totalLifetimeSpend: Number(riskProfile.totalLifetimeSpend || 0),
        tierOverride: riskProfile.tierOverride,
        forcePrepaidOnly: riskProfile.forcePrepaidOnly,
        forceCodAllowed: riskProfile.forceCodAllowed,
      },
      {
        tier1TrustScore: settings.tier1TrustScore,
        tier2TrustScore: settings.tier2TrustScore,
        tier3TrustScore: settings.tier3TrustScore,
        tier2LifetimeSpendINR: Number(settings.tier2LifetimeSpendINR),
        tier3LifetimeSpendINR: Number(settings.tier3LifetimeSpendINR),
        firstOrderCodLimit: Number(settings.firstOrderCodLimit),
        trustedCustomerCodLimit: Number(settings.trustedCustomerCodLimit),
        loyalCustomerCodLimit: Number(settings.loyalCustomerCodLimit),
        vipCustomerCodLimit: Number(settings.vipCustomerCodLimit),
      }
    );

    const result = evaluateCodEligibility({
      isBlocked: riskProfile.isBlocked,
      forceCodAllowed: riskProfile.forceCodAllowed,
      forcePrepaidOnly: riskProfile.forcePrepaidOnly,
      trustScore,
      ordersPlaced: riskProfile.ordersPlaced,
      rtoCount: riskProfile.rtoCount,
      cancelledOrders: riskProfile.cancelledOrders,
      phoneVerified: user.phoneVerified,
      customerTier,
      orderTotal,
      hasPersonalizedItems,
      hasCodDisabledProducts,
      settings: {
        codEnabled: settings.codEnabled,
        allowFirstOrderCod: settings.allowFirstOrderCod,
        requirePhoneVerification: settings.requirePhoneVerification,
        codMaxOrderValue: Number(settings.codMaxOrderValue),
      },
    });

    const prepaidDiscountPct = Number(settings.prepaidDiscountPercent || 0);

    return {
      codEligible: result.eligible,
      reason: result.reason,
      trustScore,
      customerTier,
      firstOrderLimit: Number(settings.firstOrderCodLimit),
      prepaidDiscountPct,
      prepaidDiscountAmount:
        prepaidDiscountPct > 0
          ? Number(((orderTotal * prepaidDiscountPct) / 100).toFixed(2))
          : 0,
    };
  },

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
