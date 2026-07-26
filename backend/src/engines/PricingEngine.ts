/**
 * Central Pricing Engine — Phase 7.1
 * Single-source-of-truth server calculations for Subtotal, Shipping, GST, COD, and Grand Total.
 * 100% server-authoritative — client-side totals are never trusted.
 */

import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';

export interface CartItemCalculationInput {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface PricingCalculationResult {
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productName: string;
  }>;
  subtotal: number;
  shipping: number;
  shippingMethodId?: string | null;
  shippingMethodName?: string;
  tax: number;
  gstMode: 'inclusive' | 'exclusive';
  gstPercent: number;
  codFee: number;
  grandTotal: number;
  currency: string;
}

export const pricingEngine = {
  /**
   * Calculates current authoritative cart/checkout totals based on DB studio settings
   * and selected shipping/payment methods.
   */
  calculateTotals: async (params: {
    items: CartItemCalculationInput[];
    shippingMethodId?: string | null;
    paymentMethod?: 'ONLINE' | 'COD' | 'BANK_TRANSFER' | null;
    shippingState?: string | null;
  }): Promise<PricingCalculationResult> => {
    // 1. Fetch Business Settings (Singleton)
    const settings = await prisma.studioSettings.findUnique({
      where: { singleton: true },
    });

    const freeShippingThreshold = Number(settings?.freeShippingThreshold ?? 500);
    const standardShippingCharge = Number(settings?.standardShippingCharge ?? 60);
    const codExtraCharge = Number(settings?.codExtraCharge ?? 0);
    const gstPercent = Number(settings?.gstPercent ?? 0);
    const gstMode = (settings?.gstMode === 'exclusive' ? 'exclusive' : 'inclusive') as 'inclusive' | 'exclusive';

    // 2. Fetch products & variants for pricing validation
    const productIds = params.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        status: true,
        variants: {
          select: { id: true, value: true, priceAdjustment: true },
        },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // 3. Calculate Item Lines & Subtotal
    let subtotal = 0;
    const calculatedItems = params.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product || product.status !== 'ACTIVE') {
        throw new AppError(
          `Product ${product ? product.name : item.productId} is unavailable.`,
          HTTP_STATUS.BAD_REQUEST,
          'PRODUCT_UNAVAILABLE'
        );
      }

      let unitPrice = Number(product.price);

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant && variant.priceAdjustment) {
          unitPrice += Number(variant.priceAdjustment);
        }
      }


      const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
      subtotal += lineTotal;

      return {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        productName: product.name,
      };
    });

    subtotal = Number(subtotal.toFixed(2));

    // 4. Calculate Shipping Charge
    let shipping = 0;
    let selectedShippingMethodName = 'Standard Shipping';

    if (params.shippingMethodId) {
      const method = await prisma.shippingMethod.findUnique({
        where: { id: params.shippingMethodId },
      });

      if (method && method.isEnabled) {
        selectedShippingMethodName = method.name;
        const minForFree = method.minOrderForFree ? Number(method.minOrderForFree) : freeShippingThreshold;
        if (subtotal >= minForFree) {
          shipping = 0;
        } else {
          shipping = Number(method.basePrice);
        }
      } else {
        // Fallback standard shipping calculation
        shipping = subtotal >= freeShippingThreshold ? 0 : standardShippingCharge;
      }
    } else {
      // Default rule from StudioSettings
      shipping = subtotal >= freeShippingThreshold ? 0 : standardShippingCharge;
    }

    shipping = Number(shipping.toFixed(2));

    // 5. Calculate GST Tax
    let tax = 0;
    if (gstPercent > 0) {
      if (gstMode === 'exclusive') {
        tax = Number(((subtotal * gstPercent) / 100).toFixed(2));
      } else {
        // GST Inclusive: portion of subtotal that is tax
        tax = Number((subtotal - subtotal / (1 + gstPercent / 100)).toFixed(2));
      }
    }

    // 6. Calculate COD Fee
    const codFee = params.paymentMethod === 'COD' ? Number(codExtraCharge.toFixed(2)) : 0;

    // 7. Calculate Grand Total
    const grandTotal = Number(
      (gstMode === 'exclusive' ? subtotal + shipping + tax + codFee : subtotal + shipping + codFee).toFixed(2)
    );

    return {
      items: calculatedItems,
      subtotal,
      shipping,
      shippingMethodId: params.shippingMethodId,
      shippingMethodName: selectedShippingMethodName,
      tax,
      gstMode,
      gstPercent,
      codFee,
      grandTotal,
      currency: 'INR',
    };
  },
};
