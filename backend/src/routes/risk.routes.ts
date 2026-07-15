/**
 * Risk Routes — Phase 5C
 * Customer: COD eligibility, OTP send/verify, PIN lookup
 * Admin: Dashboard, review queue, fraud flags, return policies
 */

import { Router } from 'express';
import { riskController } from '../controllers/risk.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  codEligibilitySchema,
  sendOtpSchema,
  verifyOtpSchema,
  adminBlockSchema,
  adminNotesSchema,
  reviewQueueActionSchema,
  returnPolicySchema,
  pinLookupSchema,
} from '../validators/risk.validator';
import { Role } from '@prisma/client';

const router = Router();

// ── Customer routes ───────────────────────────────────────────────────────────

// COD eligibility check (called from payment step in checkout)
router.get(
  '/cod-eligibility',
  requireAuth,
  validate(codEligibilitySchema),
  riskController.getCodEligibility
);

// OTP: send
router.post('/otp/send', requireAuth, validate(sendOtpSchema), riskController.sendOtp);

// OTP: verify
router.post('/otp/verify', requireAuth, validate(verifyOtpSchema), riskController.verifyOtp);

// PIN code lookup for address auto-fill (no auth required — public utility)
router.get('/pin-lookup', validate(pinLookupSchema), riskController.lookupPin);

// ── Admin routes ──────────────────────────────────────────────────────────────

const adminRouter = Router();
adminRouter.use(requireAuth, requireRole(Role.ADMIN));

// Dashboard KPIs
adminRouter.get('/dashboard', riskController.getDashboard);

// Customer risk management
adminRouter.get('/customers', riskController.listCustomerRisk);
adminRouter.patch('/customers/:userId/block', validate(adminBlockSchema), riskController.blockCustomer);
adminRouter.patch('/customers/:userId/notes', validate(adminNotesSchema), riskController.updateAdminNotes);

// Manual review queue
adminRouter.get('/review-queue', riskController.listReviewQueue);
adminRouter.post('/review-queue/:orderId/approve', validate(reviewQueueActionSchema), riskController.approveOrder);
adminRouter.post('/review-queue/:orderId/reject', validate(reviewQueueActionSchema), riskController.rejectOrder);

// Fraud flags
adminRouter.get('/fraud-flags', riskController.listFraudFlags);
adminRouter.patch('/fraud-flags/:flagId/resolve', riskController.resolveFraudFlag);

// Return policies
adminRouter.put('/return-policies/:productId', validate(returnPolicySchema), riskController.upsertReturnPolicy);
adminRouter.get('/return-policies/:productId', riskController.checkReturnEligibility);

export { router as riskRoutes, adminRouter as adminRiskRoutes };
