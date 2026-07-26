/**
 * Risk Engine — Phase 5C / COD Policy 2.0 Orchestrator
 *
 * Central point for all risk decisions at checkout time.
 * Integrates CustomerTierService, CodEligibilityEngine, and FraudDetector.
 */

import { RiskDecision } from '@prisma/client';
import { evaluateCodEligibility } from './CodEligibilityEngine';
import { runFraudDetection, FraudFlagDetected } from './FraudDetector';
import { evaluateCustomerTier, CustomerTierInfo } from '../services/CustomerTierService';
import logger from '../lib/logger';

export interface RiskEvaluationInput {
  userId: string;
  email?: string;

  // Customer risk profile (from CustomerRisk table)
  risk: {
    isBlocked: boolean;
    trustScore: number;
    ordersPlaced: number;
    ordersDelivered: number;
    rtoCount: number;
    cancelledOrders: number;
    chargebackCount: number;
    failedPayments: number;
    totalLifetimeSpend?: number;
    forceCodAllowed?: boolean;
    forcePrepaidOnly?: boolean;
    tierOverride?: string | null;
  };

  // Dynamic StudioSettings from DB
  settings: {
    codEnabled: boolean;
    codMaxOrderValue: number;
    prepaidDiscountPercent: number;
    firstOrderCodLimit: number;
    trustedCustomerCodLimit: number;
    loyalCustomerCodLimit: number;
    vipCustomerCodLimit: number;
    tier1TrustScore: number;
    tier2TrustScore: number;
    tier3TrustScore: number;
    tier2LifetimeSpendINR: number;
    tier3LifetimeSpendINR: number;
    allowFirstOrderCod: boolean;
    requirePhoneVerification: boolean;
    requireEmailVerification: boolean;
    codOtpRequired: boolean;
  };

  // Phone status
  phoneVerified: boolean;

  // Order details
  orderTotal: number;
  paymentMethod: 'ONLINE' | 'COD' | 'BANK_TRANSFER';
  hasPersonalizedItems: boolean;
  hasCodDisabledProducts: boolean;

  // Address
  postalCode?: string;
  phone?: string;

  // Fraud check counts
  failedPaymentsLast24h: number;
  ordersLast24h: number;
  accountsWithSamePhone: number;
  accountsWithSameAddress: number;
}

export interface RiskEvaluationResult {
  decision: RiskDecision;
  trustScore: number;
  customerTier: CustomerTierInfo;
  codEligible: boolean;
  codIneligibleReason: string | null;
  fraudFlags: FraudFlagDetected[];
  requiresOtp: boolean;
  requiresManualReview: boolean;
  userMessage: string | null;
  auditDetail: string;
  prepaidDiscountPct: number;
}

const MANUAL_REVIEW_ORDER_THRESHOLD = Number(process.env.MANUAL_REVIEW_THRESHOLD_INR || 10000);
const MANUAL_REVIEW_TRUST_THRESHOLD = Number(process.env.MANUAL_REVIEW_TRUST_THRESHOLD || 35);

