/**
 * Review Controller — Phase 6A
 * Admin review moderation: approve → isVerified=true, reject → hidden from storefront
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';

export const reviewController = {
  // ── List reviews (paginated, filterable by status) ────────────────────────
  listReviews: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
      const limit = Math.min(50, parseInt(req.query['limit'] as string) || 20);
      const isVerified = req.query['isVerified'] as string | undefined;
      const search = (req.query['search'] as string) || '';
      const minRating = parseInt(req.query['minRating'] as string) || undefined;
      const maxRating = parseInt(req.query['maxRating'] as string) || undefined;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (isVerified !== undefined) where.isVerified = isVerified === 'true';
      if (minRating !== undefined) where.rating = { ...where.rating, gte: minRating };
      if (maxRating !== undefined) where.rating = { ...where.rating, lte: maxRating };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { comment: { contains: search, mode: 'insensitive' } },
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
        ];
      }

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
            },
            product: {
              select: { id: true, name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        }),
        prisma.review.count({ where }),
      ]);

      // Summary counts
      const [pendingCount, approvedCount] = await Promise.all([
        prisma.review.count({ where: { isVerified: false } }),
        prisma.review.count({ where: { isVerified: true } }),
      ]);

      return successResponse(res, {
        reviews,
        summary: { pending: pendingCount, approved: approvedCount },
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  },

  // ── Approve review ────────────────────────────────────────────────────────
  approveReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params['reviewId'] as string;

      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);

      const updated = await prisma.review.update({
        where: { id: reviewId },
        data: { isVerified: true },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
      });

      return successResponse(res, updated, 'Review approved and published');
    } catch (err) {
      next(err);
    }
  },

  // ── Reject review (hides from storefront) ─────────────────────────────────
  rejectReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params['reviewId'] as string;

      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);

      // Rejection = set isVerified false (storefront only shows verified reviews)
      const updated = await prisma.review.update({
        where: { id: reviewId },
        data: { isVerified: false },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
      });

      return successResponse(res, updated, 'Review rejected and hidden from storefront');
    } catch (err) {
      next(err);
    }
  },

  // ── Delete review ─────────────────────────────────────────────────────────
  deleteReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params['reviewId'] as string;

      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);

      await prisma.review.delete({ where: { id: reviewId } });

      return successResponse(res, { id: reviewId }, 'Review permanently deleted');
    } catch (err) {
      next(err);
    }
  },
};
