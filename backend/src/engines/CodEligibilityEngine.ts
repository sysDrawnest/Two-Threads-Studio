/**
 * COD Eligibility Engine — Phase 5C
 *
 * Evaluates whether a customer can use Cash on Delivery for a given order.
 * Rules run in priority order — first match wins.
 * Entirely backend-side: frontend never decides eligibility.
 */

export interface CodEligibilityInput {
  // Customer risk profile
  isBlocked: boolean;
  trustScore: number;
  ordersPlaced: number;
  rtoCount: number;
  cancelledOrders: number;
  phoneVerified: boolean;

  // Order context
  orderTotal: number;       // in INR
  hasPersonalizedItems: boolean;  // engravingText, isPersonalizable, madeToOrder
  hasCodDisabledProducts: boolean; // Product.allowCod === false
}

export interface CodEligibilityResult {
  eligible: boolean;
  reason: string | null;   // Shown to customer if not eligible (user-friendly)
  internalReason: string;  // Detailed reason for logging/auditing
}

// Configurable thresholds (can be moved to env/DB in future)
const COD_MAX_ORDER_VALUE = Number(process.env.COD_MAX_ORDER_VALUE_INR || 2500);
const COD_MIN_TRUST_SCORE = Number(process.env.COD_MIN_TRUST_SCORE || 40);
const COD_MAX_CANCELLATIONS = Number(process.env.COD_MAX_CANCELLATIONS || 3);

export function evaluateCodEligibility(
  input: CodEligibilityInput
): CodEligibilityResult {
  // Rule 1: Blocked account
  if (input.isBlocked) {
    return {
      eligible: false,
      reason: 'COD is unavailable for this account.',
      internalReason: 'Customer account is blocked',
    };
  }

  // Rule 2: Trust score too low
  if (input.trustScore < COD_MIN_TRUST_SCORE) {
    return {
      eligible: false,
      reason: 'COD is unavailable for this account at this time.',
      internalReason: `Trust score ${input.trustScore} below minimum ${COD_MIN_TRUST_SCORE}`,
    };
  }

  // Rule 3: First-time customer (no prior orders)
  if (input.ordersPlaced === 0) {
    return {
      eligible: false,
      reason: 'COD becomes available after your first successful online order.',
      internalReason: 'First-time customer — COD not yet unlocked',
    };
  }

  // Rule 4: Order value exceeds limit
  if (input.orderTotal > COD_MAX_ORDER_VALUE) {
    return {
      eligible: false,
      reason: `COD is available only for orders up to ₹${COD_MAX_ORDER_VALUE.toLocaleString('en-IN')}.`,
      internalReason: `Order total ₹${input.orderTotal} exceeds COD limit ₹${COD_MAX_ORDER_VALUE}`,
    };
  }

  // Rule 5: Personalized or custom items in cart
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

  // Rule 7: Previous RTO
  if (input.rtoCount > 0) {
    return {
      eligible: false,
      reason: 'COD is unavailable due to a previous return-to-origin on your account.',
      internalReason: `Customer has ${input.rtoCount} RTO(s) on record`,
    };
  }

  // Rule 8: Excessive cancellations
  if (input.cancelledOrders >= COD_MAX_CANCELLATIONS) {
    return {
      eligible: false,
      reason: 'COD is unavailable due to your order history.',
      internalReason: `Customer has ${input.cancelledOrders} cancellations (max ${COD_MAX_CANCELLATIONS})`,
    };
  }

  // Rule 9: Phone must be verified for COD
  if (!input.phoneVerified) {
    return {
      eligible: false,
      reason: 'Please verify your phone number to use COD.',
      internalReason: 'Phone number not verified — COD blocked',
    };
  }

  return {
    eligible: true,
    reason: null,
    internalReason: 'All COD eligibility checks passed',
  };
}
