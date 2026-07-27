/**
 * Central Pricing Engine — Phase 7.1
 * Single-source-of-truth server calculations for Subtotal, Shipping, GST, COD, and Grand Total.
 * 100% server-authoritative — client-side totals are never trusted.
 */

import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';

import { promotionsEngine } from './PromotionsEngine';

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
  discount: number;
  couponCode?: string | null;
  couponTitle?: string | null;
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
   * Calculates current authoritative cart/checkout totals based on DB studio settings,
   * selected shipping/payment methods, and applied coupons/promotions.
   */
  calculateTotals: async (params: {
    items: CartItemCalculationInput[];
    shippingMethodId?: string | null;
    paymentMethod?: 'ONLINE' | 'COD' | 'BANK_TRANSFER' | null;
    shippingState?: string | null;
    couponCode?: string | null;
    userId?: string | null;
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
        categoryId: true,
        collectionId: true,
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
        categoryId: product.categoryId,
        collectionId: product.collectionId,
      };
    });

    subtotal = Number(subtotal.toFixed(2));

    // 4. Evaluate Coupon & Promotion Discount
    let discount = 0;
    let couponTitle: string | undefined;
    let isCouponFreeShipping = false;

    if (params.couponCode) {
      const couponEval = await promotionsEngine.evaluateCoupon({
        code: params.couponCode,
        userId: params.userId,
        items: calculatedItems,
        subtotal,
      });

      discount = couponEval.discountAmount;
      couponTitle = couponEval.coupon.title;
      isCouponFreeShipping = couponEval.freeShipping;
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);

    // 5. Calculate Shipping Charge
    let shipping = 0;
    let selectedShippingMethodName = 'Standard Shipping';

    if (isCouponFreeShipping) {
      shipping = 0;
      selectedShippingMethodName = 'Free Coupon Shipping';
    } else if (params.shippingMethodId) {
      const method = await prisma.shippingMethod.findUnique({
        where: { id: params.shippingMethodId },
      });

      if (method && method.isEnabled) {
        selectedShippingMethodName = method.name;
        const minForFree = method.minOrderForFree ? Number(method.minOrderForFree) : freeShippingThreshold;
        if (discountedSubtotal >= minForFree) {
          shipping = 0;
        } else {
          shipping = Number(method.basePrice);
        }
      } else {
        shipping = discountedSubtotal >= freeShippingThreshold ? 0 : standardShippingCharge;
      }
    } else {
      shipping = discountedSubtotal >= freeShippingThreshold ? 0 : standardShippingCharge;
    }

    shipping = Number(shipping.toFixed(2));

    // 6. Calculate GST Tax on discounted subtotal
    let tax = 0;
    if (gstPercent > 0) {
      if (gstMode === 'exclusive') {
        tax = Number(((discountedSubtotal * gstPercent) / 100).toFixed(2));
      } else {
        tax = Number((discountedSubtotal - discountedSubtotal / (1 + gstPercent / 100)).toFixed(2));
      }
    }

    // 7. Calculate COD Fee
    const codFee = params.paymentMethod === 'COD' ? Number(codExtraCharge.toFixed(2)) : 0;

    // 8. Calculate Grand Total
    const grandTotal = Number(
      (gstMode === 'exclusive'
        ? discountedSubtotal + shipping + tax + codFee
        : discountedSubtotal + shipping + codFee
      ).toFixed(2)
    );

    return {
      items: calculatedItems,
      subtotal,
      discount,
      couponCode: params.couponCode || null,
      couponTitle: couponTitle || null,
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

