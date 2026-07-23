import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import {
  listProducts,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getHomepageData,
  listProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProductStatus,
  patchProductInventory,
  bulkAction,
  duplicateProduct,
  addMedia,
  removeMedia,
  reorderMedia,
  upsertVariant,
  deleteVariant,
  getProductAnalytics
} from '../controllers/product.controller';
import {
  listProductsQuerySchema,
  adminListProductsQuerySchema,
  productSlugParamsSchema,
  productIdParamsSchema,
  mediaIdParamsSchema,
  variantIdParamsSchema,
  createProductSchema,
  updateProductSchema,
  patchStatusSchema,
  patchInventorySchema,
  bulkActionSchema,
  duplicateProductSchema,
  mediaUpsertSchema,
  reorderSchema,
  variantUpsertSchema
} from '../validators/product.validator';

const router = Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────

router.get('/featured',     getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/homepage',     getHomepageData);

router.get(
  '/',
  validate(listProductsQuerySchema),
  listProducts
);

// ─── Admin Routes ──────────────────────────────────────────────────────────────

router.get(
  '/admin',
  requireAuth,
  requireRole('ADMIN'),
  validate(adminListProductsQuerySchema),
  listProductsAdmin
);

router.get(
  '/admin/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  getProductById
);

router.post(
  '/admin/bulk-action',
  requireAuth,
  requireRole('ADMIN'),
  validate(bulkActionSchema),
  bulkAction
);

// ─── Dynamic Public Routes ─────────────────────────────────────────────────────

router.get(
  '/:slug',
  validate(productSlugParamsSchema),
  getProductBySlug
);

router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  deleteProduct
);

router.patch(
  '/:id/status',
  requireAuth,
  requireRole('ADMIN'),
  validate(patchStatusSchema),
  patchProductStatus
);

router.patch(
  '/:id/inventory',
  requireAuth,
  requireRole('ADMIN'),
  validate(patchInventorySchema),
  patchProductInventory
);

router.post(
  '/:id/duplicate',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  validate(duplicateProductSchema),
  duplicateProduct
);

// ─── Media Management ───

router.post(
  '/:id/media',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  validate(mediaUpsertSchema),
  addMedia
);

router.delete(
  '/:id/media/:mediaId',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  validate(mediaIdParamsSchema),
  removeMedia
);

router.put(
  '/:id/media/reorder',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  validate(reorderSchema),
  reorderMedia
);

// ─── Variant Management ───

router.post(
  '/:id/variants',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  validate(variantUpsertSchema),
  upsertVariant
);

router.delete(
  '/:id/variants/:variantId',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  validate(variantIdParamsSchema),
  deleteVariant
);

// ─── Analytics ───

router.get(
  '/:id/analytics',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  getProductAnalytics
);

export default router;
