/**
 * Checkout Controller — Phase 7.1
 * Exposes enterprise checkout endpoints for session management, customer validation,
 * address linking, shipping selection, delivery ETAs, and server-authoritative summaries.
 */

import { Request, Response, NextFunction } from 'express';
import { checkoutService } from '../services/checkout.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { deliveryEtaEngine } from '../engines/DeliveryEtaEngine';
import prisma from '../prisma';

export const checkoutController = {
  /**
   * POST /api/v1/checkout/session
   * Create or resume an active checkout session.
   */
  createOrResumeSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const sessionToken = (req.body?.sessionToken || req.query?.sessionToken) as string;

      const session = await checkoutService.getOrCreateSession(userId, sessionToken);
      return successResponse(res, { session }, 'Checkout session active', HTTP_STATUS.OK);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/checkout/summary
   * Fetch live server-calculated pricing, ETAs, shipping methods, and session details.
   */
  getSummary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const sessionToken = (req.query?.sessionToken || req.headers['x-session-token']) as string;

      const summary = await checkoutService.getCheckoutSummary(sessionToken, userId);
      return successResponse(res, summary, 'Checkout summary retrieved');
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/v1/checkout/customer
   * Update guest/registered contact info on session.
   */
  updateCustomerInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = (req.body?.sessionToken || req.headers['x-session-token']) as string;
      const updated = await checkoutService.updateCustomerInfo(sessionToken, req.body);
      return successResponse(res, { session: updated }, 'Contact information updated');
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/v1/checkout/address
   * Link shipping and billing addresses to session.
   */
  updateAddresses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = (req.body?.sessionToken || req.headers['x-session-token']) as string;
      const updated = await checkoutService.updateAddresses(sessionToken, req.body);
      return successResponse(res, { session: updated }, 'Shipping address updated');
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/v1/checkout/shipping
   * Select shipping method & recalculate ETAs & server pricing.
   */
  updateShippingMethod: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = (req.body?.sessionToken || req.headers['x-session-token']) as string;
      const updated = await checkoutService.updateShippingMethod(sessionToken, req.body);
      return successResponse(res, { session: updated }, 'Shipping method selected');
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/checkout/shipping-methods
   * List available shipping methods and delivery ETAs.
   */
  listShippingMethods: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkoutService.ensureDefaultShippingMethods();
      const methods = await prisma.shippingMethod.findMany({
        where: { isEnabled: true },
        orderBy: { priority: 'desc' },
      });

      const eta = await deliveryEtaEngine.calculateEta();

      return successResponse(res, { methods, eta }, 'Shipping methods retrieved');
    } catch (err) {
      next(err);
    }
  },
};
