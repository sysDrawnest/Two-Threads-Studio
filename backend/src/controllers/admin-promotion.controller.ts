/**
 * Admin Promotion Controller — Phase 7.3
 * CRUD operations, cloning, active toggling, and usage analytics for Coupons.
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { PromotionType } from '@prisma/client';

export const adminPromotionController = {
  /**
   * GET /api/v1/admin/coupons
   * List all coupons with paginated search, filter, and sort options.
   */
  listCoupons: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
      const limit = Math.min(50, parseInt(req.query['limit'] as string) || 20);
      const search = (req.query['search'] as string) || '';
      const isActive = req.query['isActive'] as string | undefined;
      const type = req.query['type'] as string | undefined;

      const skip = (page - 1) * limit;

      const where: any = { deletedAt: null };

      if (search) {
        where.OR = [
          { code: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      if (type) {
        where.type = type as PromotionType;
      }

      const [coupons, total] = await Promise.all([
        prisma.coupon.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.coupon.count({ where }),
      ]);

      return successResponse(res, {
        coupons,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/admin/coupons/:id
   * Retrieve details of a coupon along with conversion & usage details.
   */
  getCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const coupon = await prisma.coupon.findFirst({
        where: { id, deletedAt: null },
        include: {
          usages: {
            take: 10,
            orderBy: { usedAt: 'desc' },
          },
        },
      });

      if (!coupon) {
        throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND);
      }

      const usageStats = await prisma.couponUsage.aggregate({
        where: { couponId: id },
        _count: { _all: true },
        _sum: { discountAmount: true },
      });

      return successResponse(res, {
        coupon,
        stats: {
          totalRedemptions: usageStats._count?._all || 0,
          totalDiscountValue: Number(usageStats._sum?.discountAmount || 0),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/admin/coupons
   * Create a new coupon.
   */
  createCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const codeInput = (req.body.code as string).trim().toUpperCase();

      const existing = await prisma.coupon.findFirst({
        where: { code: codeInput, deletedAt: null },
      });

      if (existing) {
        throw new AppError(
          `Coupon with code "${codeInput}" already exists.`,
          HTTP_STATUS.CONFLICT,
          'COUPON_EXISTS'
        );
      }

      const coupon = await prisma.coupon.create({
        data: {
          code: codeInput,
          title: req.body.title,
          description: req.body.description || null,
          type: req.body.type as PromotionType,
          discountValue: req.body.discountValue,
          maxDiscountAmount: req.body.maxDiscountAmount || null,
          minCartSubtotal: req.body.minCartSubtotal || 0,
          usageLimit: req.body.usageLimit || null,
          perUserLimit: req.body.perUserLimit || 1,
          startDate: req.body.startDate,
          endDate: req.body.endDate || null,
          isStackable: req.body.isStackable ?? false,
          isExclusive: req.body.isExclusive ?? false,
          isActive: req.body.isActive ?? true,
          eligibleCategories: req.body.eligibleCategories || [],
          eligibleCollections: req.body.eligibleCollections || [],
          eligibleProducts: req.body.eligibleProducts || [],
          eligibleCustomerTiers: req.body.eligibleCustomerTiers || [],
        },
      });

      return successResponse(res, { coupon }, 'Coupon created successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/v1/admin/coupons/:id
   * Update coupon parameters.
   */
  updateCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const coupon = await prisma.coupon.findFirst({
        where: { id, deletedAt: null },
      });

      if (!coupon) {
        throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND);
      }

      const updated = await prisma.coupon.update({
        where: { id },
        data: {
          title: req.body.title,
          description: req.body.description,
          type: req.body.type as PromotionType,
          discountValue: req.body.discountValue,
          maxDiscountAmount: req.body.maxDiscountAmount,
          minCartSubtotal: req.body.minCartSubtotal,
          usageLimit: req.body.usageLimit,
          perUserLimit: req.body.perUserLimit,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          isStackable: req.body.isStackable,
          isExclusive: req.body.isExclusive,
          isActive: req.body.isActive,
          eligibleCategories: req.body.eligibleCategories,
          eligibleCollections: req.body.eligibleCollections,
          eligibleProducts: req.body.eligibleProducts,
          eligibleCustomerTiers: req.body.eligibleCustomerTiers,
        },
      });

      return successResponse(res, { coupon: updated }, 'Coupon updated successfully');
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/v1/admin/coupons/:id
   * Soft-deletes a coupon.
   */
  deleteCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const coupon = await prisma.coupon.findFirst({
        where: { id, deletedAt: null },
      });

      if (!coupon) {
        throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND);
      }

      await prisma.coupon.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return successResponse(res, { id }, 'Coupon soft-deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/admin/coupons/:id/clone
   * Clone a coupon with a randomized or prefixed coupon code.
   */
  cloneCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const original = await prisma.coupon.findFirst({
        where: { id, deletedAt: null },
      });

      if (!original) {
        throw new AppError('Coupon not found to clone', HTTP_STATUS.NOT_FOUND);
      }

      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `CLONE_${original.code}_${randomSuffix}`;

      const clone = await prisma.coupon.create({
        data: {
          code,
          title: `Copy of ${original.title}`,
          description: original.description,
          type: original.type,
          discountValue: original.discountValue,
          maxDiscountAmount: original.maxDiscountAmount,
          minCartSubtotal: original.minCartSubtotal,
          usageLimit: original.usageLimit,
          perUserLimit: original.perUserLimit,
          startDate: new Date(),
          endDate: original.endDate,
          isStackable: original.isStackable,
          isExclusive: original.isExclusive,
          isActive: false, // Clone starts inactive
          eligibleCategories: original.eligibleCategories,
          eligibleCollections: original.eligibleCollections,
          eligibleProducts: original.eligibleProducts,
          eligibleCustomerTiers: original.eligibleCustomerTiers,
        },
      });

      return successResponse(res, { coupon: clone }, 'Coupon cloned successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/v1/admin/coupons/:id/toggle
   * Toggle the active status of a coupon.
   */
  toggleCouponActive: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const coupon = await prisma.coupon.findFirst({
        where: { id, deletedAt: null },
      });

      if (!coupon) {
        throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND);
      }

      const updated = await prisma.coupon.update({
        where: { id },
        data: { isActive: !coupon.isActive },
      });

      return successResponse(res, { coupon: updated }, `Coupon ${updated.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/admin/coupons/analytics/summary
   * Retrieve total discounts applied, active campaigns, and total influenced revenue.
   */
  getPromotionAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const now = new Date();

      const [
        totalActiveCoupons,
        totalRedemptions,
        totalDiscounts,
        influencedOrders,
      ] = await Promise.all([
        prisma.coupon.count({
          where: {
            isActive: true,
            deletedAt: null,
            startDate: { lte: now },
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
        }),
        prisma.couponUsage.count(),
        prisma.couponUsage.aggregate({
          _sum: { discountAmount: true },
        }),
        prisma.order.aggregate({
          where: { couponCode: { not: null } },
          _sum: { grandTotal: true },
          _count: { id: true },
        }),
      ]);

      return successResponse(res, {
        activeCoupons: totalActiveCoupons,
        totalRedemptions,
        totalDiscountValue: Number(totalDiscounts._sum?.discountAmount || 0),
        influencedOrdersCount: influencedOrders._count?.id || 0,
        influencedRevenue: Number(influencedOrders._sum?.grandTotal || 0),
      }, 'Coupon analytics summary retrieved');
    } catch (err) {
      next(err);
    }
  },
};
