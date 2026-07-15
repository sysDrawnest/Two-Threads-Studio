/**
 * Trust Score Engine — Phase 5C
 *
 * Calculates trust score from a CustomerRisk record.
 * Score is NEVER manually set — it's derived from objective counters.
 * Range: 0–100. Default for new users: 50.
 */

export interface TrustInputs {
  ordersPlaced: number;
  ordersDelivered: number;
  rtoCount: number;
  cancelledOrders: number;
  prepaidOrders: number;
  codOrders: number;
  chargebackCount: number;
  failedPayments: number;
  /** Account age in days */
  accountAgeDays: number;
  /** Whether phone is verified */
  phoneVerified: boolean;
}

export interface TrustScoreResult {
  score: number;         // 0–100
  tier: 'EXCELLENT' | 'GOOD' | 'NORMAL' | 'RISKY' | 'HIGH_RISK';
  breakdown: Record<string, number>; // for transparency
}

const MAX_SCORE = 100;
const MIN_SCORE = 0;
const DEFAULT_SCORE = 50;

/**
 * Clamps a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function calculateTrustScore(inputs: TrustInputs): TrustScoreResult {
  let score = DEFAULT_SCORE;
  const breakdown: Record<string, number> = { base: DEFAULT_SCORE };

  // ── Positive signals ──────────────────────────────────────────────────────

  // Successful deliveries (+4 each, max +20)
  const deliveryBonus = Math.min(inputs.ordersDelivered * 4, 20);
  score += deliveryBonus;
  breakdown['deliveries'] = deliveryBonus;

  // Prepaid order history (+3 each, max +15)
  const prepaidBonus = Math.min(inputs.prepaidOrders * 3, 15);
  score += prepaidBonus;
  breakdown['prepaid_history'] = prepaidBonus;

  // Verified phone (+10, one-time)
  if (inputs.phoneVerified) {
    score += 10;
    breakdown['phone_verified'] = 10;
  }

  // Account age bonus
  let ageBonus = 0;
  if (inputs.accountAgeDays >= 365) ageBonus = 10;
  else if (inputs.accountAgeDays >= 180) ageBonus = 5;
  else if (inputs.accountAgeDays >= 90) ageBonus = 2;
  score += ageBonus;
  breakdown['account_age'] = ageBonus;

  // ── Negative signals ──────────────────────────────────────────────────────

  // RTO penalty (-15 each)
  const rtoPenalty = inputs.rtoCount * 15;
  score -= rtoPenalty;
  breakdown['rto_penalty'] = -rtoPenalty;

  // Order cancellations (-5 each, max -20)
  const cancelPenalty = Math.min(inputs.cancelledOrders * 5, 20);
  score -= cancelPenalty;
  breakdown['cancellation_penalty'] = -cancelPenalty;

  // Chargebacks (-20 each)
  const chargebackPenalty = inputs.chargebackCount * 20;
  score -= chargebackPenalty;
  breakdown['chargeback_penalty'] = -chargebackPenalty;

  // Repeated failed payments (-5 per payment, max -15)
  const failedPaymentPenalty = Math.min(inputs.failedPayments * 5, 15);
  score -= failedPaymentPenalty;
  breakdown['failed_payments_penalty'] = -failedPaymentPenalty;

  // ── Final clamping ────────────────────────────────────────────────────────

  score = clamp(Math.round(score), MIN_SCORE, MAX_SCORE);
  breakdown['final'] = score;

  // ── Tier classification ───────────────────────────────────────────────────

  let tier: TrustScoreResult['tier'];
  if (score >= 85) tier = 'EXCELLENT';
  else if (score >= 65) tier = 'GOOD';
  else if (score >= 45) tier = 'NORMAL';
  else if (score >= 25) tier = 'RISKY';
  else tier = 'HIGH_RISK';

  return { score, tier, breakdown };
}
