import { ProductStatus } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { productRepository } from '../repositories/product.repository';
import { categoryRepository } from '../repositories/category.repository';
import { collectionRepository } from '../repositories/collection.repository';
import { generateSlug, makeSlugUnique } from '../utils/slug';
import { SimpleCache } from '../lib/cache';
import type {
  ListProductsQuery,
  AdminListProductsQuery,
  CreateProductDto,
  UpdateProductDto,
  PatchStatusDto,
  PatchInventoryDto,
  BulkActionDto,
  DuplicateProductDto,
  MediaUpsertDto,
  ReorderDto,
  VariantUpsertDto
} from '../validators/product.validator';

const homepageCache = new SimpleCache<any>(60 * 1000); // 60 seconds TTL

export const clearHomepageCache = () => {
  homepageCache.clear();
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeAverageRating(reviews: Array<{ rating: number }>): number | null {
  if (!reviews || reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = generateSlug(name);
  let slug = base;
  let attempt = 1;

  while (await productRepository.slugExists(slug, excludeId)) {
    slug = makeSlugUnique(base, attempt++);
  }

  return slug;
}

function flattenTags(tags: Array<{ tag: { id: string; name: string; slug: string } }>) {
  return tags.map(t => t.tag);
}

// ─── Product Service ──────────────────────────────────────────────────────────

export const productService = {
  
  // ─── Public ───

  listProducts: async (query: ListProductsQuery) => {
    const { products, total } = await productRepository.findMany(query);
    const totalPages = Math.ceil(total / query.limit);

    const formattedProducts = products.map(p => ({
      ...p,
      tags: flattenTags(p.tags),
      reviewCount: p._count.reviews,
      _count: undefined,
    }));

    return {
      products: formattedProducts,
      pagination: {
        page: query.page, limit: query.limit, total, totalPages,
        hasNextPage: query.page < totalPages, hasPrevPage: query.page > 1,
      },
    };
  },

  getProductBySlug: async (slug: string) => {
    const product = await productRepository.findBySlug(slug);
    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    }
    const averageRating = computeAverageRating(product.reviews);
    return {
      ...product,
      tags: flattenTags(product.tags),
      averageRating, reviewCount: product._count.reviews, wishlistCount: product._count.wishlist, _count: undefined,
    };
  },

  // ─── Admin List & Detail ───

  listProductsAdmin: async (query: AdminListProductsQuery) => {
    const { products, total } = await productRepository.findManyAdmin(query);
    const totalPages = Math.ceil(total / query.limit);

    const formattedProducts = products.map(p => ({
      ...p,
      tags: flattenTags(p.tags),
      reviewCount: p._count.reviews,
      _count: undefined,
    }));

    return {
      products: formattedProducts,
      pagination: {
        page: query.page, limit: query.limit, total, totalPages,
        hasNextPage: query.page < totalPages, hasPrevPage: query.page > 1,
      },
    };
  },

  getProductById: async (id: string) => {
    const product = await productRepository.findByIdAdmin(id);
    if (!product) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    }
    const averageRating = computeAverageRating(product.reviews);
    return {
      ...product,
      tags: flattenTags(product.tags),
      averageRating, reviewCount: product._count.reviews, wishlistCount: product._count.wishlist, _count: undefined,
    };
  },

  // ─── Homepage Helpers ───

  getFeaturedProducts: async () => {
    const products = await productRepository.findFeatured(8);
    return products.map(p => ({ ...p, tags: flattenTags(p.tags), reviewCount: p._count.reviews, _count: undefined }));
  },

  getNewArrivals: async () => {
    const products = await productRepository.findNewArrivals(8);
    return products.map(p => ({ ...p, tags: flattenTags(p.tags), reviewCount: p._count.reviews, _count: undefined }));
  },

  getBestSellers: async () => {
    const products = await productRepository.findBestSellers(8);
    return products.map(p => ({ ...p, tags: flattenTags(p.tags), reviewCount: p._count.reviews, _count: undefined }));
  },

  getHomepageData: async () => {
    const cacheKey = 'homepage_data';
    const cached = homepageCache.get(cacheKey);
    if (cached) return cached;

    const [featuredRaw, bestSellersRaw, newArrivalsRaw, categories, collections] = await Promise.all([
      productRepository.findFeatured(8),
      productRepository.findBestSellers(8),
      productRepository.findNewArrivals(8),
      categoryRepository.findAll(),
      collectionRepository.findAll(),
    ]);

    const data = {
      featured: featuredRaw.map(p => ({ ...p, tags: flattenTags(p.tags), reviewCount: p._count.reviews, _count: undefined })),
      bestSellers: bestSellersRaw.map(p => ({ ...p, tags: flattenTags(p.tags), reviewCount: p._count.reviews, _count: undefined })),
      newArrivals: newArrivalsRaw.map(p => ({ ...p, tags: flattenTags(p.tags), reviewCount: p._count.reviews, _count: undefined })),
      categories,
      collections,
    };

    homepageCache.set(cacheKey, data);
    return data;
  },

  // ─── Mutations ───

  createProduct: async (dto: CreateProductDto) => {
    const category = await categoryRepository.findById(dto.categoryId);
    if (!category) throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);

    const slug = await uniqueSlug(dto.name);
    const product = await productRepository.create({ slug, dto, categoryId: dto.categoryId });
    clearHomepageCache();

    const averageRating = computeAverageRating(product.reviews);
    return {
      ...product,
      tags: flattenTags(product.tags),
      averageRating, reviewCount: product._count.reviews, wishlistCount: product._count.wishlist, _count: undefined,
    };
  },

  updateProduct: async (id: string, dto: UpdateProductDto) => {
    const existing = await productRepository.findByIdAdmin(id);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);

    if (dto.categoryId && dto.categoryId !== existing.categoryId) {
      const category = await categoryRepository.findById(dto.categoryId);
      if (!category) throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
    }

    let newSlug: string | undefined;
    if (dto.name && dto.name !== existing.name) {
      newSlug = await uniqueSlug(dto.name, id);
    }

    const product = await productRepository.update(id, dto, newSlug);
    if (dto.secondaryCategoryIds) {
      await productRepository.updateSecondaryCategories(id, dto.secondaryCategoryIds);
    }
    if (dto.additionalCollectionIds) {
      await productRepository.updateAdditionalCollections(id, dto.additionalCollectionIds);
    }
    
    clearHomepageCache();

    const averageRating = computeAverageRating(product.reviews);
    return {
      ...product,
      tags: flattenTags(product.tags),
      averageRating, reviewCount: product._count.reviews, wishlistCount: product._count.wishlist, _count: undefined,
    };
  },

  deleteProduct: async (id: string) => {
    const existing = await productRepository.findByIdAdmin(id);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    clearHomepageCache();
    return productRepository.archive(id);
  },

  patchStatus: async (id: string, dto: PatchStatusDto) => {
    const existing = await productRepository.findByIdAdmin(id);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    clearHomepageCache();
    return productRepository.updateStatus(id, dto.status);
  },

  patchInventory: async (id: string, dto: PatchInventoryDto) => {
    const existing = await productRepository.findByIdAdmin(id);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    clearHomepageCache();
    return productRepository.updateInventory(id, dto);
  },

  // ─── Bulk & Duplication ───

  bulkAction: async (dto: BulkActionDto) => {
    const { action, ids, extra } = dto;
    clearHomepageCache();
    
    switch (action) {
      case 'publish': return productRepository.bulkUpdateStatus(ids, ProductStatus.ACTIVE);
      case 'hide': return productRepository.bulkUpdateStatus(ids, ProductStatus.HIDDEN);
      case 'archive': return productRepository.bulkUpdateStatus(ids, ProductStatus.ARCHIVED);
      case 'delete': return productRepository.bulkUpdateStatus(ids, ProductStatus.ARCHIVED); // Soft delete
      case 'feature': return productRepository.bulkUpdateLabels(ids, { isFeatured: true });
      case 'unfeature': return productRepository.bulkUpdateLabels(ids, { isFeatured: false });
      case 'mark_best_seller': return productRepository.bulkUpdateLabels(ids, { isBestSeller: true });
      case 'mark_new_arrival': return productRepository.bulkUpdateLabels(ids, { isNewArrival: true });
      case 'change_category': 
        if (!extra?.categoryId) throw new AppError('Category ID required', HTTP_STATUS.BAD_REQUEST);
        return productRepository.bulkUpdateCategory(ids, extra.categoryId);
      case 'change_collection':
        if (!extra?.collectionId) throw new AppError('Collection ID required', HTTP_STATUS.BAD_REQUEST);
        return productRepository.bulkUpdateCollection(ids, extra.collectionId);
      case 'add_homepage_section':
        if (!extra?.section) throw new AppError('Section required', HTTP_STATUS.BAD_REQUEST);
        return productRepository.bulkAddHomepageSection(ids, extra.section);
      case 'remove_homepage_section':
        if (!extra?.section) throw new AppError('Section required', HTTP_STATUS.BAD_REQUEST);
        return productRepository.bulkRemoveHomepageSection(ids, extra.section);
      default: throw new AppError('Invalid bulk action', HTTP_STATUS.BAD_REQUEST);
    }
  },

  duplicateProduct: async (id: string, opts?: DuplicateProductDto) => {
    const original = await productRepository.findByIdAdmin(id);
    if (!original) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);

    const newName = original.name + ' (Copy)';
    
    const dto: any = {
      name: newName,
      description: original.description,
      shortDescription: original.shortDescription || undefined,
      categoryId: original.categoryId,
      collectionId: original.collectionId || undefined,
      price: Number(original.price),
      comparePrice: original.comparePrice ? Number(original.comparePrice) : undefined,
      costPrice: original.costPrice ? Number(original.costPrice) : undefined,
      status: ProductStatus.DRAFT,
      stockQuantity: opts?.withInventory ? original.stockQuantity : 0,
      lowStockThreshold: original.lowStockThreshold,
      trackInventory: original.trackInventory,
      difficulty: original.difficulty || undefined,
      studioType: original.studioType || undefined,
      isHandmade: original.isHandmade,
      // Default to false for copied labels
      isFeatured: false, isBestSeller: false, isNewArrival: false,
    };
    
    const newSlug = await uniqueSlug(newName);
    const product = await productRepository.create({ slug: newSlug, dto, categoryId: original.categoryId });
    
    // Copy media if requested
    if (opts?.withImages !== false && original.media && original.media.length > 0) {
      for (const m of original.media) {
         await productRepository.addMedia(product.id, {
           type: m.type, url: m.url, thumbnail: m.thumbnail || undefined, altText: m.altText || undefined,
           caption: m.caption || undefined, sortOrder: m.sortOrder, isPrimary: m.isPrimary,
           width: m.width || undefined, height: m.height || undefined
         });
      }
    }
    
    clearHomepageCache();
    return product;
  },

  // ─── Media & Variants ───

  addMedia: async (productId: string, dto: MediaUpsertDto) => {
    const existing = await productRepository.findByIdAdmin(productId);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    clearHomepageCache();
    return productRepository.addMedia(productId, dto);
  },

  removeMedia: async (productId: string, mediaId: string) => {
    const existing = await productRepository.findByIdAdmin(productId);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    clearHomepageCache();
    return productRepository.removeMedia(mediaId);
  },

  reorderMedia: async (productId: string, dto: ReorderDto) => {
    const existing = await productRepository.findByIdAdmin(productId);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    clearHomepageCache();
    return productRepository.reorderMedia(productId, dto.items);
  },

  upsertVariant: async (productId: string, dto: VariantUpsertDto) => {
    const existing = await productRepository.findByIdAdmin(productId);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    clearHomepageCache();
    return productRepository.upsertVariant(productId, dto);
  },

  deleteVariant: async (productId: string, variantId: string) => {
    const existing = await productRepository.findByIdAdmin(productId);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    clearHomepageCache();
    return productRepository.deleteVariant(variantId);
  },

  // ─── Analytics ───

  getProductAnalytics: async (id: string) => {
    const existing = await productRepository.findByIdAdmin(id);
    if (!existing) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    return productRepository.getProductAnalytics(id);
  }
};
