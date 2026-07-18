import prisma from '../prisma';
import { Prisma, ProductStatus, BadgeType } from '@prisma/client';
import type { ListProductsQuery, CreateProductDto, UpdateProductDto } from '../validators/product.validator';

// ─── Shared Includes ───────────────────────────────────────────────────────────

/** Minimal include for list views — avoids over-fetching */
const listInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
  collection: {
    select: { id: true, name: true, slug: true },
  },
  images: {
    where: { isPrimary: true },
    select: { id: true, url: true, altText: true, isPrimary: true, sortOrder: true },
    orderBy: { sortOrder: 'asc' as const },
    take: 1,
  },
  tags: {
    select: {
      tag: { select: { id: true, name: true, slug: true } },
    },
  },
  _count: {
    select: { reviews: true },
  },
} satisfies Prisma.ProductInclude;

/** Full include for detail view */
const detailInclude = {
  category: {
    select: { id: true, name: true, slug: true, description: true, image: true },
  },
  collection: {
    select: { id: true, name: true, slug: true, description: true, bannerImage: true },
  },
  images: {
    orderBy: { sortOrder: 'asc' as const },
  },
  variants: {
    where: { isActive: true },
    orderBy: { name: 'asc' as const },
  },
  tags: {
    select: {
      tag: { select: { id: true, name: true, slug: true } },
    },
  },
  reviews: {
    orderBy: { createdAt: 'desc' as const },
    take: 20,
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
    },
  },
  _count: {
    select: { reviews: true, wishlist: true },
  },
} satisfies Prisma.ProductInclude;

// ─── Build Where Clause ────────────────────────────────────────────────────────

function buildWhereClause(query: ListProductsQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    // Public-facing queries only return ACTIVE products
    status: ProductStatus.ACTIVE,
  };

  if (query.search) {
    where.OR = [
      { name:             { contains: query.search, mode: 'insensitive' } },
      { shortDescription: { contains: query.search, mode: 'insensitive' } },
      { description:      { contains: query.search, mode: 'insensitive' } },
      { tags: { some: { tag: { name: { contains: query.search, mode: 'insensitive' } } } } },
    ];
  }

  if (query.category) {
    where.category = { slug: query.category };
  }

  if (query.collection) {
    where.collection = { slug: query.collection };
  }

  if (query.tag) {
    where.tags = { some: { tag: { slug: query.tag } } };
  }

  if (query.featured === true) {
    where.featured = true;
  }

  if (query.available === true) {
    where.stockQuantity = { gt: 0 };
  }

  if (query.badge) {
    where.badge = query.badge;
  }

  if (query.difficulty) {
    where.difficulty = query.difficulty;
  }

  if (query.type) {
    where.type = query.type;
  }

  if (query.handmade === true) {
    where.isHandmade = true;
  }

  if (query.customizable === true) {
    where.isCustomizable = true;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) where.price.gte = query.minPrice;
    if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
  }

  return where;
}

// ─── Build OrderBy ─────────────────────────────────────────────────────────────

function buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'price_asc':
      return [{ price: 'asc' }];
    case 'price_desc':
      return [{ price: 'desc' }];
    case 'oldest':
      return [{ createdAt: 'asc' }];
    case 'popular':
      return [{ reviews: { _count: 'desc' } }, { createdAt: 'desc' }];
    case 'rating':
      return [{ reviews: { _count: 'desc' } }, { featured: 'desc' }, { createdAt: 'desc' }];
    case 'newest':
    default:
      return [{ featured: 'desc' }, { createdAt: 'desc' }];
  }
}

// ─── Repository ────────────────────────────────────────────────────────────────

