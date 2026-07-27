/**
 * Public Coupon Controller — Phase 7.2
 * Endpoints for applying, removing, and validating coupons for customers.
 */

import { Request, Response, NextFunction } from 'express';
import { checkoutService } from '../services/checkout.service';
import { promotionsEngine } from '../engines/PromotionsEngine';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import prisma from '../prisma';

export const couponController = {
  /**
   * POST /api/v1/coupons/apply
   * Apply coupon to active checkout session.
   */
  applyCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;
      const sessionToken = (req.body?.sessionToken || req.headers['x-session-token']) as string;

      const result = await checkoutService.applyCoupon(sessionToken, code);
      return successResponse(res, result, `Coupon "${code.toUpperCase()}" applied successfully`);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/coupons/remove
   * Remove applied coupon from checkout session.
   */
  removeCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = (req.body?.sessionToken || req.headers['x-session-token']) as string;

      const result = await checkoutService.removeCoupon(sessionToken);
      return successResponse(res, result, 'Coupon removed');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/coupons/validate
   * Check if a coupon is valid without binding to a session.
   */
  validateCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;
      const userId = req.user?.id;

      await promotionsEngine.ensureDefaultCoupons();

      const coupon = await prisma.coupon.findFirst({
        where: { code: code.trim().toUpperCase(), isActive: true, deletedAt: null },
      });

      if (!coupon) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: `Coupon "${code}" is invalid or expired.`,
        });
      }

      return successResponse(res, { coupon }, 'Coupon is valid');
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/coupons/available
   * List available active promotions/coupons for storefront display.
   */
  getAvailableCoupons: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await promotionsEngine.ensureDefaultCoupons();

      const now = new Date();
      const coupons = await prisma.coupon.findMany({
        where: {
          isActive: true,
          deletedAt: null,
          startDate: { lte: now },
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
        select: {
          id: true,
          code: true,
          title: true,
          description: true,
          type: true,
          discountValue: true,
          maxDiscountAmount: true,
          minCartSubtotal: true,
          endDate: true,
        },
      });

      return successResponse(res, { coupons }, 'Available coupons retrieved');
    } catch (err) {
      next(err);
    }
  },
};
