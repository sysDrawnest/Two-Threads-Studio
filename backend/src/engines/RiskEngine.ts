/**
 * Risk Engine — Phase 5C Orchestrator
 *
 * Central point for all risk decisions at checkout time.
 * Runs: CodEligibilityEngine + FraudDetector + address validation.
 * Returns a single RiskDecision that the order service acts upon.
 *
 * NEVER imported by frontend — all decisions are made server-side.
 */

import { RiskDecision } from '@prisma/client';
import { evaluateCodEligibility, CodEligibilityInput } from './CodEligibilityEngine';
import { runFraudDetection, FraudFlagDetected } from './FraudDetector';
import logger from '../lib/logger';

export interface RiskEvaluationInput {
  userId: string;
  email?: string;

  // Customer risk profile (from CustomerRisk table)
  risk: {
    isBlocked: boolean;
    trustScore: number;
    ordersPlaced: number;
    rtoCount: number;
    cancelledOrders: number;
    chargebackCount: number;
    failedPayments: number;
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

  // Fraud check counts (pre-queried by service)
  failedPaymentsLast24h: number;
  ordersLast24h: number;
  accountsWithSamePhone: number;
  accountsWithSameAddress: number;
}

export interface RiskEvaluationResult {
  decision: RiskDecision;
  trustScore: number;
  codEligible: boolean;
  codIneligibleReason: string | null;
  fraudFlags: FraudFlagDetected[];
  requiresOtp: boolean;
  requiresManualReview: boolean;
  /** Human-readable reason for PREPAID_ONLY or BLOCKED decisions */
  userMessage: string | null;
  /** Internal audit detail */
  auditDetail: string;
  /** Backend-calculated prepaid discount percentage */
  prepaidDiscountPct: number;
}

// Manual review triggers
const MANUAL_REVIEW_ORDER_THRESHOLD = Number(process.env.MANUAL_REVIEW_THRESHOLD_INR || 10000);
const MANUAL_REVIEW_TRUST_THRESHOLD = Number(process.env.MANUAL_REVIEW_TRUST_THRESHOLD || 35);
const PREPAID_DISCOUNT_PCT = Number(process.env.PREPAID_DISCOUNT_PERCENT || 0);

export function evaluateRisk(input: RiskEvaluationInput): RiskEvaluationResult {
  const { risk, orderTotal, paymentMethod, phoneVerified } = input;

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

  // ── 2. Hard block ─────────────────────────────────────────────────────────
  if (risk.isBlocked) {
    return result('BLOCKED', 'Your account has been temporarily restricted. Please contact support.', input, fraudFlags);
  }

  if (risk.chargebackCount >= 1 || highSeverityFlags.length >= 2) {
    return result('BLOCKED', 'We cannot process this order. Please contact support.', input, fraudFlags);
  }

  // ── 3. COD evaluation (only if customer chose COD) ────────────────────────
  let codEligible = true;
  let codIneligibleReason: string | null = null;

  if (paymentMethod === 'COD') {
    const codResult = evaluateCodEligibility({
      isBlocked: risk.isBlocked,
      trustScore: risk.trustScore,
      ordersPlaced: risk.ordersPlaced,
      rtoCount: risk.rtoCount,
      cancelledOrders: risk.cancelledOrders,
      phoneVerified,
      orderTotal,
      hasPersonalizedItems: input.hasPersonalizedItems,
      hasCodDisabledProducts: input.hasCodDisabledProducts,
    } as CodEligibilityInput);

    codEligible = codResult.eligible;
    codIneligibleReason = codResult.reason;

    if (!codResult.eligible) {
      logger.info({ userId: input.userId, reason: codResult.internalReason }, '[RiskEngine] COD blocked');
      return {
        decision: RiskDecision.PREPAID_ONLY,
        trustScore: risk.trustScore,
        codEligible: false,
        codIneligibleReason: codResult.reason,
        fraudFlags,
        requiresOtp: false,
        requiresManualReview: false,
        userMessage: codResult.reason,
        auditDetail: codResult.internalReason,
        prepaidDiscountPct: PREPAID_DISCOUNT_PCT,
      };
    }
  }

  // ── 4. OTP requirement ────────────────────────────────────────────────────
  // OTP required for: first order, COD orders, high-value (> ₹5000), low trust + COD
  const requiresOtp =
    risk.ordersPlaced === 0 ||
    (paymentMethod === 'COD' && !phoneVerified) ||
    (paymentMethod === 'COD' && risk.trustScore < 60) ||
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

  logger.info({ userId: input.userId, decision, trustScore: risk.trustScore }, '[RiskEngine] Evaluation complete');

  return {
    decision,
    trustScore: risk.trustScore,
    codEligible,
    codIneligibleReason,
    fraudFlags,
    requiresOtp,
    requiresManualReview,
    userMessage: null,
    auditDetail: `decision=${decision} trustScore=${risk.trustScore} flags=${fraudFlags.length}`,
    prepaidDiscountPct: paymentMethod === 'ONLINE' ? PREPAID_DISCOUNT_PCT : 0,
  };
}

function result(
  decision: RiskDecision,
  userMessage: string,
  input: RiskEvaluationInput,
  fraudFlags: FraudFlagDetected[]
): RiskEvaluationResult {
  return {
    decision,
    trustScore: input.risk.trustScore,
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
