import prisma from '../prisma';
import { Prisma, ProductStatus, HomepageSection, StudioProductType } from '@prisma/client';
import type { 
  ListProductsQuery, 
  AdminListProductsQuery,
  CreateProductDto, 
  UpdateProductDto,
  MediaUpsertDto,
  VariantUpsertDto
} from '../validators/product.validator';

// ─── Shared Includes ───────────────────────────────────────────────────────────

const listInclude = {
  category: { select: { id: true, name: true, slug: true } },
  collection: { select: { id: true, name: true, slug: true } },
  media: {
    where: { isPrimary: true },
    select: { id: true, url: true, altText: true, isPrimary: true, sortOrder: true, type: true },
    orderBy: { sortOrder: 'asc' as const },
    take: 1,
  },
  images: { // Keep for backward compat
    where: { isPrimary: true },
    select: { id: true, url: true, altText: true, isPrimary: true, sortOrder: true },
    orderBy: { sortOrder: 'asc' as const },
    take: 1,
  },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
  _count: { select: { reviews: true } },
} satisfies Prisma.ProductInclude;

const adminListInclude = {
  ...listInclude,
  variants: { select: { id: true, stockQuantity: true } },
} satisfies Prisma.ProductInclude;

const detailInclude = {
  category: { select: { id: true, name: true, slug: true, description: true, image: true } },
  secondaryCategories: { select: { category: { select: { id: true, name: true, slug: true } } } },
  collection: { select: { id: true, name: true, slug: true, description: true, bannerImage: true } },
  additionalCollections: { select: { collection: { select: { id: true, name: true, slug: true } } } },
  media: { orderBy: { sortOrder: 'asc' as const } },
  images: { orderBy: { sortOrder: 'asc' as const } },
  variants: { where: { isActive: true }, orderBy: { name: 'asc' as const } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
  reviews: {
    orderBy: { createdAt: 'desc' as const },
    take: 20,
    include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
  },
  _count: { select: { reviews: true, wishlist: true } },
} satisfies Prisma.ProductInclude;

// ─── Repository ────────────────────────────────────────────────────────────────

export const productRepository = {
  
  // ─── Public Queries ───

  findMany: async (query: ListProductsQuery) => {
    const where: Prisma.ProductWhereInput = { status: ProductStatus.ACTIVE };
    
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { shortDescription: { contains: query.search, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: query.search, mode: 'insensitive' } } } } },
      ];
    }
    if (query.category) where.category = { slug: query.category };
    if (query.collection) where.collection = { slug: query.collection };
    if (query.tag) where.tags = { some: { tag: { slug: query.tag } } };
    if (query.isFeatured) where.isFeatured = true;
    if (query.available) where.stockQuantity = { gt: 0 };
    if (query.studioType) where.studioType = query.studioType;
    if (query.difficulty) where.difficulty = query.difficulty;
    
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: 'desc' }];
    if (query.sort === 'price_asc') orderBy = [{ price: 'asc' }];
    if (query.sort === 'price_desc') orderBy = [{ price: 'desc' }];
    if (query.sort === 'oldest') orderBy = [{ createdAt: 'asc' }];
    if (query.sort === 'popular') orderBy = [{ reviews: { _count: 'desc' } }, { createdAt: 'desc' }];

    const skip = (query.page - 1) * query.limit;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({ where, include: listInclude, orderBy, skip, take: query.limit }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },

  findBySlug: async (slug: string) => {
    return prisma.product.findUnique({ where: { slug }, include: detailInclude });
  },

  findFeatured: async (limit: number = 8) => {
    return prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE, isFeatured: true },
      include: listInclude, orderBy: [{ createdAt: 'desc' }], take: limit,
    });
  },

  findNewArrivals: async (limit: number = 8) => {
    return prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE, isNewArrival: true },
      include: listInclude, orderBy: [{ createdAt: 'desc' }], take: limit,
    });
  },

  findBestSellers: async (limit: number = 8) => {
    return prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE, isBestSeller: true },
      include: listInclude, orderBy: [{ salesCount: 'desc' }, { createdAt: 'desc' }], take: limit,
    });
  },

  // ─── Admin Queries ───

  findManyAdmin: async (query: AdminListProductsQuery) => {
    const where: Prisma.ProductWhereInput = {};
    
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { barcode: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.category) where.category = { id: query.category }; // Admin uses IDs typically
    if (query.collection) where.collection = { id: query.collection };
    if (query.studioType) where.studioType = query.studioType;
    if (query.homepageSection) where.homepageSections = { has: query.homepageSection };

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: 'desc' }];
    if (query.sort === 'price_asc') orderBy = [{ price: 'asc' }];
    if (query.sort === 'price_desc') orderBy = [{ price: 'desc' }];
    if (query.sort === 'oldest') orderBy = [{ createdAt: 'asc' }];
    if (query.sort === 'stock_asc') orderBy = [{ stockQuantity: 'asc' }];
    if (query.sort === 'stock_desc') orderBy = [{ stockQuantity: 'desc' }];
    if (query.sort === 'name_asc') orderBy = [{ name: 'asc' }];
    if (query.sort === 'name_desc') orderBy = [{ name: 'desc' }];

    const skip = (query.page - 1) * query.limit;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({ where, include: adminListInclude, orderBy, skip, take: query.limit }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },

  findByIdAdmin: async (id: string) => {
    return prisma.product.findUnique({ where: { id }, include: detailInclude });
  },

  slugExists: async (slug: string, excludeId?: string): Promise<boolean> => {
    const p = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
    if (!p) return false;
    return !(excludeId && p.id === excludeId);
  },

  // ─── Mutations ───

  create: async (data: { slug: string; dto: CreateProductDto; categoryId: string }) => {
    const { slug, dto, categoryId } = data;
    return prisma.product.create({
      data: {
        name: dto.name, slug, shortDescription: dto.shortDescription, description: dto.description,
        sku: dto.sku, categoryId, collectionId: dto.collectionId,
        price: dto.price, comparePrice: dto.comparePrice, costPrice: dto.costPrice,
        stockQuantity: dto.stockQuantity ?? 0, lowStockThreshold: dto.lowStockThreshold ?? 5, trackInventory: dto.trackInventory ?? true,
        status: dto.status, difficulty: dto.difficulty,
        
        studioType: dto.studioType, homepageSections: dto.homepageSections ?? [],
        isFeatured: dto.isFeatured ?? false, isNewArrival: dto.isNewArrival ?? false,
        isBestSeller: dto.isBestSeller ?? false, isLimitedEdition: dto.isLimitedEdition ?? false,
        isExclusive: dto.isExclusive ?? false, isEcoFriendly: dto.isEcoFriendly ?? false, isDigitalDownload: dto.isDigitalDownload ?? false,
        publishedAt: dto.publishedAt, isVisible: dto.isVisible ?? true, sortOrder: dto.sortOrder ?? 0,
        
        subtitle: dto.subtitle, productStory: dto.productStory, artisanNotes: dto.artisanNotes,
        whatsIncluded: dto.whatsIncluded, barcode: dto.barcode, searchKeywords: dto.searchKeywords ?? [],
        
        isHandmade: dto.isHandmade ?? true, isSustainable: dto.isSustainable ?? false,
        isCustomizable: dto.isCustomizable ?? false, isPersonalizable: dto.isPersonalizable ?? false, madeToOrder: dto.madeToOrder ?? false,
        estimatedProductionDays: dto.estimatedProductionDays, estimatedShippingDays: dto.estimatedShippingDays, estimatedTime: dto.estimatedTime,
        
        materials: dto.materials ?? [], materialsIncluded: dto.materialsIncluded ?? [],
        technique: dto.technique, careInstructions: dto.careInstructions, origin: dto.origin,
        weight: dto.weight, dimensions: dto.dimensions as Prisma.InputJsonValue | undefined,
        
        seoTitle: dto.seoTitle, seoDescription: dto.seoDescription, seoKeywords: dto.seoKeywords,
        ogImageUrl: dto.ogImageUrl, canonicalUrl: dto.canonicalUrl, robotsMeta: dto.robotsMeta ?? 'index,follow',
        
        allowBackorders: dto.allowBackorders ?? false, reservedQuantity: dto.reservedQuantity ?? 0, incomingQuantity: dto.incomingQuantity ?? 0,
        taxClass: dto.taxClass, hsnCode: dto.hsnCode, gstPercent: dto.gstPercent,
        shippingClass: dto.shippingClass, isFreeShipping: dto.isFreeShipping ?? false, isFragile: dto.isFragile ?? false, packageSize: dto.packageSize,
        allowCod: dto.allowCod ?? true,

        tags: { create: (dto.tagIds ?? []).map(tagId => ({ tagId })) },
        secondaryCategories: { create: (dto.secondaryCategoryIds ?? []).map(id => ({ categoryId: id })) },
        additionalCollections: { create: (dto.additionalCollectionIds ?? []).map(id => ({ collectionId: id })) },
      },
      include: detailInclude,
    });
  },

  update: async (id: string, dto: UpdateProductDto, newSlug?: string) => {
    // Note: To update arrays or relations, we generally use specific endpoints or complex nested writes.
    // For simplicity in this `update` method, we'll map top-level scalar fields.
    const data: Prisma.ProductUpdateInput = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(newSlug !== undefined && { slug: newSlug }),
      ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.sku !== undefined && { sku: dto.sku }),
      ...(dto.categoryId !== undefined && { category: { connect: { id: dto.categoryId } } }),
      ...(dto.collectionId !== undefined && { collection: { connect: { id: dto.collectionId } } }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.comparePrice !== undefined && { comparePrice: dto.comparePrice }),
      ...(dto.costPrice !== undefined && { costPrice: dto.costPrice }),
      ...(dto.stockQuantity !== undefined && { stockQuantity: dto.stockQuantity }),
      ...(dto.lowStockThreshold !== undefined && { lowStockThreshold: dto.lowStockThreshold }),
      ...(dto.trackInventory !== undefined && { trackInventory: dto.trackInventory }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.difficulty !== undefined && { difficulty: dto.difficulty }),
      
      ...(dto.studioType !== undefined && { studioType: dto.studioType }),
      ...(dto.homepageSections !== undefined && { homepageSections: dto.homepageSections }),
      ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
      ...(dto.isNewArrival !== undefined && { isNewArrival: dto.isNewArrival }),
      ...(dto.isBestSeller !== undefined && { isBestSeller: dto.isBestSeller }),
      ...(dto.isLimitedEdition !== undefined && { isLimitedEdition: dto.isLimitedEdition }),
      ...(dto.isExclusive !== undefined && { isExclusive: dto.isExclusive }),
      ...(dto.isEcoFriendly !== undefined && { isEcoFriendly: dto.isEcoFriendly }),
      ...(dto.isDigitalDownload !== undefined && { isDigitalDownload: dto.isDigitalDownload }),
      
      ...(dto.publishedAt !== undefined && { publishedAt: dto.publishedAt }),
      ...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
      ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      
      ...(dto.subtitle !== undefined && { subtitle: dto.subtitle }),
      ...(dto.productStory !== undefined && { productStory: dto.productStory }),
      ...(dto.artisanNotes !== undefined && { artisanNotes: dto.artisanNotes }),
      ...(dto.whatsIncluded !== undefined && { whatsIncluded: dto.whatsIncluded }),
      ...(dto.barcode !== undefined && { barcode: dto.barcode }),
      ...(dto.searchKeywords !== undefined && { searchKeywords: dto.searchKeywords }),
      
      ...(dto.isHandmade !== undefined && { isHandmade: dto.isHandmade }),
      ...(dto.isSustainable !== undefined && { isSustainable: dto.isSustainable }),
      ...(dto.isCustomizable !== undefined && { isCustomizable: dto.isCustomizable }),
      ...(dto.isPersonalizable !== undefined && { isPersonalizable: dto.isPersonalizable }),
      ...(dto.madeToOrder !== undefined && { madeToOrder: dto.madeToOrder }),
      ...(dto.estimatedProductionDays !== undefined && { estimatedProductionDays: dto.estimatedProductionDays }),
      ...(dto.estimatedShippingDays !== undefined && { estimatedShippingDays: dto.estimatedShippingDays }),
      ...(dto.estimatedTime !== undefined && { estimatedTime: dto.estimatedTime }),
      
      ...(dto.materials !== undefined && { materials: dto.materials }),
      ...(dto.materialsIncluded !== undefined && { materialsIncluded: dto.materialsIncluded }),
      ...(dto.technique !== undefined && { technique: dto.technique }),
      ...(dto.careInstructions !== undefined && { careInstructions: dto.careInstructions }),
      ...(dto.origin !== undefined && { origin: dto.origin }),
      
      ...(dto.weight !== undefined && { weight: dto.weight }),
      ...(dto.dimensions !== undefined && { dimensions: dto.dimensions as Prisma.InputJsonValue }),
      
      ...(dto.seoTitle !== undefined && { seoTitle: dto.seoTitle }),
      ...(dto.seoDescription !== undefined && { seoDescription: dto.seoDescription }),
      ...(dto.seoKeywords !== undefined && { seoKeywords: dto.seoKeywords }),
      ...(dto.ogImageUrl !== undefined && { ogImageUrl: dto.ogImageUrl }),
      ...(dto.canonicalUrl !== undefined && { canonicalUrl: dto.canonicalUrl }),
      ...(dto.robotsMeta !== undefined && { robotsMeta: dto.robotsMeta }),
      
      ...(dto.allowBackorders !== undefined && { allowBackorders: dto.allowBackorders }),
      ...(dto.reservedQuantity !== undefined && { reservedQuantity: dto.reservedQuantity }),
      ...(dto.incomingQuantity !== undefined && { incomingQuantity: dto.incomingQuantity }),
      
      ...(dto.taxClass !== undefined && { taxClass: dto.taxClass }),
      ...(dto.hsnCode !== undefined && { hsnCode: dto.hsnCode }),
      ...(dto.gstPercent !== undefined && { gstPercent: dto.gstPercent }),
      ...(dto.shippingClass !== undefined && { shippingClass: dto.shippingClass }),
      ...(dto.isFreeShipping !== undefined && { isFreeShipping: dto.isFreeShipping }),
      ...(dto.isFragile !== undefined && { isFragile: dto.isFragile }),
      ...(dto.packageSize !== undefined && { packageSize: dto.packageSize }),
      ...(dto.allowCod !== undefined && { allowCod: dto.allowCod }),
    };

    return prisma.product.update({ where: { id }, data, include: detailInclude });
  },

  // ─── Relations & Media ───

  addMedia: async (productId: string, media: MediaUpsertDto) => {
    return prisma.productMedia.create({
      data: {
        productId,
        type: media.type,
        url: media.url,
        thumbnail: media.thumbnail,
        altText: media.altText,
        caption: media.caption,
        sortOrder: media.sortOrder,
        isPrimary: media.isPrimary,
        width: media.width,
        height: media.height,
      }
    });
  },

  removeMedia: async (mediaId: string) => {
    return prisma.productMedia.delete({ where: { id: mediaId } });
  },

  reorderMedia: async (productId: string, items: { id: string, sortOrder: number }[]) => {
    const tx = items.map(item => prisma.productMedia.update({
      where: { id: item.id },
      data: { sortOrder: item.sortOrder }
    }));
    return prisma.$transaction(tx);
  },

  upsertVariant: async (productId: string, variant: VariantUpsertDto) => {
    if (variant.id) {
      return prisma.productVariant.update({
        where: { id: variant.id },
        data: {
          name: variant.name, value: variant.value, sku: variant.sku,
          priceAdjustment: variant.priceAdjustment, stockQuantity: variant.stockQuantity, isActive: variant.isActive
        }
      });
    } else {
      return prisma.productVariant.create({
        data: {
          productId, name: variant.name, value: variant.value, sku: variant.sku,
          priceAdjustment: variant.priceAdjustment, stockQuantity: variant.stockQuantity, isActive: variant.isActive
        }
      });
    }
  },

  deleteVariant: async (variantId: string) => {
    return prisma.productVariant.delete({ where: { id: variantId } });
  },

  updateSecondaryCategories: async (productId: string, categoryIds: string[]) => {
    await prisma.productSecondaryCategory.deleteMany({ where: { productId } });
    if (categoryIds.length > 0) {
      await prisma.productSecondaryCategory.createMany({
        data: categoryIds.map(categoryId => ({ productId, categoryId }))
      });
    }
  },

  updateAdditionalCollections: async (productId: string, collectionIds: string[]) => {
    await prisma.productAdditionalCollection.deleteMany({ where: { productId } });
    if (collectionIds.length > 0) {
      await prisma.productAdditionalCollection.createMany({
        data: collectionIds.map(collectionId => ({ productId, collectionId }))
      });
    }
  },

  // ─── Bulk Actions ───

  bulkUpdateStatus: async (ids: string[], status: ProductStatus) => {
    return prisma.product.updateMany({ where: { id: { in: ids } }, data: { status } });
  },

  bulkUpdateLabels: async (ids: string[], labels: Partial<Record<'isFeatured'|'isBestSeller'|'isNewArrival', boolean>>) => {
    return prisma.product.updateMany({ where: { id: { in: ids } }, data: labels });
  },

  bulkUpdateCategory: async (ids: string[], categoryId: string) => {
    return prisma.product.updateMany({ where: { id: { in: ids } }, data: { categoryId } });
  },

  bulkUpdateCollection: async (ids: string[], collectionId: string) => {
    return prisma.product.updateMany({ where: { id: { in: ids } }, data: { collectionId } });
  },

  bulkAddHomepageSection: async (ids: string[], section: HomepageSection) => {
    // Prisma currently lacks a way to array_append in updateMany directly across multiple records using push in some versions,
    // so we will fetch, append, and update individually inside a transaction
    const products = await prisma.product.findMany({ where: { id: { in: ids } }, select: { id: true, homepageSections: true } });
    const tx = products.map(p => {
      const newSections = Array.from(new Set([...p.homepageSections, section]));
      return prisma.product.update({ where: { id: p.id }, data: { homepageSections: newSections } });
    });
    return prisma.$transaction(tx);
  },
  
  bulkRemoveHomepageSection: async (ids: string[], section: HomepageSection) => {
    const products = await prisma.product.findMany({ where: { id: { in: ids } }, select: { id: true, homepageSections: true } });
    const tx = products.map(p => {
      const newSections = p.homepageSections.filter(s => s !== section);
      return prisma.product.update({ where: { id: p.id }, data: { homepageSections: newSections } });
    });
    return prisma.$transaction(tx);
  },

  // ─── Analytics ───

  getProductAnalytics: async (id: string) => {
    const [views, wishlistCount, orderCount, revenue] = await Promise.all([
      // Mock views as salesCount * 12 for now since we don't have a view tracker table yet
      prisma.product.findUnique({ where: { id }, select: { salesCount: true } }).then(p => (p?.salesCount || 0) * 12),
      prisma.wishlist.count({ where: { productId: id } }),
      prisma.cartItem.count({ where: { productId: id, cart: { user: { orders: { some: {} } } } } }), // Rough approximation
      // Aggregate revenue from ordered items
      prisma.cartItem.aggregate({
        where: { productId: id, cart: { user: { orders: { some: {} } } } },
        _sum: { unitPrice: true } // Not perfectly accurate as cart items might not mean fulfilled order, but good enough for now
      }).then(r => Number(r._sum.unitPrice || 0))
    ]);

    return { views, wishlistCount, orderCount, revenue };
  }
};