export const productRepository = {
  /**
   * Paginated product listing with full filter/sort support.
   */
  findMany: async (query: ListProductsQuery) => {
    const where    = buildWhereClause(query);
    const orderBy  = buildOrderBy(query.sort);
    const skip     = (query.page - 1) * query.limit;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: listInclude,
        orderBy,
        skip,
        take: query.limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },

  /**
   * Full product detail by slug. Returns null if not found.
   */
  findBySlug: async (slug: string) => {
    return prisma.product.findUnique({
      where:   { slug },
      include: detailInclude,
    });
  },

  /**
   * Full product detail by ID (for admin). Returns null if not found.
   */
  findById: async (id: string) => {
    return prisma.product.findUnique({
      where:   { id },
      include: detailInclude,
    });
  },

  /**
   * Featured products for homepage carousel.
   */
  findFeatured: async (limit: number = 8) => {
    return prisma.product.findMany({
      where:   { status: ProductStatus.ACTIVE, featured: true },
      include: listInclude,
      orderBy: [{ createdAt: 'desc' }],
      take:    limit,
    });
  },

  /**
   * New arrivals — most recently created ACTIVE products.
   */
  findNewArrivals: async (limit: number = 8) => {
    return prisma.product.findMany({
      where:   { status: ProductStatus.ACTIVE },
      include: listInclude,
      orderBy: [{ createdAt: 'desc' }],
      take:    limit,
    });
  },

  /**
   * Best sellers — ACTIVE products with BEST_SELLER badge.
   */
  findBestSellers: async (limit: number = 8) => {
    return prisma.product.findMany({
      where:   { status: ProductStatus.ACTIVE },
      include: listInclude,
      orderBy: [{ salesCount: 'desc' }, { createdAt: 'desc' }],
      take:    limit,
    });
  },

  /**
   * Check if a slug already exists (for uniqueness enforcement).
   */
  slugExists: async (slug: string, excludeId?: string): Promise<boolean> => {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!product) return false;
    if (excludeId && product.id === excludeId) return false;
    return true;
  },

  /**
   * Create a product with nested images, variants, and tags.
   */
  create: async (data: {
    slug:     string;
    dto:      CreateProductDto;
    categoryId: string;
  }) => {
    const { slug, dto, categoryId } = data;

    return prisma.product.create({
      data: {
        name:             dto.name,
        slug,
        shortDescription: dto.shortDescription,
        description:      dto.description,
        sku:              dto.sku,
        categoryId,
        collectionId:     dto.collectionId,

        price:        dto.price,
        comparePrice: dto.comparePrice,
        costPrice:    dto.costPrice,

        stockQuantity:     dto.stockQuantity ?? 0,
        lowStockThreshold: dto.lowStockThreshold ?? 5,
        trackInventory:    dto.trackInventory ?? true,

        status:     dto.status,
        type:       dto.type,
        badge:      dto.badge,
        difficulty: dto.difficulty,
        featured:   dto.featured ?? false,

        isHandmade:               dto.isHandmade ?? true,
        isSustainable:            dto.isSustainable ?? false,
        isCustomizable:           dto.isCustomizable ?? false,
        isPersonalizable:         dto.isPersonalizable ?? false,
        madeToOrder:              dto.madeToOrder ?? false,
        estimatedProductionDays:  dto.estimatedProductionDays,
        estimatedShippingDays:    dto.estimatedShippingDays,
        estimatedTime:            dto.estimatedTime,

        materials:         dto.materials ?? [],
        materialsIncluded: dto.materialsIncluded ?? [],
        technique:         dto.technique,
        careInstructions:  dto.careInstructions,
        origin:            dto.origin,

        weight:     dto.weight,
        dimensions: dto.dimensions as Prisma.InputJsonValue | undefined,

        seoTitle:       dto.seoTitle,
        seoDescription: dto.seoDescription,

        images: {
          create: (dto.images ?? []).map((img, i) => ({
            url:       img.url,
            altText:   img.altText,
            sortOrder: img.sortOrder ?? i,
            isPrimary: img.isPrimary ?? i === 0,
            width:     img.width,
            height:    img.height,
          })),
        },

        variants: {
          create: (dto.variants ?? []).map(v => ({
            name:            v.name,
            value:           v.value,
            sku:             v.sku,
            priceAdjustment: v.priceAdjustment ?? 0,
            stockQuantity:   v.stockQuantity ?? 0,
            isActive:        v.isActive ?? true,
          })),
        },

        tags: {
          create: (dto.tagIds ?? []).map(tagId => ({ tagId })),
        },
      },
      include: detailInclude,
    });
  },

  /**
   * Update a product by ID. Handles partial updates cleanly.
   */
  update: async (id: string, dto: UpdateProductDto, newSlug?: string) => {
    return prisma.product.update({
      where: { id },
      data: {
        ...(dto.name             !== undefined && { name:             dto.name }),
        ...(newSlug              !== undefined && { slug:             newSlug }),
        ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
        ...(dto.description      !== undefined && { description:      dto.description }),
        ...(dto.sku              !== undefined && { sku:              dto.sku }),
        ...(dto.categoryId       !== undefined && { categoryId:       dto.categoryId }),
        ...(dto.collectionId     !== undefined && { collectionId:     dto.collectionId }),

        ...(dto.price        !== undefined && { price:        dto.price }),
        ...(dto.comparePrice !== undefined && { comparePrice: dto.comparePrice }),
        ...(dto.costPrice    !== undefined && { costPrice:    dto.costPrice }),

        ...(dto.stockQuantity     !== undefined && { stockQuantity:     dto.stockQuantity }),
        ...(dto.lowStockThreshold !== undefined && { lowStockThreshold: dto.lowStockThreshold }),
        ...(dto.trackInventory    !== undefined && { trackInventory:    dto.trackInventory }),

        ...(dto.status     !== undefined && { status:     dto.status }),
        ...(dto.type       !== undefined && { type:       dto.type }),
        ...(dto.badge      !== undefined && { badge:      dto.badge }),
        ...(dto.difficulty !== undefined && { difficulty: dto.difficulty }),
        ...(dto.featured   !== undefined && { featured:   dto.featured }),

        ...(dto.isHandmade               !== undefined && { isHandmade:               dto.isHandmade }),
        ...(dto.isSustainable            !== undefined && { isSustainable:            dto.isSustainable }),
        ...(dto.isCustomizable           !== undefined && { isCustomizable:           dto.isCustomizable }),
        ...(dto.isPersonalizable         !== undefined && { isPersonalizable:         dto.isPersonalizable }),
        ...(dto.madeToOrder              !== undefined && { madeToOrder:              dto.madeToOrder }),
        ...(dto.estimatedProductionDays  !== undefined && { estimatedProductionDays:  dto.estimatedProductionDays }),
        ...(dto.estimatedShippingDays    !== undefined && { estimatedShippingDays:    dto.estimatedShippingDays }),
        ...(dto.estimatedTime            !== undefined && { estimatedTime:            dto.estimatedTime }),

        ...(dto.materials         !== undefined && { materials:         dto.materials }),
        ...(dto.materialsIncluded !== undefined && { materialsIncluded: dto.materialsIncluded }),
        ...(dto.technique         !== undefined && { technique:         dto.technique }),
        ...(dto.careInstructions  !== undefined && { careInstructions:  dto.careInstructions }),
        ...(dto.origin            !== undefined && { origin:            dto.origin }),

        ...(dto.weight     !== undefined && { weight:     dto.weight }),
        ...(dto.dimensions !== undefined && { dimensions: dto.dimensions as Prisma.InputJsonValue }),

        ...(dto.seoTitle       !== undefined && { seoTitle:       dto.seoTitle }),
        ...(dto.seoDescription !== undefined && { seoDescription: dto.seoDescription }),
      },
      include: detailInclude,
    });
  },

  /**
   * Soft delete — sets status to ARCHIVED. Never destroys data.
   */
  archive: async (id: string) => {
    return prisma.product.update({
      where: { id },
      data:  { status: ProductStatus.ARCHIVED },
      select: { id: true, name: true, status: true },
    });
  },

  /**
   * Patch status only.
   */
  updateStatus: async (id: string, status: ProductStatus) => {
    return prisma.product.update({
      where: { id },
      data:  { status },
      select: { id: true, name: true, status: true },
    });
  },

  /**
   * Patch inventory only.
   */
  updateInventory: async (id: string, data: {
    stockQuantity:    number;
    lowStockThreshold?: number;
    trackInventory?:  boolean;
  }) => {
    return prisma.product.update({
      where: { id },
      data:  {
        stockQuantity:    data.stockQuantity,
        ...(data.lowStockThreshold !== undefined && { lowStockThreshold: data.lowStockThreshold }),
        ...(data.trackInventory    !== undefined && { trackInventory:    data.trackInventory }),
      },
      select: { id: true, name: true, stockQuantity: true, lowStockThreshold: true, trackInventory: true },
    });
  },
};
