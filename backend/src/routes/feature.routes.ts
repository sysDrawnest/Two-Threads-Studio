/**
 * Feature Flags Routes — Launch Control
 *
 * Public (mounted at /api/v1/features):
 *   GET /               — storefront retrieves public feature flags
 *
 * Admin (mounted at /api/v1/admin/features):
 *   PUT /:key           — admin toggles a feature flag in DB
 */

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { featureController } from '../controllers/feature.controller';

// ── Public Router (Mounted at /api/v1/features) ──────────────────────────────
export const publicFeatureRouter = Router();
publicFeatureRouter.get('/', featureController.getPublicFeatures);

// ── Admin Router (Mounted at /api/v1/admin/features) ─────────────────────────
export const adminFeatureRouter = Router();
adminFeatureRouter.use(requireAuth, requireRole(Role.ADMIN));
adminFeatureRouter.put('/:key', featureController.updateFeatureFlag);