export function evaluateRisk(input: RiskEvaluationInput): RiskEvaluationResult {
  const { risk, orderTotal, paymentMethod, phoneVerified, settings } = input;
  const prepaidDiscountPct = Number(settings.prepaidDiscountPercent || 0);

  // ── 0. Evaluate Customer Tier via CustomerTierService ─────────────────────
  const customerTier = evaluateCustomerTier(
    {
      ordersDelivered: risk.ordersDelivered || 0,
      rtoCount: risk.rtoCount || 0,
      trustScore: risk.trustScore,
      totalLifetimeSpend: risk.totalLifetimeSpend || 0,
      tierOverride: risk.tierOverride,
      forcePrepaidOnly: risk.forcePrepaidOnly,
      forceCodAllowed: risk.forceCodAllowed,
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

  // ── 1. Fraud detection ────────────────────────────────────────────────────
  const fraudFlags = runFraudDetection({
    userId: input.userId,
    email: input.email,
    phone: input.phone,
    postalCode: input.postalCode,
    failedPaymentsLast24h: input.failedPaymentsLast24h,
    ordersLast24h: input.ordersLast24h,
    accountsWithSamePhone: input.accountsWithSamePhone,
    accountsWithSameAddress: input.accountsWithSameAddress,
  });

  const highSeverityFlags = fraudFlags.filter((f) => f.severity === 'HIGH');

  // ── 2. Hard blocks & Admin Overrides ──────────────────────────────────────
  if (risk.forcePrepaidOnly) {
    return result('PREPAID_ONLY', 'COD is unavailable for this account.', input, customerTier, fraudFlags, prepaidDiscountPct);
  }

  if (risk.isBlocked) {
    return result('BLOCKED', 'Your account has been temporarily restricted. Please contact support.', input, customerTier, fraudFlags, prepaidDiscountPct);
  }

  if (risk.chargebackCount >= 1 || highSeverityFlags.length >= 2) {
    return result('BLOCKED', 'We cannot process this order. Please contact support.', input, customerTier, fraudFlags, prepaidDiscountPct);
  }

  // ── 3. COD evaluation ─────────────────────────────────────────────────────
  let codEligible = true;
  let codIneligibleReason: string | null = null;

  if (paymentMethod === 'COD') {
    const codResult = evaluateCodEligibility({
      isBlocked: risk.isBlocked,
      forceCodAllowed: risk.forceCodAllowed,
      forcePrepaidOnly: risk.forcePrepaidOnly,
      trustScore: risk.trustScore,
      ordersPlaced: risk.ordersPlaced,
      rtoCount: risk.rtoCount,
      cancelledOrders: risk.cancelledOrders,
      phoneVerified,
      customerTier,
      orderTotal,
      hasPersonalizedItems: input.hasPersonalizedItems,
      hasCodDisabledProducts: input.hasCodDisabledProducts,
      settings: {
        codEnabled: settings.codEnabled,
        allowFirstOrderCod: settings.allowFirstOrderCod,
        requirePhoneVerification: settings.requirePhoneVerification,
        codMaxOrderValue: Number(settings.codMaxOrderValue),
      },
    });

    codEligible = codResult.eligible;
    codIneligibleReason = codResult.reason;

    if (!codResult.eligible) {
      logger.info({ userId: input.userId, reason: codResult.internalReason }, '[RiskEngine] COD blocked');
      return {
        decision: RiskDecision.PREPAID_ONLY,
        trustScore: risk.trustScore,
        customerTier,
        codEligible: false,
        codIneligibleReason: codResult.reason,
        fraudFlags,
        requiresOtp: false,
        requiresManualReview: false,
        userMessage: codResult.reason,
        auditDetail: codResult.internalReason,
        prepaidDiscountPct,
      };
    }
  }

  // ── 4. OTP requirement ────────────────────────────────────────────────────
  const requiresOtp =
    (settings.codOtpRequired && paymentMethod === 'COD' && !phoneVerified) ||
    (risk.ordersPlaced === 0 && settings.requirePhoneVerification && !phoneVerified) ||
    (paymentMethod === 'COD' && risk.trustScore < settings.tier1TrustScore) ||
    (orderTotal > 5000 && !phoneVerified);

  // ── 5. Manual review ──────────────────────────────────────────────────────
  const requiresManualReview =
    orderTotal > MANUAL_REVIEW_ORDER_THRESHOLD ||
    risk.trustScore < MANUAL_REVIEW_TRUST_THRESHOLD ||
    risk.rtoCount >= 2 ||
    (fraudFlags.length >= 2 && highSeverityFlags.length >= 1);

  // ── 6. Final decision ─────────────────────────────────────────────────────
  let decision: RiskDecision;
  if (requiresOtp && !phoneVerified) {
    decision = RiskDecision.REQUIRES_OTP;
  } else if (requiresManualReview) {
    decision = RiskDecision.MANUAL_REVIEW;
  } else {
    decision = RiskDecision.APPROVED;
  }

  logger.info(
    { userId: input.userId, decision, tier: customerTier.tier, trustScore: risk.trustScore },
    '[RiskEngine] Evaluation complete'
  );

  return {
    decision,
    trustScore: risk.trustScore,
    customerTier,
    codEligible,
    codIneligibleReason,
    fraudFlags,
    requiresOtp,
    requiresManualReview,
    userMessage: null,
    auditDetail: `decision=${decision} tier=${customerTier.tier} trustScore=${risk.trustScore} flags=${fraudFlags.length}`,
    prepaidDiscountPct: paymentMethod === 'ONLINE' ? prepaidDiscountPct : 0,
  };
}

function result(
  decision: RiskDecision,
  userMessage: string,
  input: RiskEvaluationInput,
  customerTier: CustomerTierInfo,
  fraudFlags: FraudFlagDetected[],
  prepaidDiscountPct: number
): RiskEvaluationResult {
  return {
    decision,
    trustScore: input.risk.trustScore,
    customerTier,
    codEligible: false,
    codIneligibleReason: userMessage,
    fraudFlags,
    requiresOtp: false,
    requiresManualReview: false,
    userMessage,
    auditDetail: `Hard block: ${decision}`,
    prepaidDiscountPct: 0,
  };
}
