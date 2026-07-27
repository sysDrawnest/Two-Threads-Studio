/**
 * Phase 7.4 Payment Routes
 */

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { paymentController } from './payment.controller';

const router = Router();

// Public config endpoint
router.get('/config', paymentController.getConfig);

// Authenticated user checkout endpoints
router.post('/orders/:orderId/razorpay-order', requireAuth, paymentController.createRazorpayOrder);
router.post('/orders/:orderId/verify', requireAuth, paymentController.verifyPayment);

// Admin-only endpoints
router.post('/reconcile', requireAuth, requireRole(Role.ADMIN), paymentController.reconcilePayments);
router.get('/analytics', requireAuth, requireRole(Role.ADMIN), paymentController.getAnalytics);

export default router;
