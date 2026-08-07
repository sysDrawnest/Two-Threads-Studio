/**
 * CMS Routes — Phase 9 (CMS Phase 1)
 *
 * Public:
 *   GET  /api/v1/cms/hero-config        — storefront reads active template (no auth)
 *
 * Admin (mounted at /api/v1/admin/cms):
 *   GET  /hero-config                   — admin reads current config
 *   PATCH /hero-config                  — admin updates active template
 */

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { cmsController } from '../controllers/cms.controller';

// ── Public router ─────────────────────────────────────────────────────────────
// Mounted at /api/v1/cms
export const publicCmsRouter = Router();

publicCmsRouter.get('/hero-config', cmsController.getHeroConfig);
publicCmsRouter.get('/homepage-merchandising', cmsController.getHomepageMerchandising);

// ── Admin router ──────────────────────────────────────────────────────────────
// Mounted at /api/v1/admin/cms — all routes require auth + ADMIN role
export const adminCmsRouter = Router();

adminCmsRouter.use(requireAuth, requireRole(Role.ADMIN));

adminCmsRouter.get('/hero-config', cmsController.getHeroConfig);
adminCmsRouter.patch('/hero-config', cmsController.updateHeroConfig);

adminCmsRouter.get('/homepage-merchandising', cmsController.getHomepageMerchandising);
adminCmsRouter.patch('/homepage-merchandising', cmsController.updateHomepageMerchandising);
