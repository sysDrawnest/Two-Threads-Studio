/**
 * Risk Controller — Phase 5C
 * Customer-facing: COD eligibility check, OTP, PIN lookup
 */

import { Request, Response, NextFunction } from 'express';
import { riskService } from '../services/risk.service';
import { otpService } from '../services/otp.service';
import { returnPolicyRepository } from '../repositories/return-policy.repository';
import { reviewQueueRepository } from '../repositories/review-queue.repository';
import { customerRiskRepository } from '../repositories/customer-risk.repository';
import { validatePinCode } from '../utils/pinValidator';
import { fraudFlagRepository } from '../repositories/fraud-flag.repository';
import { OtpPurpose, ReturnEligibility } from '@prisma/client';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { AppError } from '../utils/AppError';

export const riskController = {
  // ── Customer: COD eligibility ─────────────────────────────────────────────
  getCodEligibility: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderTotal = parseFloat(req.query['orderTotal'] as string || '0');
      const productIds = (req.query['productIds'] as string || '').split(',').filter(Boolean);

      const result = await riskService.getCodEligibility(req.user!.id, orderTotal, productIds);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  // ── Customer: Send OTP ────────────────────────────────────────────────────
  sendOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipient, purpose } = req.body;
      const result = await otpService.send(req.user!.id, recipient, purpose as OtpPurpose);
      return successResponse(res, result, 'OTP sent successfully');
    } catch (err) {
      next(err);
    }
  },

  // ── Customer: Verify OTP ──────────────────────────────────────────────────
  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipient, purpose, otp } = req.body;
      const result = await otpService.verify(req.user!.id, recipient, purpose as OtpPurpose, otp);

      if (!result.verified) {
        throw new AppError(result.reason || 'OTP verification failed', HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, { verified: true }, 'Phone verified successfully');
    } catch (err) {
      next(err);
    }
  },

  // ── Customer: PIN lookup (auto-fill) ──────────────────────────────────────
  lookupPin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pin = req.query['pin'] as string;
      const state = req.query['state'] as string | undefined;
      const city = req.query['city'] as string | undefined;

      const result = await validatePinCode(pin, city, state);

      // Always 200 — caller decides how to use the data
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  // ── Admin: Dashboard summary ──────────────────────────────────────────────
  getDashboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await riskService.getDashboardSummary();
      return successResponse(res, summary);
    } catch (err) {
      next(err);
    }
  },

  // ── Admin: List customer risk profiles ────────────────────────────────────
  listCustomerRisk: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isBlocked, minTrustScore, maxTrustScore, page, limit } = req.query as any;
      const result = await customerRiskRepository.list(
        {
          isBlocked: isBlocked !== undefined ? isBlocked === 'true' : undefined,
          minTrustScore: minTrustScore ? Number(minTrustScore) : undefined,
          maxTrustScore: maxTrustScore ? Number(maxTrustScore) : undefined,
        },
        Number(page) || 1,
        Number(limit) || 20
      );
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  // ── Admin: Block/unblock customer ─────────────────────────────────────────
  blockCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { isBlocked, blockReason } = req.body;
      const result = await customerRiskRepository.setBlocked(userId as string, isBlocked, blockReason);
      return successResponse(res, result, isBlocked ? 'Customer blocked' : 'Customer unblocked');
    } catch (err) {
      next(err);
    }
  },

  // ── Admin: Update admin notes ─────────────────────────────────────────────
  updateAdminNotes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { notes } = req.body;
      const result = await customerRiskRepository.updateAdminNotes(userId as string, notes);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  // ── Admin: Review queue ───────────────────────────────────────────────────
  listReviewQueue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, page, limit } = req.query as any;
      const result = await reviewQueueRepository.list(status, Number(page) || 1, Number(limit) || 20);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  approveOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { note } = req.body;
      const result = await reviewQueueRepository.approve(orderId as string, req.user!.id, note);
      return successResponse(res, result, 'Order approved for fulfillment');
    } catch (err) {
      next(err);
    }
  },

  rejectOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { note } = req.body;
      if (!note) throw new AppError('Rejection note is required', HTTP_STATUS.BAD_REQUEST);
      const result = await reviewQueueRepository.reject(orderId as string, req.user!.id, note);
      return successResponse(res, result, 'Order rejected');
    } catch (err) {
      next(err);
    }
  },

  // ── Admin: Fraud flags ────────────────────────────────────────────────────
  listFraudFlags: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query as any;
      const result = await fraudFlagRepository.listUnresolved(Number(page) || 1, Number(limit) || 20);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  resolveFraudFlag: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { flagId } = req.params;
      const result = await fraudFlagRepository.resolve(flagId as string, req.user!.id);
      return successResponse(res, result, 'Flag resolved');
    } catch (err) {
      next(err);
    }
  },

  // ── Admin: Return policies ────────────────────────────────────────────────
  upsertReturnPolicy: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { eligibility, windowDays, reason } = req.body;
      const result = await returnPolicyRepository.upsert({
        productId: productId as string,
        eligibility: eligibility as ReturnEligibility,
        windowDays,
        reason,
      });
      return successResponse(res, result, 'Return policy saved');
    } catch (err) {
      next(err);
    }
  },

  checkReturnEligibility: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { orderCreatedAt } = req.query as any;

      const eligibility = await returnPolicyRepository.checkEligibility(
        productId as string,
        new Date(orderCreatedAt)
      );
      return successResponse(res, eligibility);
    } catch (err) {
      next(err);
    }
  },
};
