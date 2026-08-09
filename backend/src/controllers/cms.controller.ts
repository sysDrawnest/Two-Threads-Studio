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

export const cmsController = {
  /**
   * GET /api/v1/cms/hero-config
   * Public endpoint — returns the active hero template ID.
   */
  getHeroConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await prisma.studioSettings.findUnique({ where: SINGLETON_WHERE });
      if (!settings) {
        settings = await prisma.studioSettings.create({ data: {} });
      }

      return successResponse(res, {
        activeTemplate: settings.activeHeroTemplate ?? 1,
      });
    } catch (err) {
      next(err);
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
      let settings = await prisma.studioSettings.findUnique({ where: SINGLETON_WHERE });
      if (!settings) {
        settings = await prisma.studioSettings.create({ data: {} });
      }

      return successResponse(res, {
        activeHeroTemplate: settings.activeHeroTemplate ?? 1,
        bestSellersConfig: settings.homepageBestSellersConfig || { productIds: [], limit: 8, enabled: true },
        newArrivalsConfig: settings.homepageNewArrivalsConfig || { productIds: [], limit: 4, enabled: true },
        menswearConfig: settings.homepageMenswearConfig || { productIds: [], title: 'Premium Menswear Collection', enabled: true },
        womenswearConfig: settings.homepageWomenswearConfig || { productIds: [], title: 'Premium Womenswear Collection', enabled: true },
        categoriesConfig: settings.homepageCategoriesConfig || DEFAULT_CATEGORIES,
      });
    } catch (err) {
      next(err);
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
      } = req.body;

      const updateData: any = {};
      if (activeHeroTemplate !== undefined) updateData.activeHeroTemplate = activeHeroTemplate;
      if (bestSellersConfig !== undefined) updateData.homepageBestSellersConfig = bestSellersConfig;
      if (newArrivalsConfig !== undefined) updateData.homepageNewArrivalsConfig = newArrivalsConfig;
      if (menswearConfig !== undefined) updateData.homepageMenswearConfig = menswearConfig;
      if (womenswearConfig !== undefined) updateData.homepageWomenswearConfig = womenswearConfig;
      if (categoriesConfig !== undefined) updateData.homepageCategoriesConfig = categoriesConfig;

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
        },
        'Homepage CMS configuration updated successfully'
      );
    } catch (err) {
      next(err);
    }
  },
};
