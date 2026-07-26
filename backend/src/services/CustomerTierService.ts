/**
 * Customer Tier Service — COD Policy 2.0
 *
 * Single source of truth for classifying customer tiers:
 *   - NEW_MAKER (Tier 0)
 *   - ARTISAN_FRIEND (Tier 1)
 *   - PATRON (Tier 2)
 *   - ATELIER_COLLECTOR (Tier 3 / VIP)
 *
 * Supports admin overrides, dynamic trust score thresholds, and lifetime spend evaluation.
 */

export type CustomerTierKey = 'NEW_MAKER' | 'ARTISAN_FRIEND' | 'PATRON' | 'ATELIER_COLLECTOR';

export interface CustomerTierInfo {
  tier: CustomerTierKey;
  displayName: string;
  codLimit: number;
  isOverridden: boolean;
}

export interface CustomerTierInput {
  ordersDelivered: number;
  rtoCount: number;
  trustScore: number;
  totalLifetimeSpend: number;
  tierOverride?: string | null;
  forcePrepaidOnly?: boolean;
  forceCodAllowed?: boolean;
}

export interface TierSettingsInput {
  tier1TrustScore: number;
  tier2TrustScore: number;
  tier3TrustScore: number;
  tier2LifetimeSpendINR: number;
  tier3LifetimeSpendINR: number;
  firstOrderCodLimit: number;
  trustedCustomerCodLimit: number;
  loyalCustomerCodLimit: number;
  vipCustomerCodLimit: number;
}

export function evaluateCustomerTier(
  riskProfile: CustomerTierInput,
  settings: TierSettingsInput
): CustomerTierInfo {
  // 1. Manual Admin Tier Override Check
  if (riskProfile.tierOverride) {
    return getTierDetails(
      riskProfile.tierOverride as CustomerTierKey,
      true,
      settings
    );
  }

  const { ordersDelivered, rtoCount, trustScore, totalLifetimeSpend } = riskProfile;

  // 2. ATELIER_COLLECTOR (Tier 3 / VIP): 5+ deliveries OR high LTV, 0 RTO, high trust score
  if (
    (ordersDelivered >= 5 || totalLifetimeSpend >= settings.tier3LifetimeSpendINR) &&
    rtoCount === 0 &&
    trustScore >= settings.tier3TrustScore
  ) {
    return getTierDetails('ATELIER_COLLECTOR', false, settings);
  }

  // 3. PATRON (Tier 2): 3+ deliveries OR moderate LTV, 0 RTO, good trust score
  if (
    (ordersDelivered >= 3 || totalLifetimeSpend >= settings.tier2LifetimeSpendINR) &&
    rtoCount === 0 &&
    trustScore >= settings.tier2TrustScore
  ) {
    return getTierDetails('PATRON', false, settings);
  }

  // 4. ARTISAN_FRIEND (Tier 1): 1+ delivery, 0 RTO, normal trust score
  if (ordersDelivered >= 1 && rtoCount === 0 && trustScore >= settings.tier1TrustScore) {
    return getTierDetails('ARTISAN_FRIEND', false, settings);
  }

  // 5. NEW_MAKER (Tier 0): Default for new accounts
  return getTierDetails('NEW_MAKER', false, settings);
}

function getTierDetails(
  tier: CustomerTierKey,
  isOverridden: boolean,
  settings: TierSettingsInput
): CustomerTierInfo {
  switch (tier) {
    case 'ATELIER_COLLECTOR':
      return {
        tier,
        displayName: 'Atelier Collector',
        codLimit: settings.vipCustomerCodLimit,
        isOverridden,
      };
    case 'PATRON':
      return {
        tier,
        displayName: 'Studio Patron',
        codLimit: settings.loyalCustomerCodLimit,
        isOverridden,
      };
    case 'ARTISAN_FRIEND':
      return {
        tier,
        displayName: 'Artisan Friend',
        codLimit: settings.trustedCustomerCodLimit,
        isOverridden,
      };
    case 'NEW_MAKER':
    default:
      return {
        tier: 'NEW_MAKER',
        displayName: 'New Maker',
        codLimit: settings.firstOrderCodLimit,
        isOverridden,
      };
  }
}
