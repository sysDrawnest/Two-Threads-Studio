/**
 * COD Eligibility Engine — Phase 5C / COD Policy 2.0
 *
 * Evaluates whether a customer can use Cash on Delivery for a given order.
 * Incorporates:
 *   - Customer Tiers (NEW_MAKER, ARTISAN_FRIEND, PATRON, ATELIER_COLLECTOR)
 *   - Feature Flags & Studio Settings (dynamic limits)
 *   - Admin Overrides (forceCodAllowed, forcePrepaidOnly)
 *   - Product & Customization Restrictions
 *
 * Entirely backend-side: frontend never decides eligibility.
 */

import { CustomerTierInfo } from '../services/CustomerTierService';

export interface CodEligibilityInput {
  // Customer risk profile & Overrides
  isBlocked: boolean;
  forceCodAllowed?: boolean;
  forcePrepaidOnly?: boolean;
  trustScore: number;
  ordersPlaced: number;
  rtoCount: number;
  cancelledOrders: number;
  phoneVerified: boolean;

  // Customer Tier details
  customerTier: CustomerTierInfo;

  // Order context
  orderTotal: number;       // in INR
  hasPersonalizedItems: boolean;  // engravingText, isPersonalizable, madeToOrder
  hasCodDisabledProducts: boolean; // Product.allowCod === false

  // Feature Flags & Settings from StudioSettings
  settings: {
    codEnabled: boolean;
    allowFirstOrderCod: boolean;
    requirePhoneVerification: boolean;
    codMaxOrderValue: number;
    codMinTrustScore?: number;
    codMaxCancellations?: number;
  };
}

export interface CodEligibilityResult {
  eligible: boolean;
  reason: string | null;   // Shown to customer if not eligible (user-friendly)
  internalReason: string;  // Detailed reason for logging/auditing
}

export function evaluateCodEligibility(
  input: CodEligibilityInput
): CodEligibilityResult {
  const { settings, customerTier } = input;

  // Rule 0: Global COD Toggle
  if (!settings.codEnabled) {
    return {
      eligible: false,
      reason: 'Cash on Delivery is currently disabled.',
      internalReason: 'Global StudioSettings.codEnabled is false',
    };
  }

  // Rule 1: Admin Force Prepaid Override
  if (input.forcePrepaidOnly) {
    return {
      eligible: false,
      reason: 'COD is unavailable for this account.',
      internalReason: 'Admin override: forcePrepaidOnly is active',
    };
  }

  // Rule 2: Admin Force COD Allowed Override
  if (input.forceCodAllowed) {
    return {
      eligible: true,
      reason: null,
      internalReason: 'Admin override: forceCodAllowed active (bypassed checks)',
    };
  }

  // Rule 3: Blocked account
  if (input.isBlocked) {
    return {
      eligible: false,
      reason: 'COD is unavailable for this account.',
      internalReason: 'Customer account is blocked',
    };
  }

  // Rule 4: Phone verification check
  if (settings.requirePhoneVerification && !input.phoneVerified) {
    return {
      eligible: false,
      reason: 'Please verify your phone number to use COD.',
      internalReason: 'Phone number not verified — COD blocked',
    };
  }

  // Rule 5: Personalized or custom items in cart (Strict Product Rule)
  if (input.hasPersonalizedItems) {
    return {
      eligible: false,
      reason: 'COD is not available for personalized or custom-made products.',
      internalReason: 'Cart contains personalized/made-to-order items',
    };
  }

  // Rule 6: Product-level COD restriction
  if (input.hasCodDisabledProducts) {
    return {
      eligible: false,
      reason: 'One or more products in your cart do not support COD.',
      internalReason: 'Cart contains products with allowCod = false',
    };
  }

  // Rule 7: Previous RTO Check
  if (input.rtoCount > 0) {
    return {
      eligible: false,
      reason: 'COD is unavailable due to a previous return-to-origin on your account.',
      internalReason: `Customer has ${input.rtoCount} RTO(s) on record`,
    };
  }

  // Rule 8: Excessive cancellations
  const maxCancellations = settings.codMaxCancellations ?? 3;
  if (input.cancelledOrders >= maxCancellations) {
    return {
      eligible: false,
      reason: 'COD is unavailable due to your recent order cancellation history.',
      internalReason: `Customer has ${input.cancelledOrders} cancellations (max ${maxCancellations})`,
    };
  }

  // Rule 9: Tier 0 First-Time Customer Check
  if (input.ordersPlaced === 0) {
    if (!settings.allowFirstOrderCod) {
      return {
        eligible: false,
        reason: 'COD becomes available after your first successful online order.',
        internalReason: 'First-time customer — allowFirstOrderCod is false',
      };
    }
  }

  // Rule 10: Tier-based Order Limit Check
  const effectiveLimit = customerTier.codLimit;
  if (input.orderTotal > effectiveLimit) {
    return {
      eligible: false,
      reason: `For your ${customerTier.displayName} account, COD is available for orders up to ₹${effectiveLimit.toLocaleString('en-IN')}.`,
      internalReason: `Order total ₹${input.orderTotal} exceeds tier limit ₹${effectiveLimit} (${customerTier.tier})`,
    };
  }

  return {
    eligible: true,
    reason: null,
    internalReason: `All COD Policy 2.0 checks passed (Tier: ${customerTier.tier}, Limit: ₹${effectiveLimit})`,
  };
}
