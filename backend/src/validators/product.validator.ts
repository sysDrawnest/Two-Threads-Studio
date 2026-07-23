import { z } from 'zod';
import { ProductStatus, StudioProductType, HomepageSection, MediaType, DifficultyLevel } from '@prisma/client';

// ─── Query: List Products (Public) ─────────────────────────────────────────────
export const listProductsQuerySchema = z.object({
  query: z.object({
    page:  z.string().optional().default('1').transform(Number).pipe(z.number().int().positive()),
    limit: z.string().optional().default('12').transform(Number).pipe(z.number().int().min(1).max(100)),
    category:   z.string().optional(),
    collection: z.string().optional(),
    tag:        z.string().optional(),
    isFeatured: z.enum(['true', 'false']).optional().transform(v => v === 'true'),
    available:  z.enum(['true', 'false']).optional().transform(v => v === 'true'),
    studioType: z.nativeEnum(StudioProductType).optional(),
    difficulty: z.nativeEnum(DifficultyLevel).optional(),
    minPrice:   z.string().optional().transform(Number).pipe(z.number().nonnegative()).optional(),
    maxPrice:   z.string().optional().transform(Number).pipe(z.number().positive()).optional(),
    search:     z.string().max(200).optional(),
    sort:       z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'rating', 'popular']).optional().default('newest'),
  }),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>['query'];

// ─── Query: Admin List Products ───────────────────────────────────────────────
export const adminListProductsQuerySchema = z.object({
  query: z.object({
    page:  z.string().optional().default('1').transform(Number).pipe(z.number().int().positive()),
    limit: z.string().optional().default('30').transform(Number).pipe(z.number().int().min(1).max(100)),
    status:       z.nativeEnum(ProductStatus).optional(),
    category:     z.string().optional(),
    collection:   z.string().optional(),
    studioType:   z.nativeEnum(StudioProductType).optional(),
    search:       z.string().max(200).optional(),
    sort:         z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'stock_asc', 'stock_desc', 'name_asc', 'name_desc']).optional().default('newest'),
    homepageSection: z.nativeEnum(HomepageSection).optional(),
  }),
});

export type AdminListProductsQuery = z.infer<typeof adminListProductsQuerySchema>['query'];

// ─── Params ───────────────────────────────────────────────────────────────────
export const productSlugParamsSchema = z.object({
  params: z.object({ slug: z.string().min(1).max(255) }),
});

export const productIdParamsSchema = z.object({
  params: z.object({ id: z.string().cuid('Invalid product ID') }),
});

export const mediaIdParamsSchema = z.object({
  params: z.object({ mediaId: z.string().cuid('Invalid media ID') }),
});

export const variantIdParamsSchema = z.object({
  params: z.object({ variantId: z.string().cuid('Invalid variant ID') }),
});

// ─── Body: Create/Update Product Base ─────────────────────────────────────────
const productBaseSchema = z.object({
  name:             z.string().min(1, 'Name is required').max(255).trim(),
  shortDescription: z.string().max(500).trim().optional(),
  description:      z.string().min(1, 'Description is required').trim(),
  sku:              z.string().max(100).trim().optional(),
  categoryId:       z.string().min(1, 'Category is required'),
  collectionId:     z.string().min(1).optional(),

  // Pricing
  price:        z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  costPrice:    z.number().nonnegative().optional(),

  // Inventory
  stockQuantity:     z.number().int().nonnegative().default(0),
  lowStockThreshold: z.number().int().nonnegative().default(5),
  trackInventory:    z.boolean().default(true),

  status:     z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  difficulty: z.nativeEnum(DifficultyLevel).optional(),
  
  // Classification
  studioType:       z.nativeEnum(StudioProductType).optional(),
  homepageSections: z.array(z.nativeEnum(HomepageSection)).default([]),

  // Boolean Labels
  isFeatured:        z.boolean().default(false),
  isNewArrival:      z.boolean().default(false),
  isBestSeller:      z.boolean().default(false),
  isLimitedEdition:  z.boolean().default(false),
  isExclusive:       z.boolean().default(false),
  isEcoFriendly:     z.boolean().default(false),
  isDigitalDownload: z.boolean().default(false),

  // Publishing
  publishedAt: z.coerce.date().optional(),
  isVisible:   z.boolean().default(true),
  sortOrder:   z.number().int().default(0),

  // Extended content
  subtitle:       z.string().max(255).optional(),
  productStory:   z.string().optional(),
  artisanNotes:   z.string().optional(),
  whatsIncluded:  z.string().optional(),
  barcode:        z.string().max(100).optional(),
  searchKeywords: z.array(z.string()).default([]),

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
  seoKeywords:    z.string().max(255).optional(),
  ogImageUrl:     z.string().optional(),
  canonicalUrl:   z.string().url().optional(),
  robotsMeta:     z.string().max(100).default('index,follow'),

  // Inventory extended
  allowBackorders:  z.boolean().default(false),
  reservedQuantity: z.number().int().nonnegative().default(0),
  incomingQuantity: z.number().int().nonnegative().default(0),

  // Pricing extended
  taxClass:   z.string().max(100).optional(),
  hsnCode:    z.string().max(100).optional(),
  gstPercent: z.number().nonnegative().optional(),

  // Shipping extended
  shippingClass:  z.string().max(100).optional(),
  isFreeShipping: z.boolean().default(false),
  isFragile:      z.boolean().default(false),
  packageSize:    z.string().max(100).optional(),

  allowCod: z.boolean().default(true),

  // Relations
  tagIds: z.array(z.string().cuid()).optional().default([]),
  secondaryCategoryIds: z.array(z.string().cuid()).optional().default([]),
  additionalCollectionIds: z.array(z.string().cuid()).optional().default([]),
});

