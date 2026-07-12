import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/auth.middleware';
import {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamsSchema,
} from '../validators/category.validator';
import { z } from 'zod';

const router = Router();

// ─── Public ────────────────────────────────────────────────────────────────────
router.get('/', listCategories);

router.get(
  '/:slug',
  validate(z.object({ params: z.object({ slug: z.string().min(1) }) })),
  getCategoryBySlug
);

// ─── Admin ─────────────────────────────────────────────────────────────────────
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createCategorySchema),
  createCategory
);

router.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(updateCategorySchema),
  updateCategory
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(categoryIdParamsSchema),
  deleteCategory
);

export default router;
