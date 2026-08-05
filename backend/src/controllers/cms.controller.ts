/**
 * CMS Controller — Phase 9 (CMS Phase 1)
 * Manages CMS configuration stored in the StudioSettings singleton.
 * Uses the same upsert({ where: { singleton: true } }) pattern as settingsController.
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';

const SINGLETON_WHERE = { singleton: true };

const VALID_HERO_TEMPLATES = [1, 2, 3] as const;
type HeroTemplate = typeof VALID_HERO_TEMPLATES[number];

export const cmsController = {
  /**
   * GET /api/v1/cms/hero-config
   * Public endpoint — no auth required. Returns the active hero template ID.
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
};
