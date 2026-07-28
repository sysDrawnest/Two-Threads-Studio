/**
 * Review Controller
 * Handles verified post-delivery product reviews, helpful voting, and admin moderation actions.
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ReviewStatus, ReviewMediaType } from '@prisma/client';

export const reviewController = {
  // ── List reviews (Admin, paginated, filterable) ──────────────────────────
  listReviews: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
      const limit = Math.min(50, parseInt(req.query['limit'] as string) || 20);
      const status = req.query['status'] as string | undefined;
      const search = (req.query['search'] as string) || '';
      const minRating = parseInt(req.query['minRating'] as string) || undefined;
      const maxRating = parseInt(req.query['maxRating'] as string) || undefined;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (status) {
        where.status = status as ReviewStatus;
      }
      if (minRating !== undefined) where.rating = { ...where.rating, gte: minRating };
      if (maxRating !== undefined) where.rating = { ...where.rating, lte: maxRating };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { comment: { contains: search, mode: 'insensitive' } },
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
          { product: { name: { contains: search, mode: 'insensitive' } } },
        ];
      }

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          skip,
          take: limit,
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
            },
            product: {
              select: { id: true, name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } },
            },
            media: true,
          },
        }),
        prisma.review.count({ where }),
      ]);

      // Summary counts
      const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
        prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
        prisma.review.count({ where: { status: ReviewStatus.APPROVED } }),
        prisma.review.count({ where: { status: ReviewStatus.REJECTED } }),
      ]);

      return successResponse(res, {
        reviews,
        summary: { pending: pendingCount, approved: approvedCount, rejected: rejectedCount },
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  },

  // ── Create or Update Review (User, Post-Delivery Validation) ─────────────
  createOrUpdateReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const {
        productId,
        rating,
        title,
        comment,
        qualityRating,
        packagingRating,
        valueRating,
        easeOfUseRating,
        wouldRecommend,
        images = [],
        videoUrl = '',
      } = req.body;

      if (!productId || !rating || rating < 1 || rating > 5 || !comment) {
        throw new AppError('Rating (1-5), product ID, and comment are required', HTTP_STATUS.BAD_REQUEST);
      }

      // Verify User has a DELIVERED order containing this product
      const deliveredOrders = await prisma.order.findMany({
        where: {
          userId,
          orderStatus: 'DELIVERED',
          items: {
            some: { productId },
          },
        },
        select: { id: true },
      });

      if (deliveredOrders.length === 0) {
        throw new AppError('You can only review products that have been delivered to you.', HTTP_STATUS.FORBIDDEN);
      }

      const orderId = deliveredOrders[0].id;

      // Upsert Review
      const result = await prisma.$transaction(async (tx) => {
        // Find existing review
        const existingReview = await tx.review.findUnique({
          where: {
            productId_userId: { productId, userId },
          },
        });

        let review;
        if (existingReview) {
          // Update review (Reset status to PENDING for moderation re-check)
          review = await tx.review.update({
            where: { id: existingReview.id },
            data: {
              rating: parseInt(rating),
              title,
              comment,
              qualityRating: qualityRating ? parseInt(qualityRating) : null,
              packagingRating: packagingRating ? parseInt(packagingRating) : null,
              valueRating: valueRating ? parseInt(valueRating) : null,
              easeOfUseRating: easeOfUseRating ? parseInt(easeOfUseRating) : null,
              wouldRecommend: wouldRecommend === true || wouldRecommend === 'true',
              status: ReviewStatus.PENDING,
              orderId,
            },
          });

          // Delete old media
          await tx.reviewMedia.deleteMany({
            where: { reviewId: review.id },
          });
        } else {
          // Create new review
          review = await tx.review.create({
            data: {
              productId,
              userId,
              orderId,
              rating: parseInt(rating),
              title,
              comment,
              qualityRating: qualityRating ? parseInt(qualityRating) : null,
              packagingRating: packagingRating ? parseInt(packagingRating) : null,
              valueRating: valueRating ? parseInt(valueRating) : null,
              easeOfUseRating: easeOfUseRating ? parseInt(easeOfUseRating) : null,
              wouldRecommend: wouldRecommend === true || wouldRecommend === 'true',
              status: ReviewStatus.PENDING,
            },
          });
        }

        // Add media attachments if provided
        const mediaData = [];
        if (Array.isArray(images)) {
          for (const imgUrl of images) {
            if (imgUrl) {
              mediaData.push({
                reviewId: review.id,
                type: ReviewMediaType.IMAGE,
                url: imgUrl,
              });
            }
          }
        }
        if (videoUrl) {
          mediaData.push({
            reviewId: review.id,
            type: ReviewMediaType.VIDEO,
            url: videoUrl,
          });
        }

        if (mediaData.length > 0) {
          await tx.reviewMedia.createMany({
            data: mediaData,
          });
        }

        return review;
      });

      return successResponse(res, result, 'Review submitted for moderation successfully');
    } catch (err) {
      next(err);
    }
  },

  // ── Get Public Reviews for Product ───────────────────────────────────────
  getProductReviews: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params['productId'] as string;
      const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
      const limit = Math.min(50, parseInt(req.query['limit'] as string) || 10);
      const filterMedia = req.query['hasMedia'] === 'true';
      const sort = req.query['sort'] as string || 'helpful'; // helpful, newest, highest, lowest

      const skip = (page - 1) * limit;

      const where: any = {
        productId,
        status: ReviewStatus.APPROVED,
      };

      if (filterMedia) {
        where.media = { some: {} };
      }

      let orderBy: any = { helpfulCount: 'desc' };
      if (sort === 'newest') orderBy = { createdAt: 'desc' };
      if (sort === 'highest') orderBy = { rating: 'desc' };
      if (sort === 'lowest') orderBy = { rating: 'asc' };

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            { isPinned: 'desc' },
            orderBy,
          ],
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true },
            },
            media: true,
          },
        }),
        prisma.review.count({ where }),
      ]);

      // Calculate rating breakdown and average stats
      const allApprovedReviews = await prisma.review.findMany({
        where: { productId, status: ReviewStatus.APPROVED },
        select: {
          rating: true,
          qualityRating: true,
          packagingRating: true,
          valueRating: true,
          easeOfUseRating: true,
          wouldRecommend: true,
        },
      });

      const totalApproved = allApprovedReviews.length;
      const ratingsCount = [0, 0, 0, 0, 0]; // 1 to 5 star counts
      let sumRating = 0;
      let sumQuality = 0; let countQuality = 0;
      let sumPackaging = 0; let countPackaging = 0;
      let sumValue = 0; let countValue = 0;
      let sumEase = 0; let countEase = 0;
      let recommendCount = 0;

      allApprovedReviews.forEach((r) => {
        sumRating += r.rating;
        if (r.rating >= 1 && r.rating <= 5) {
          ratingsCount[r.rating - 1]++;
        }
        if (r.qualityRating) { sumQuality += r.qualityRating; countQuality++; }
        if (r.packagingRating) { sumPackaging += r.packagingRating; countPackaging++; }
        if (r.valueRating) { sumValue += r.valueRating; countValue++; }
        if (r.easeOfUseRating) { sumEase += r.easeOfUseRating; countEase++; }
        if (r.wouldRecommend) recommendCount++;
      });

      const averageRating = totalApproved > 0 ? Number((sumRating / totalApproved).toFixed(1)) : 0;
      const recommendPercentage = totalApproved > 0 ? Math.round((recommendCount / totalApproved) * 100) : 0;

      // Extract all media files for gallery
      const mediaGallery = await prisma.reviewMedia.findMany({
        where: {
          review: {
            productId,
            status: ReviewStatus.APPROVED,
          },
        },
        take: 30,
        orderBy: { createdAt: 'desc' },
      });

      return successResponse(res, {
        reviews,
        summary: {
          totalReviews: totalApproved,
          averageRating,
          recommendPercentage,
          ratingDistribution: ratingsCount.map((count, index) => ({
            stars: index + 1,
            count,
            percentage: totalApproved > 0 ? Math.round((count / totalApproved) * 100) : 0,
          })).reverse(),
          attributes: {
            quality: countQuality > 0 ? Number((sumQuality / countQuality).toFixed(1)) : null,
            packaging: countPackaging > 0 ? Number((sumPackaging / countPackaging).toFixed(1)) : null,
            value: countValue > 0 ? Number((sumValue / countValue).toFixed(1)) : null,
            easeOfUse: countEase > 0 ? Number((sumEase / countEase).toFixed(1)) : null,
          },
        },
        mediaGallery,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  },

  // ── Helpful Vote Toggle (User) ──────────────────────────────────────────
  voteHelpful: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const reviewId = req.params['reviewId'] as string;
      const { isHelpful } = req.body; // true = helpful, false = unhelpful

      if (isHelpful === undefined) {
        throw new AppError('isHelpful value (true/false) is required', HTTP_STATUS.BAD_REQUEST);
      }

      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });
      if (!review) throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);

      await prisma.$transaction(async (tx) => {
        const existingVote = await tx.reviewHelpfulVote.findUnique({
          where: {
            reviewId_userId: { reviewId, userId },
          },
        });

        if (existingVote) {
          if (existingVote.isHelpful === isHelpful) {
            // Toggle off vote entirely
            await tx.reviewHelpfulVote.delete({
              where: { id: existingVote.id },
            });
            await tx.review.update({
              where: { id: reviewId },
              data: {
                helpfulCount: isHelpful ? { decrement: 1 } : undefined,
                unhelpfulCount: !isHelpful ? { decrement: 1 } : undefined,
              },
            });
          } else {
            // Swap vote type
            await tx.reviewHelpfulVote.update({
              where: { id: existingVote.id },
              data: { isHelpful },
            });
            await tx.review.update({
              where: { id: reviewId },
              data: {
                helpfulCount: isHelpful ? { increment: 1 } : { decrement: 1 },
                unhelpfulCount: !isHelpful ? { increment: 1 } : { decrement: 1 },
              },
            });
          }
        } else {
          // New vote
          await tx.reviewHelpfulVote.create({
            data: { reviewId, userId, isHelpful },
          });
          await tx.review.update({
            where: { id: reviewId },
            data: {
              helpfulCount: isHelpful ? { increment: 1 } : undefined,
              unhelpfulCount: !isHelpful ? { increment: 1 } : undefined,
            },
          });
        }
      });

      const updatedReview = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { helpfulCount: true, unhelpfulCount: true },
      });

      return successResponse(res, updatedReview, 'Vote registered successfully');
    } catch (err) {
      next(err);
    }
  },

  // ── Get My Reviews (User) ────────────────────────────────────────────────
  getMyReviews: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const reviews = await prisma.review.findMany({
        where: { userId },
        include: {
          product: { select: { id: true, name: true, slug: true } },
          media: true,
        },
        orderBy: { updatedAt: 'desc' },
      });

      return successResponse(res, reviews);
    } catch (err) {
      next(err);
    }
  },

  // ── Moderation Actions (Admin) ──────────────────────────────────────────
  moderateReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params['reviewId'] as string;
      const { status, isFeatured, isPinned, rejectionReason } = req.body;

      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);

      const updateData: any = {};
      if (status !== undefined) updateData.status = status as ReviewStatus;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured === true || isFeatured === 'true';
      if (isPinned !== undefined) updateData.isPinned = isPinned === true || isPinned === 'true';
      if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;

      // Set isVerified = true when approved, false otherwise
      if (status === ReviewStatus.APPROVED) {
        updateData.isVerified = true;
      }

      const updated = await prisma.review.update({
        where: { id: reviewId },
        data: updateData,
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
          product: { select: { id: true, name: true, slug: true } },
          media: true,
        },
      });

      return successResponse(res, updated, `Review moderated successfully: ${status || 'settings updated'}`);
    } catch (err) {
      next(err);
    }
  },

  // ── Approve Review (Admin Fallback) ──────────────────────────────────────
  approveReview: async (req: Request, res: Response, next: NextFunction) => {
    req.body = { status: ReviewStatus.APPROVED };
    return reviewController.moderateReview(req, res, next);
  },

  // ── Reject Review (Admin Fallback) ──────────────────────────────────────
  rejectReview: async (req: Request, res: Response, next: NextFunction) => {
    req.body = { status: ReviewStatus.REJECTED };
    return reviewController.moderateReview(req, res, next);
  },

  // ── Delete Review (Admin/Owner) ──────────────────────────────────────────
  deleteReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params['reviewId'] as string;

      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);

      // Verify ownership or admin
      if (req.user!.role !== 'ADMIN' && review.userId !== req.user!.id) {
        throw new AppError('Not authorized to delete this review', HTTP_STATUS.FORBIDDEN);
      }

      await prisma.review.delete({ where: { id: reviewId } });

      return successResponse(res, { id: reviewId }, 'Review permanently deleted');
    } catch (err) {
      next(err);
    }
  },
};
