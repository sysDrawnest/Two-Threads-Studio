/**
 * Authoritative Backend Customization & Option Pricing Engine
 * Calculates item unit prices incorporating base price, variant adjustments,
 * and custom artisan options (hoop finishes, engraving, gift wrapping).
 */

export interface CustomizationPriceInput {
  basePrice: number | string;
  variantAdjustment?: number | string | null;
  customization?: Record<string, any> | null;
  engravingText?: string | null;
  giftWrap?: boolean | null;
}

/**
 * Customization Add-On Pricing Rules:
 *  - Walnut Hoop Finish: +₹500.00
 *  - Personal Engraving: +₹500.00
 *  - Luxury Gift Wrap:   +₹300.00
 */
export function calculateCustomizedUnitPrice(input: CustomizationPriceInput): number {
  let unitPrice = Number(input.basePrice) || 0;

  // 1. Variant Price Adjustment
  if (input.variantAdjustment) {
    unitPrice += Number(input.variantAdjustment);
  }

  // 2. Customization Options (Hoop Finish)
  if (input.customization && input.customization.hoopFinish === 'walnut') {
    unitPrice += 500;
  }

  // 3. Personal Engraving
  if (input.engravingText && typeof input.engravingText === 'string' && input.engravingText.trim().length > 0) {
    unitPrice += 500;
  }

  // 4. Luxury Gift Wrap
  if (input.giftWrap === true) {
    unitPrice += 300;
  }

  return Number(unitPrice.toFixed(2));
}
