import { ProductStatus } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { productRepository } from '../repositories/product.repository';
import { categoryRepository } from '../repositories/category.repository';
import { generateSlug, makeSlugUnique } from '../utils/slug';
import type {
  ListProductsQuery,
  CreateProductDto,
  UpdateProductDto,
  PatchStatusDto,
  PatchInventoryDto,
} from '../validators/product.validator';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Computes average rating from the reviews relation.
 * Prisma doesn't yet expose _avg in a findUnique include, so we compute it.
 */
function computeAverageRating(reviews: Array<{ rating: number }>): number | null {
  if (!reviews || reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * Generates a unique slug, appending a numeric suffix if needed.
 */
async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = generateSlug(name);
  let slug = base;
  let attempt = 1;

  while (await productRepository.slugExists(slug, excludeId)) {
    slug = makeSlugUnique(base, attempt++);
  }

  return slug;
}

// ─── Transforms ───────────────────────────────────────────────────────────────

/** Flattens tags from { tag: { id, name, slug } }[] to { id, name, slug }[] */
function flattenTags(tags: Array<{ tag: { id: string; name: string; slug: string } }>) {
  return tags.map(t => t.tag);
}

// ─── Product Service ──────────────────────────────────────────────────────────

export const productService = {
  /**
   * Paginated product listing with filtering, search, and sorting.
   */
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
        page:       query.page,
        limit:      query.limit,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPrevPage: query.page > 1,
      },
    };
  },

  /**
   * Full product detail by slug (public).
   * Only returns ACTIVE products to public callers.
   */
  getProductBySlug: async (slug: string) => {
    const product = await productRepository.findBySlug(slug);

    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    }

    const averageRating = computeAverageRating(product.reviews);

    return {
      ...product,
      tags:          flattenTags(product.tags),
      averageRating,
      reviewCount:   product._count.reviews,
      wishlistCount: product._count.wishlist,
      _count:        undefined,
    };
  },

  /**
   * Full product detail by ID (admin — returns any status).
   */
  getProductById: async (id: string) => {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    }

    const averageRating = computeAverageRating(product.reviews);

    return {
      ...product,
      tags:          flattenTags(product.tags),
      averageRating,
      reviewCount:   product._count.reviews,
      wishlistCount: product._count.wishlist,
      _count:        undefined,
    };
  },

  /**
   * Featured products for homepage.
   */
  getFeaturedProducts: async () => {
    const products = await productRepository.findFeatured(8);
    return products.map(p => ({
      ...p,
      tags:        flattenTags(p.tags),
      reviewCount: p._count.reviews,
      _count:      undefined,
    }));
  },

  /**
   * New arrivals for homepage.
   */
  getNewArrivals: async () => {
    const products = await productRepository.findNewArrivals(8);
    return products.map(p => ({
      ...p,
      tags:        flattenTags(p.tags),
      reviewCount: p._count.reviews,
      _count:      undefined,
    }));
  },

  /**
   * Best sellers for homepage.
   */
  getBestSellers: async () => {
    const products = await productRepository.findBestSellers(8);
    return products.map(p => ({
      ...p,
      tags:        flattenTags(p.tags),
      reviewCount: p._count.reviews,
      _count:      undefined,
    }));
  },

  /**
   * Admin: Create a new product.
   */
  createProduct: async (dto: CreateProductDto) => {
    // Validate category exists
    const category = await categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
    }

    const slug = await uniqueSlug(dto.name);

    const product = await productRepository.create({
      slug,
      dto,
      categoryId: dto.categoryId,
    });

    const averageRating = computeAverageRating(product.reviews);

    return {
      ...product,
      tags:          flattenTags(product.tags),
      averageRating,
      reviewCount:   product._count.reviews,
      wishlistCount: product._count.wishlist,
      _count:        undefined,
    };
  },

  /**
   * Admin: Update an existing product.
   */
  updateProduct: async (id: string, dto: UpdateProductDto) => {
    // Ensure product exists
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    }

    // Validate category if it's being changed
    if (dto.categoryId && dto.categoryId !== existing.categoryId) {
      const category = await categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
      }
    }

    // Generate new slug if name changed
    let newSlug: string | undefined;
    if (dto.name && dto.name !== existing.name) {
      newSlug = await uniqueSlug(dto.name, id);
    }

    const product = await productRepository.update(id, dto, newSlug);
    const averageRating = computeAverageRating(product.reviews);

    return {
      ...product,
      tags:          flattenTags(product.tags),
      averageRating,
      reviewCount:   product._count.reviews,
      wishlistCount: product._count.wishlist,
      _count:        undefined,
    };
  },

  /**
   * Admin: Soft delete (archive) a product.
   */
  deleteProduct: async (id: string) => {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    }

    return productRepository.archive(id);
  },

  /**
   * Admin: Patch product status.
   */
  patchStatus: async (id: string, dto: PatchStatusDto) => {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    }

    return productRepository.updateStatus(id, dto.status);
  },

  /**
   * Admin: Patch inventory fields.
   */
  patchInventory: async (id: string, dto: PatchInventoryDto) => {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    }

    return productRepository.updateInventory(id, dto);
  },
};
