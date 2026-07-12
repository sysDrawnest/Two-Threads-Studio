import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/auth.middleware';
import {
  listCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collection.controller';
import {
  createCollectionSchema,
  updateCollectionSchema,
  collectionIdParamsSchema,
} from '../validators/collection.validator';
import { z } from 'zod';

const router = Router();

// ─── Public ────────────────────────────────────────────────────────────────────
router.get('/', listCollections);

router.get(
  '/:slug',
  validate(z.object({ params: z.object({ slug: z.string().min(1) }) })),
  getCollectionBySlug
);

// ─── Admin ─────────────────────────────────────────────────────────────────────
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createCollectionSchema),
  createCollection
);

router.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(updateCollectionSchema),
  updateCollection
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(collectionIdParamsSchema),
  deleteCollection
);

export default router;
