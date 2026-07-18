import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/auth.middleware';
import {
  listProducts,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getHomepageData,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProductStatus,
  patchProductInventory,
} from '../controllers/product.controller';
import {
  listProductsQuerySchema,
  productSlugParamsSchema,
  productIdParamsSchema,
  createProductSchema,
  updateProductSchema,
  patchStatusSchema,
  patchInventorySchema,
} from '../validators/product.validator';

const router = Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────
// IMPORTANT: Static routes MUST come before /:slug to avoid "featured", 
// "new-arrivals", and "best-sellers" being interpreted as slugs.

router.get('/featured',     getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/homepage',     getHomepageData);

router.get(
  '/',
  validate(listProductsQuerySchema),
  listProducts
);

router.get(
  '/:slug',
  validate(productSlugParamsSchema),
  getProductBySlug
);

// ─── Admin Routes ──────────────────────────────────────────────────────────────
// All admin routes require authentication + ADMIN role.

router.get(
  '/admin/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(productIdParamsSchema),
  getProductById
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

export default router;
