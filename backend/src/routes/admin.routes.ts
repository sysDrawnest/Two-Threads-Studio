/**
 * Admin Routes — Phase 6A
 * Consolidated admin router. All routes require auth + ADMIN role.
 */

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { adminController } from '../controllers/admin.controller';
import { analyticsController } from '../controllers/analytics.controller';
import { inventoryController } from '../controllers/inventory.controller';
import { reviewController } from '../controllers/review.controller';
import { settingsController } from '../controllers/settings.controller';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(requireAuth, requireRole(Role.ADMIN));

// ── Dashboard ──────────────────────────────────────────────────────────────
router.get('/dashboard', adminController.getDashboard);

// ── Customer Management ────────────────────────────────────────────────────
router.get('/customers', adminController.listCustomers);
router.get('/customers/:userId', adminController.getCustomer);
router.patch('/customers/:userId/status', adminController.updateCustomerStatus);

// ── Analytics ─────────────────────────────────────────────────────────────
router.get('/analytics/revenue', analyticsController.getRevenue);
router.get('/analytics/orders', analyticsController.getOrderAnalytics);
router.get('/analytics/products', analyticsController.getTopProducts);
router.get('/analytics/customers', analyticsController.getCustomerGrowth);
router.get('/analytics/categories', analyticsController.getCategoryBreakdown);

// ── Inventory ──────────────────────────────────────────────────────────────
router.get('/inventory', inventoryController.listInventory);
router.patch('/inventory/:productId', inventoryController.adjustStock);

// ── Review Moderation ──────────────────────────────────────────────────────
router.get('/reviews', reviewController.listReviews);
router.patch('/reviews/:reviewId/approve', reviewController.approveReview);
router.patch('/reviews/:reviewId/reject', reviewController.rejectReview);
router.delete('/reviews/:reviewId', reviewController.deleteReview);

// ── Studio Settings ────────────────────────────────────────────────────────
router.get('/settings', settingsController.getSettings);
router.patch('/settings/company', settingsController.updateCompany);
router.patch('/settings/gst', settingsController.updateGst);
router.patch('/settings/shipping', settingsController.updateShipping);
router.patch('/settings/cod', settingsController.updateCod);
router.patch('/settings/returns', settingsController.updateReturnPolicy);
router.patch('/settings/invoice', settingsController.updateInvoice);
router.patch('/settings/contact', settingsController.updateContact);
router.patch('/settings/email-templates', settingsController.updateEmailTemplates);

export default router;
