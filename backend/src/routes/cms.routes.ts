/**
 * CMS Routes — Phase 9 (CMS Engine)
 *
 * Public (mounted at /api/v1/cms):
 *   GET  /hero-config        — storefront reads active hero template
 *   GET  /homepage-config   — storefront reads full homepage CMS config
 *
 * Admin (mounted at /api/v1/admin/cms):
 *   GET  /hero-config        — admin reads current hero config
 *   PATCH /hero-config       — admin updates active hero template
 *   GET  /homepage-config   — admin reads homepage config
 *   PATCH /homepage-config   — admin updates homepage merchandising settings
 */

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { cmsController } from '../controllers/cms.controller';

// ── Public router ─────────────────────────────────────────────────────────────
// Mounted at /api/v1/cms
export const publicCmsRouter = Router();

publicCmsRouter.get('/hero-config', cmsController.getHeroConfig);
publicCmsRouter.get('/homepage-config', cmsController.getHomepageConfig);

// ── Admin router ──────────────────────────────────────────────────────────────
// Mounted at /api/v1/admin/cms — all routes require auth + ADMIN role
export const adminCmsRouter = Router();

adminCmsRouter.use(requireAuth, requireRole(Role.ADMIN));

adminCmsRouter.get('/hero-config', cmsController.getHeroConfig);
adminCmsRouter.patch('/hero-config', cmsController.updateHeroConfig);
adminCmsRouter.get('/homepage-config', cmsController.getHomepageConfig);
adminCmsRouter.patch('/homepage-config', cmsController.updateHomepageConfig);
