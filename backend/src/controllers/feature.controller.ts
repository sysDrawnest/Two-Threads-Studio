/**
 * Feature Flags Controller — Launch Control & Module Visibility
 *
 * Provides public read access to active feature flags (e.g. LEARNING_HUB)
 * and admin-authenticated mutation access to enable/disable features in DB.
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse, errorResponse } from '../utils/response';

const SINGLETON_WHERE = { singleton: true };

export const featureController = {
  /**
   * Public: Get public feature configuration
   * Unauthenticated endpoint for customer storefront & initial app boot.
   */
  getPublicFeatures: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await prisma.studioSettings.findUnique({
        where: SINGLETON_WHERE,
        select: { learningHubEnabled: true },
      });

      if (!settings) {
        settings = await prisma.studioSettings.create({
          data: {},
          select: { learningHubEnabled: true },
        });
      }

      return successResponse(res, {
        LEARNING_HUB: Boolean(settings.learningHubEnabled),
      });
    } catch (err) {
      // Safe Fallback: In case of database error, return LEARNING_HUB: false
      return successResponse(res, {
        LEARNING_HUB: false,
      });
    }
  },

  /**
   * Admin: Update specific feature flag
   * Requires Admin JWT Authentication.
   */
  updateFeatureFlag: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key } = req.params;
      const { enabled } = req.body;

      if (typeof enabled !== 'boolean') {
        return errorResponse(res, 'Field "enabled" must be a boolean (true/false)', 400);
      }

      if (key === 'LEARNING_HUB') {
        const updated = await prisma.studioSettings.upsert({
          where: SINGLETON_WHERE,
          create: { learningHubEnabled: enabled },
          update: { learningHubEnabled: enabled },
        });

        return successResponse(
          res,
          { LEARNING_HUB: Boolean(updated.learningHubEnabled) },
          `Learning Hub feature has been turned ${enabled ? 'ON' : 'OFF'}`
        );
      }

      return errorResponse(res, `Unknown feature flag key: "${key}"`, 400);
    } catch (err) {
      next(err);
    }
  },
};
