import { z } from 'zod';
import { ProductStatus, ProductType, BadgeType, DifficultyLevel } from '@prisma/client';

// ─── Query: List Products ──────────────────────────────────────────────────────
export const listProductsQuerySchema = z.object({
  query: z.object({
    // Pagination
    page:  z.string().optional().default('1').transform(Number).pipe(z.number().int().positive()),
    limit: z.string().optional().default('12').transform(Number).pipe(z.number().int().min(1).max(100)),

    // Filters
    category:   z.string().optional(),
    collection: z.string().optional(),
    tag:        z.string().optional(),
    featured:   z.enum(['true', 'false']).optional().transform(v => v === 'true'),
    available:  z.enum(['true', 'false']).optional().transform(v => v === 'true'),
    type:       z.nativeEnum(ProductType).optional(),
    badge:      z.nativeEnum(BadgeType).optional(),
    difficulty: z.nativeEnum(DifficultyLevel).optional(),
    handmade:   z.enum(['true', 'false']).optional().transform(v => v === 'true'),
    customizable: z.enum(['true', 'false']).optional().transform(v => v === 'true'),

    // Price range (in INR paise or full rupees — we use full rupees)
    minPrice: z.string().optional().transform(Number).pipe(z.number().nonnegative()).optional(),
    maxPrice: z.string().optional().transform(Number).pipe(z.number().positive()).optional(),

    // Search
    search: z.string().max(200).optional(),

    // Sorting
    sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'rating', 'popular']).optional().default('newest'),
  }),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>['query'];

// ─── Params: Slug ──────────────────────────────────────────────────────────────
export const productSlugParamsSchema = z.object({
  params: z.object({
    slug: z.string().min(1).max(255),
  }),
});

export type ProductSlugParams = z.infer<typeof productSlugParamsSchema>['params'];

// ─── Params: ID ───────────────────────────────────────────────────────────────
export const productIdParamsSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
});

export type ProductIdParams = z.infer<typeof productIdParamsSchema>['params'];

// ─── Body: Create Product ──────────────────────────────────────────────────────
const productBaseSchema = z.object({
  name:             z.string().min(1, 'Name is required').max(255).trim(),
  shortDescription: z.string().max(500).trim().optional(),
  description:      z.string().min(1, 'Description is required').trim(),
  sku:              z.string().max(100).trim().optional(),
  categoryId:       z.string().cuid('Invalid category ID'),
  collectionId:     z.string().cuid('Invalid collection ID').optional(),

  // Pricing — stored as strings from JSON but validated as numbers
  price:        z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  costPrice:    z.number().nonnegative().optional(),

  // Inventory
  stockQuantity:     z.number().int().nonnegative().default(0),
  lowStockThreshold: z.number().int().nonnegative().default(5),
  trackInventory:    z.boolean().default(true),

  // Status & classification
  status:     z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  type:       z.nativeEnum(ProductType).default(ProductType.PHYSICAL),
  badge:      z.nativeEnum(BadgeType).optional(),
  difficulty: z.nativeEnum(DifficultyLevel).optional(),
  featured:   z.boolean().default(false),

  // Artisan fields
  isHandmade:               z.boolean().default(true),
  isSustainable:            z.boolean().default(false),
  isCustomizable:           z.boolean().default(false),
  isPersonalizable:         z.boolean().default(false),
  madeToOrder:              z.boolean().default(false),
  estimatedProductionDays:  z.number().int().positive().optional(),
  estimatedShippingDays:    z.number().int().positive().optional(),
  estimatedTime:            z.string().max(100).optional(),

  materials:         z.array(z.string()).default([]),
  materialsIncluded: z.array(z.string()).default([]),
  technique:         z.string().max(100).optional(),
  careInstructions:  z.string().optional(),
  origin:            z.string().max(200).optional(),

  // Physical
  weight:     z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width:  z.number().positive(),
    height: z.number().positive(),
    unit:   z.enum(['cm', 'in']).default('cm'),
  }).optional(),

  // SEO
  seoTitle:       z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),

  // Nested images (optional on create — can be added separately)
  images: z.array(z.object({
    url:       z.string().url('Image must be a valid URL'),
    altText:   z.string().max(255).optional(),
    sortOrder: z.number().int().nonnegative().default(0),
    isPrimary: z.boolean().default(false),
    width:     z.number().int().positive().optional(),
    height:    z.number().int().positive().optional(),
  })).optional().default([]),

  // Nested variants (optional)
  variants: z.array(z.object({
    name:            z.string().min(1).max(100),
    value:           z.string().min(1).max(100),
    sku:             z.string().max(100).optional(),
    priceAdjustment: z.number().default(0),
    stockQuantity:   z.number().int().nonnegative().default(0),
    isActive:        z.boolean().default(true),
  })).optional().default([]),

  // Tag IDs to connect
  tagIds: z.array(z.string().cuid()).optional().default([]),
});

export const createProductSchema = z.object({
  body: productBaseSchema,
});

export type CreateProductDto = z.infer<typeof createProductSchema>['body'];

// ─── Body: Update Product ──────────────────────────────────────────────────────
export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: productBaseSchema.partial(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>['body'];

// ─── Body: Patch Status ────────────────────────────────────────────────────────
export const patchStatusSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: z.object({
    status: z.nativeEnum(ProductStatus, { message: 'Invalid status value' }),
  }),
});

export type PatchStatusDto = z.infer<typeof patchStatusSchema>['body'];

// ─── Body: Patch Inventory ─────────────────────────────────────────────────────
export const patchInventorySchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: z.object({
    stockQuantity:    z.number().int().nonnegative('Stock cannot be negative'),
    lowStockThreshold: z.number().int().nonnegative().optional(),
    trackInventory:   z.boolean().optional(),
  }),
});

export type PatchInventoryDto = z.infer<typeof patchInventorySchema>['body'];
