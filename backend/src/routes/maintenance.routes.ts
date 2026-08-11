/**
 * Maintenance Mode Routes
 *
 * Public (mounted at /api/v1/maintenance):
 *   GET /status             — storefront retrieves public maintenance status
 *
 * Admin (mounted at /api/v1/admin/settings/maintenance):
 *   PUT /                   — admin toggles maintenance mode in DB
 */

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { featureController } from '../controllers/feature.controller';

// ── Public Router (Mounted at /api/v1/maintenance) ─────────────────────────
export const publicMaintenanceRouter = Router();
publicMaintenanceRouter.get('/status', featureController.getMaintenanceStatus);

// ── Admin Router (Mounted at /api/v1/admin/settings/maintenance) ───────────
export const adminMaintenanceRouter = Router();
adminMaintenanceRouter.use(requireAuth, requireRole(Role.ADMIN));
adminMaintenanceRouter.put('/', featureController.updateMaintenanceMode);
