/**
 * CMS Controller — Phase 9 (CMS Engine)
 * Manages CMS configuration stored in the StudioSettings singleton.
 * Controls Hero, Best Sellers, New Arrivals, Menswear, Womenswear, and Shop By Category.
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';

const SINGLETON_WHERE = { singleton: true };

const VALID_HERO_TEMPLATES = [1, 2, 3, 4, 5] as const;
type HeroTemplate = typeof VALID_HERO_TEMPLATES[number];

// Default categories featuring Premium Menswear and Premium Womenswear
const DEFAULT_CATEGORIES = [
  {
    id: 'cat-embroidery',
    name: 'Embroidery Kits',
    slug: 'embroidery-kits',
    image: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop',
    count: 48,
    featured: true,
    visible: true,
    sortOrder: 1,
  },
  {
    id: 'cat-menswear',
    name: 'Premium Menswear',
    slug: 'menswear',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
    count: 35,
    visible: true,
    sortOrder: 2,
  },
  {
    id: 'cat-lippan',
    name: 'Lippan Art',
    slug: 'lippan-art',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=800&auto=format&fit=crop',
    count: 18,
    visible: true,
    sortOrder: 3,
  },
  {
    id: 'cat-macrame',
    name: 'Macramé',
    slug: 'macrame',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    count: 26,
    visible: true,
    sortOrder: 4,
  },
  {
    id: 'cat-handkerchiefs',
    name: 'Handkerchiefs',
    slug: 'handkerchiefs',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop',
    count: 21,
    visible: true,
    sortOrder: 5,
  },
  {
    id: 'cat-womenswear',
    name: 'Premium Womenswear',
    slug: 'womenswear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    count: 42,
    visible: true,
    sortOrder: 6,
  },
  {
    id: 'cat-home-decor',
    name: 'Home Decor',
    slug: 'home-decor',
    image: 'https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=800&auto=format&fit=crop',
    count: 39,
    visible: true,
    sortOrder: 7,
  },
  {
    id: 'cat-gifts',
    name: 'Gift Collection',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    count: 27,
    visible: true,
    sortOrder: 8,
  },
];

export interface CommunityGalleryItem {
  id: string;
  imageUrl: string;
  userHandle: string;
  productName: string;
  productSlug?: string;
  productId?: string;
  tall?: boolean;
  active?: boolean;
  order?: number;
}

const DEFAULT_INSTAGRAM_URL = 'https://instagram.com';

const DEFAULT_COMMUNITY_GALLERY: CommunityGalleryItem[] = [
  {
    id: 'g1',
    imageUrl: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=600&auto=format&fit=crop',
    userHandle: '@priya.stitches',
    productName: 'Meadow Floral Kit',
    productSlug: 'meadow-floral-kit',
    tall: true,
    active: true,
    order: 1,
  },
  {
    id: 'g2',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop',
    userHandle: '@craft.with.neha',
    productName: 'Boho Macramé Hanging',
    productSlug: 'boho-macrame-hanging',
    tall: false,
    active: true,
    order: 2,
  },
  {
    id: 'g3',
    imageUrl: 'https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=600&auto=format&fit=crop',
    userHandle: '@threads.and.tea',
    productName: 'Cottage Garden Bundle',
    productSlug: 'cottage-garden-bundle',
    tall: false,
    active: true,
    order: 3,
  },
  {
    id: 'g4',
    imageUrl: 'https://images.unsplash.com/photo-1617896848219-aab8a02eed8c?q=80&w=600&auto=format&fit=crop',
    userHandle: '@handmade.meera',
    productName: 'Crochet Flower Bunch',
    productSlug: 'crochet-flower-bunch',
    tall: true,
    active: true,
    order: 4,
  },
  {
    id: 'g5',
    imageUrl: 'https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=600&auto=format&fit=crop',
    userHandle: '@slowcraft.life',
    productName: 'Wildflower Hoop',
    productSlug: 'wildflower-hoop',
    tall: false,
    active: true,
    order: 5,
  },
  {
    id: 'g6',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
    userHandle: '@gifted.by.aanya',
    productName: 'Festival Gift Box',
    productSlug: 'festival-gift-box',
    tall: false,
    active: true,
    order: 6,
  },
];

export const cmsController = {
  /**
   * GET /api/v1/cms/hero-config
   * Public endpoint — returns the active hero template ID.
   */
  getHeroConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await prisma.studioSettings.findUnique({
        where: SINGLETON_WHERE,
        select: { activeHeroTemplate: true },
      });
      if (!settings) {
        settings = await prisma.studioSettings.create({
          data: {},
          select: { activeHeroTemplate: true },
        });
      }

      return successResponse(res, {
        activeTemplate: settings.activeHeroTemplate ?? 1,
      });
    } catch (err) {
      // Graceful fallback for storefront: Return default Template 1 instead of HTTP 400 error
      return successResponse(res, {
        activeTemplate: 1,
      });
    }
  },

  /**
   * PATCH /api/v1/admin/cms/hero-config
   * Admin only — updates the active hero template ID.
   */
  updateHeroConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activeTemplate } = req.body;

      if (
        activeTemplate === undefined ||
        activeTemplate === null ||
        !VALID_HERO_TEMPLATES.includes(activeTemplate as HeroTemplate)
      ) {
        res.status(400).json({
          success: false,
          code: 'INVALID_TEMPLATE',
          message: `activeTemplate must be one of: ${VALID_HERO_TEMPLATES.join(', ')}`,
        });
        return;
      }

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { activeHeroTemplate: activeTemplate },
        update: { activeHeroTemplate: activeTemplate },
        select: { activeHeroTemplate: true },
      });

      return successResponse(
        res,
        { activeTemplate: settings.activeHeroTemplate },
        `Hero template updated to Template ${activeTemplate}`
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/cms/homepage-config
   * Public endpoint — returns complete CMS configuration for storefront.
   */
  getHomepageConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await prisma.studioSettings.findUnique({
        where: SINGLETON_WHERE,
        select: {
          activeHeroTemplate: true,
          homepageBestSellersConfig: true,
          homepageNewArrivalsConfig: true,
          homepageMenswearConfig: true,
          homepageWomenswearConfig: true,
          homepageCategoriesConfig: true,
          homepageCommunityGallery: true,
          instagramUrl: true,
        },
      });
      if (!settings) {
        settings = await prisma.studioSettings.create({
          data: {},
          select: {
            activeHeroTemplate: true,
            homepageBestSellersConfig: true,
            homepageNewArrivalsConfig: true,
            homepageMenswearConfig: true,
            homepageWomenswearConfig: true,
            homepageCategoriesConfig: true,
            homepageCommunityGallery: true,
            instagramUrl: true,
          },
        });
      }

      const rawCommunity = (settings.homepageCommunityGallery as unknown as CommunityGalleryItem[]) || DEFAULT_COMMUNITY_GALLERY;
      const activeCommunity = rawCommunity
        .filter((it) => it.active !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      return successResponse(res, {
        activeHeroTemplate: settings.activeHeroTemplate ?? 1,
        bestSellersConfig: settings.homepageBestSellersConfig || { productIds: [], limit: 8, enabled: true },
        newArrivalsConfig: settings.homepageNewArrivalsConfig || { productIds: [], limit: 4, enabled: true },
        menswearConfig: settings.homepageMenswearConfig || { productIds: [], title: 'Premium Menswear Collection', enabled: true },
        womenswearConfig: settings.homepageWomenswearConfig || { productIds: [], title: 'Premium Womenswear Collection', enabled: true },
        categoriesConfig: settings.homepageCategoriesConfig || DEFAULT_CATEGORIES,
        communityGallery: activeCommunity,
        instagramUrl: settings.instagramUrl || DEFAULT_INSTAGRAM_URL,
      });
    } catch (err) {
      // Graceful fallback: Return default configuration instead of HTTP 400
      return successResponse(res, {
        activeHeroTemplate: 1,
        bestSellersConfig: { productIds: [], limit: 8, enabled: true },
        newArrivalsConfig: { productIds: [], limit: 4, enabled: true },
        menswearConfig: { productIds: [], title: 'Premium Menswear Collection', enabled: true },
        womenswearConfig: { productIds: [], title: 'Premium Womenswear Collection', enabled: true },
        categoriesConfig: DEFAULT_CATEGORIES,
        communityGallery: DEFAULT_COMMUNITY_GALLERY,
        instagramUrl: DEFAULT_INSTAGRAM_URL,
      });
    }
  },

  /**
   * PATCH /api/v1/admin/cms/homepage-config
   * Admin only — updates CMS merchandising settings.
   */
  updateHomepageConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        activeHeroTemplate,
        bestSellersConfig,
        newArrivalsConfig,
        menswearConfig,
        womenswearConfig,
        categoriesConfig,
        communityGallery,
        instagramUrl,
      } = req.body;

      const updateData: any = {};
      if (activeHeroTemplate !== undefined) updateData.activeHeroTemplate = activeHeroTemplate;
      if (bestSellersConfig !== undefined) updateData.homepageBestSellersConfig = bestSellersConfig;
      if (newArrivalsConfig !== undefined) updateData.homepageNewArrivalsConfig = newArrivalsConfig;
      if (menswearConfig !== undefined) updateData.homepageMenswearConfig = menswearConfig;
      if (womenswearConfig !== undefined) updateData.homepageWomenswearConfig = womenswearConfig;
      if (categoriesConfig !== undefined) updateData.homepageCategoriesConfig = categoriesConfig;
      if (communityGallery !== undefined) updateData.homepageCommunityGallery = communityGallery;
      if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: updateData,
        update: updateData,
      });

      return successResponse(
        res,
        {
          activeHeroTemplate: settings.activeHeroTemplate,
          bestSellersConfig: settings.homepageBestSellersConfig,
          newArrivalsConfig: settings.homepageNewArrivalsConfig,
          menswearConfig: settings.homepageMenswearConfig,
          womenswearConfig: settings.homepageWomenswearConfig,
          categoriesConfig: settings.homepageCategoriesConfig,
          communityGallery: settings.homepageCommunityGallery,
          instagramUrl: settings.instagramUrl,
        },
        'Homepage CMS configuration updated successfully'
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/cms/community-gallery
   * Public endpoint — returns active community gallery items and Instagram URL.
   */
  getCommunityGallery: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await prisma.studioSettings.findUnique({
        where: SINGLETON_WHERE,
        select: {
          homepageCommunityGallery: true,
          instagramUrl: true,
        },
      });

      const rawItems = (settings?.homepageCommunityGallery as unknown as CommunityGalleryItem[]) || DEFAULT_COMMUNITY_GALLERY;
      const activeItems = rawItems
        .filter((item) => item.active !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      return successResponse(res, {
        items: activeItems,
        instagramUrl: settings?.instagramUrl || DEFAULT_INSTAGRAM_URL,
      });
    } catch (err) {
      return successResponse(res, {
        items: DEFAULT_COMMUNITY_GALLERY,
        instagramUrl: DEFAULT_INSTAGRAM_URL,
      });
    }
  },

  /**
   * GET /api/v1/admin/cms/community-gallery
   * Admin endpoint — returns all community gallery items (active & inactive) and Instagram URL.
   */
  getAdminCommunityGallery: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await prisma.studioSettings.findUnique({
        where: SINGLETON_WHERE,
        select: {
          homepageCommunityGallery: true,
          instagramUrl: true,
        },
      });

      const items = ((settings?.homepageCommunityGallery as unknown as CommunityGalleryItem[]) || DEFAULT_COMMUNITY_GALLERY)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      return successResponse(res, {
        items,
        instagramUrl: settings?.instagramUrl || DEFAULT_INSTAGRAM_URL,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/admin/cms/community-gallery
   * Admin endpoint — creates or updates a single community gallery item.
   */
  upsertCommunityGalleryItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemData: Partial<CommunityGalleryItem> = req.body;

      if (!itemData.imageUrl) {
        res.status(400).json({
          success: false,
          code: 'IMAGE_URL_REQUIRED',
          message: 'Image URL is required',
        });
        return;
      }

      const settings = await prisma.studioSettings.findUnique({
        where: SINGLETON_WHERE,
        select: { homepageCommunityGallery: true },
      });

      let currentItems: CommunityGalleryItem[] = (settings?.homepageCommunityGallery as unknown as CommunityGalleryItem[]) || [...DEFAULT_COMMUNITY_GALLERY];

      let updatedItem: CommunityGalleryItem;

      if (itemData.id) {
        const existingIdx = currentItems.findIndex((it) => it.id === itemData.id);
        if (existingIdx !== -1) {
          updatedItem = {
            ...currentItems[existingIdx],
            ...itemData,
            order: itemData.order !== undefined ? itemData.order : currentItems[existingIdx].order,
          };
          currentItems[existingIdx] = updatedItem;
        } else {
          const maxOrder = currentItems.reduce((max, it) => Math.max(max, it.order ?? 0), 0);
          updatedItem = {
            id: itemData.id,
            imageUrl: itemData.imageUrl,
            userHandle: itemData.userHandle || '',
            productName: itemData.productName || '',
            productSlug: itemData.productSlug || '',
            productId: itemData.productId || '',
            tall: Boolean(itemData.tall),
            active: itemData.active !== undefined ? itemData.active : true,
            order: itemData.order !== undefined ? itemData.order : maxOrder + 1,
          };
          currentItems.push(updatedItem);
        }
      } else {
        const maxOrder = currentItems.reduce((max, it) => Math.max(max, it.order ?? 0), 0);
        updatedItem = {
          id: `cg_${Date.now()}`,
          imageUrl: itemData.imageUrl,
          userHandle: itemData.userHandle || '',
          productName: itemData.productName || '',
          productSlug: itemData.productSlug || '',
          productId: itemData.productId || '',
          tall: Boolean(itemData.tall),
          active: itemData.active !== undefined ? itemData.active : true,
          order: itemData.order !== undefined ? itemData.order : maxOrder + 1,
        };
        currentItems.push(updatedItem);
      }

      await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { homepageCommunityGallery: currentItems as any },
        update: { homepageCommunityGallery: currentItems as any },
      });

      return successResponse(res, { item: updatedItem, items: currentItems }, 'Community gallery item saved');
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/v1/admin/cms/community-gallery/:id
   * Admin endpoint — removes a gallery item by id.
   */
  deleteCommunityGalleryItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const settings = await prisma.studioSettings.findUnique({
        where: SINGLETON_WHERE,
        select: { homepageCommunityGallery: true },
      });

      let currentItems: CommunityGalleryItem[] = (settings?.homepageCommunityGallery as unknown as CommunityGalleryItem[]) || [...DEFAULT_COMMUNITY_GALLERY];
      currentItems = currentItems.filter((it) => it.id !== id);

      await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { homepageCommunityGallery: currentItems as any },
        update: { homepageCommunityGallery: currentItems as any },
      });

      return successResponse(res, { items: currentItems }, 'Community gallery item deleted');
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/v1/admin/cms/community-gallery/reorder
   * Admin endpoint — bulk updates the order of community gallery items.
   */
  reorderCommunityGallery: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemIds, items: reorderedList } = req.body;

      const settings = await prisma.studioSettings.findUnique({
        where: SINGLETON_WHERE,
        select: { homepageCommunityGallery: true },
      });

      let currentItems: CommunityGalleryItem[] = (settings?.homepageCommunityGallery as unknown as CommunityGalleryItem[]) || [...DEFAULT_COMMUNITY_GALLERY];

      if (Array.isArray(reorderedList) && reorderedList.length > 0) {
        currentItems = reorderedList.map((item, idx) => ({ ...item, order: idx + 1 }));
      } else if (Array.isArray(itemIds)) {
        const itemMap = new Map(currentItems.map((it) => [it.id, it]));
        const orderedItems: CommunityGalleryItem[] = [];
        itemIds.forEach((id: string, idx: number) => {
          const item = itemMap.get(id);
          if (item) {
            orderedItems.push({ ...item, order: idx + 1 });
            itemMap.delete(id);
          }
        });
        // append any remaining
        itemMap.forEach((item) => orderedItems.push({ ...item, order: orderedItems.length + 1 }));
        currentItems = orderedItems;
      }

      await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { homepageCommunityGallery: currentItems as any },
        update: { homepageCommunityGallery: currentItems as any },
      });

      return successResponse(res, { items: currentItems }, 'Community gallery order updated');
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/v1/admin/cms/instagram-url
   * Admin endpoint — updates studio Instagram URL.
   */
  updateInstagramUrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { instagramUrl } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { instagramUrl: instagramUrl || DEFAULT_INSTAGRAM_URL },
        update: { instagramUrl: instagramUrl || DEFAULT_INSTAGRAM_URL },
        select: { instagramUrl: true },
      });

      return successResponse(res, { instagramUrl: settings.instagramUrl }, 'Instagram URL updated');
    } catch (err) {
      next(err);
    }
  },
};
