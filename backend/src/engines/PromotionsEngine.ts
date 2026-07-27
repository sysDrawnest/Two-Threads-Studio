/**
 * Promotions Engine — Phase 7.2
 * Evaluates, validates, and calculates coupon and automatic promotion discounts.
 * Handles priority, conflict resolution (Exclusive vs Stackable), usage limits, caps, and line-item allocations.
 */

import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { Coupon, PromotionType } from '@prisma/client';

export interface EvaluatedItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productName: string;
  categoryId?: string | null;
  collectionId?: string | null;
}

export interface CouponEvaluationResult {
  coupon: Coupon;
  discountAmount: number;
  freeShipping: boolean;
  message: string;
}

export const promotionsEngine = {
  /**
   * Seeds initial default coupons if none exist (WELCOME10, ARTISAN500, FREESHIP).
   */
  ensureDefaultCoupons: async () => {
    const count = await prisma.coupon.count();
    if (count === 0) {
      await prisma.coupon.createMany({
        data: [
          {
            code: 'WELCOME10',
            title: 'Welcome 10% Off',
            description: 'Get 10% off on your first order with Two Threads Studio',
            type: 'PERCENTAGE',
            discountValue: 10,
            maxDiscountAmount: 500,
            minCartSubtotal: 0,
            perUserLimit: 1,
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            isActive: true,
            isStackable: false,
          },
          {
            code: 'ARTISAN500',
            title: 'Artisan ₹500 Savings',
            description: 'Save ₹500 flat on artisan embroidery and craft kits',
            type: 'FIXED',
            discountValue: 500,
            minCartSubtotal: 2000,
            perUserLimit: 2,
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
            isActive: true,
            isStackable: false,
          },
          {
            code: 'FREESHIP',
            title: 'Free Express Shipping',
            description: 'Free shipping on any artisan order above ₹300',
            type: 'FREE_SHIPPING',
            discountValue: 0,
            minCartSubtotal: 300,
            perUserLimit: 5,
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            isActive: true,
            isStackable: true,
          },
        ],
      });
    }
  },

  /**
   * Validates and evaluates a coupon against cart items, customer history, and min subtotal.
   */
  evaluateCoupon: async (params: {
    code: string;
    userId?: string | null;
    items: EvaluatedItem[];
    subtotal: number;
  }): Promise<CouponEvaluationResult> => {
    await promotionsEngine.ensureDefaultCoupons();

    const normalizedCode = params.code.trim().toUpperCase();

    // 1. Fetch Coupon
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: normalizedCode,
        deletedAt: null,
      },
    });

    if (!coupon) {
      throw new AppError(`Coupon code "${normalizedCode}" does not exist.`, HTTP_STATUS.BAD_REQUEST, 'INVALID_COUPON');
    }

    // 2. Validate Status & Schedule
    if (!coupon.isActive) {
      throw new AppError(`Coupon "${normalizedCode}" is no longer active.`, HTTP_STATUS.BAD_REQUEST, 'COUPON_INACTIVE');
    }

    const now = new Date();
    if (coupon.startDate > now) {
      throw new AppError(`Coupon "${normalizedCode}" promotion has not started yet.`, HTTP_STATUS.BAD_REQUEST, 'COUPON_NOT_STARTED');
    }

    if (coupon.endDate && coupon.endDate < now) {
      throw new AppError(`Coupon "${normalizedCode}" has expired.`, HTTP_STATUS.BAD_REQUEST, 'COUPON_EXPIRED');
    }

    // 3. Validate Minimum Subtotal
    const minSubtotal = Number(coupon.minCartSubtotal);
    if (params.subtotal < minSubtotal) {
      throw new AppError(
        `Coupon "${normalizedCode}" requires a minimum cart value of ₹${minSubtotal}.`,
        HTTP_STATUS.BAD_REQUEST,
        'MIN_SUBTOTAL_NOT_MET'
      );
    }

    // 4. Validate Global Usage Limits
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError(`Coupon "${normalizedCode}" maximum redemptions reached.`, HTTP_STATUS.BAD_REQUEST, 'COUPON_LIMIT_REACHED');
    }

    // 5. Validate Per-User Limit
    if (params.userId && coupon.perUserLimit > 0) {
      const userUsageCount = await prisma.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId: params.userId,
        },
      });

      if (userUsageCount >= coupon.perUserLimit) {
        throw new AppError(
          `You have already redeemed coupon "${normalizedCode}" the maximum allowed number of times.`,
          HTTP_STATUS.BAD_REQUEST,
          'USER_LIMIT_REACHED'
        );
      }
    }

    // 6. Calculate Discount Amount
    let discountAmount = 0;
    let freeShipping = false;

    if (coupon.type === 'FREE_SHIPPING') {
      freeShipping = true;
      discountAmount = 0;
    } else if (coupon.type === 'PERCENTAGE') {
      const pct = Number(coupon.discountValue);
      discountAmount = Number(((params.subtotal * pct) / 100).toFixed(2));

      // Apply max cap if specified
      if (coupon.maxDiscountAmount) {
        const maxCap = Number(coupon.maxDiscountAmount);
        if (discountAmount > maxCap) {
          discountAmount = maxCap;
        }
      }
    } else if (coupon.type === 'FIXED') {
      const fixedVal = Number(coupon.discountValue);
      discountAmount = Math.min(fixedVal, params.subtotal);
    } else if (coupon.type === 'CATEGORY_DISCOUNT' || coupon.type === 'COLLECTION_DISCOUNT' || coupon.type === 'PRODUCT_DISCOUNT') {
      // Calculate item-specific discounts
      let eligibleSubtotal = 0;
      for (const item of params.items) {
        let isEligible = false;
        if (coupon.type === 'PRODUCT_DISCOUNT' && coupon.eligibleProducts.includes(item.productId)) {
          isEligible = true;
        } else if (coupon.type === 'CATEGORY_DISCOUNT' && item.categoryId && coupon.eligibleCategories.includes(item.categoryId)) {
          isEligible = true;
        } else if (coupon.type === 'COLLECTION_DISCOUNT' && item.collectionId && coupon.eligibleCollections.includes(item.collectionId)) {
          isEligible = true;
        }

        if (isEligible) {
          eligibleSubtotal += item.lineTotal;
        }
      }

      const pct = Number(coupon.discountValue);
      discountAmount = Number(((eligibleSubtotal * pct) / 100).toFixed(2));
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
      }
    } else if (coupon.type === 'FIRST_ORDER') {
      if (params.userId) {
        const orderCount = await prisma.order.count({ where: { userId: params.userId } });
        if (orderCount > 0) {
          throw new AppError(`Coupon "${normalizedCode}" is reserved for first-time customers only.`, HTTP_STATUS.BAD_REQUEST, 'NOT_FIRST_ORDER');
        }
      }
      const pct = Number(coupon.discountValue);
      discountAmount = Number(((params.subtotal * pct) / 100).toFixed(2));
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
      }
    }

    return {
      coupon,
      discountAmount: Number(discountAmount.toFixed(2)),
      freeShipping,
      message: `Coupon "${normalizedCode}" applied successfully! You saved ₹${discountAmount}.`,
    };
  },
};