export const createProductSchema = z.object({
  body: productBaseSchema,
});

export type CreateProductDto = z.infer<typeof createProductSchema>['body'];

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: productBaseSchema.partial(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>['body'];

// ─── Status & Inventory Patch ──────────────────────────────────────────────────
export const patchStatusSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: z.object({
    status: z.nativeEnum(ProductStatus),
  }),
});

export type PatchStatusDto = z.infer<typeof patchStatusSchema>['body'];

export const patchInventorySchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: z.object({
    stockQuantity: z.number().int().nonnegative().optional(),
    lowStockThreshold: z.number().int().nonnegative().optional(),
    trackInventory: z.boolean().optional(),
    allowBackorders: z.boolean().optional(),
  }),
});

export type PatchInventoryDto = z.infer<typeof patchInventorySchema>['body'];

// ─── Bulk Actions ─────────────────────────────────────────────────────────────
export const bulkActionSchema = z.object({
  body: z.object({
    action: z.enum([
      'publish', 'hide', 'archive', 'delete', 'feature', 'unfeature',
      'mark_best_seller', 'mark_new_arrival', 'change_category',
      'change_collection', 'add_homepage_section', 'remove_homepage_section'
    ]),
    ids: z.array(z.string().cuid()).min(1),
    extra: z.any().optional(), // Used for passing categoryId, section, etc.
  }),
});

export type BulkActionDto = z.infer<typeof bulkActionSchema>['body'];

// ─── Duplicate ────────────────────────────────────────────────────────────────
export const duplicateProductSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: z.object({
    withImages: z.boolean().default(true),
    withInventory: z.boolean().default(false),
  }).optional(),
});

export type DuplicateProductDto = z.infer<typeof duplicateProductSchema>['body'];

// ─── Media Management ─────────────────────────────────────────────────────────
export const mediaUpsertSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: z.object({
    type:      z.nativeEnum(MediaType).default(MediaType.IMAGE),
    url:       z.string().min(1, 'URL is required'),
    thumbnail: z.string().optional(),
    altText:   z.string().max(255).optional(),
    caption:   z.string().max(255).optional(),
    sortOrder: z.number().int().nonnegative().default(0),
    isPrimary: z.boolean().default(false),
    width:     z.number().int().positive().optional(),
    height:    z.number().int().positive().optional(),
  }),
});

export type MediaUpsertDto = z.infer<typeof mediaUpsertSchema>['body'];

export const reorderSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: z.object({
    items: z.array(z.object({
      id: z.string().cuid(),
      sortOrder: z.number().int().nonnegative(),
    })),
  }),
});

export type ReorderDto = z.infer<typeof reorderSchema>['body'];

// ─── Variant Management ───────────────────────────────────────────────────────
export const variantUpsertSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
  body: z.object({
    id:              z.string().cuid().optional(), // If missing, create new
    name:            z.string().min(1).max(100),
    value:           z.string().min(1).max(100),
    sku:             z.string().max(100).optional(),
    priceAdjustment: z.number().default(0),
    stockQuantity:   z.number().int().nonnegative().default(0),
    isActive:        z.boolean().default(true),
  }),
});

export type VariantUpsertDto = z.infer<typeof variantUpsertSchema>['body'];
