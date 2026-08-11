/**
 * Feature Flags & Maintenance Controller
 *
 * Provides public read access to active feature flags (LEARNING_HUB, MAINTENANCE_MODE)
 * and dedicated public/admin maintenance mode endpoints.
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
        select: { learningHubEnabled: true, maintenanceMode: true },
      });

      if (!settings) {
        settings = await prisma.studioSettings.create({
          data: {},
          select: { learningHubEnabled: true, maintenanceMode: true },
        });
      }

      return successResponse(res, {
        LEARNING_HUB: Boolean(settings.learningHubEnabled),
        MAINTENANCE_MODE: Boolean(settings.maintenanceMode),
      });
    } catch (err) {
      // Safe Fallback: Fail open on database error
      return successResponse(res, {
        LEARNING_HUB: false,
        MAINTENANCE_MODE: false,
      });
    }
  },

  /**
   * Public: Get standalone public maintenance mode status
   * Light, unauthenticated, fail-open status check.
   */
  getMaintenanceStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await prisma.studioSettings.findUnique({
        where: SINGLETON_WHERE,
        select: { maintenanceMode: true },
      });

      if (!settings) {
        settings = await prisma.studioSettings.create({
          data: {},
          select: { maintenanceMode: true },
        });
      }

      return res.status(200).json({
        maintenanceMode: Boolean(settings.maintenanceMode),
      });
    } catch (err) {
      // Safe Fail-Open Strategy: DB/API error -> maintenanceMode = false
      return res.status(200).json({
        maintenanceMode: false,
      });
    }
  },

  /**
   * Admin: Update maintenance mode status
   * Requires Admin JWT Authentication.
   */
  updateMaintenanceMode: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { maintenanceMode } = req.body;

      if (typeof maintenanceMode !== 'boolean') {
        return errorResponse(res, 'Field "maintenanceMode" must be a boolean (true/false)', 400);
      }

      const updated = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { maintenanceMode },
        update: { maintenanceMode },
      });

      console.log(`[LOG] ADMIN ${req.user?.id || 'session'} set Maintenance Mode to: ${updated.maintenanceMode}`);

      return res.status(200).json({
        success: true,
        maintenanceMode: Boolean(updated.maintenanceMode),
        message: `Website Maintenance Mode has been turned ${updated.maintenanceMode ? 'ON' : 'OFF'}`,
      });
    } catch (err) {
      next(err);
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

      if (key === 'MAINTENANCE_MODE') {
        const updated = await prisma.studioSettings.upsert({
          where: SINGLETON_WHERE,
          create: { maintenanceMode: enabled },
          update: { maintenanceMode: enabled },
        });

        return successResponse(
          res,
          { MAINTENANCE_MODE: Boolean(updated.maintenanceMode) },
          `Maintenance Mode has been turned ${enabled ? 'ON' : 'OFF'}`
        );
      }

      return errorResponse(res, `Unknown feature flag key: "${key}"`, 400);
    } catch (err) {
      next(err);
    }
  },
};
