import { Request, Response, NextFunction } from 'express';
import { shipmentService } from '../services/shipment.service';
import { successResponse } from '../utils/response';

export const shipmentController = {
  /** Customer: Get shipment details for their own order */
  getShipment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await shipmentService.getShipmentForOrder(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, shipment);
    } catch (err) {
      next(err);
    }
  },

  /** Customer: Get live tracking data from the provider */
  getLiveTracking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tracking = await shipmentService.getLiveTracking(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, tracking);
    } catch (err) {
      next(err);
    }
  },

  /** Customer: Get shipment event timeline for their own order */
  getTimeline: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const timeline = await shipmentService.getTimeline(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, timeline);
    } catch (err) {
      next(err);
    }
  },

  // ─── Admin ────────────────────────────────────────────────────────────────

  adminCreateShipment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await shipmentService.createShipment(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, shipment, 'Shipment created');
    } catch (err) {
      next(err);
    }
  },

  adminMarkShipped: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await shipmentService.markShipped(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, shipment, 'Order marked as shipped');
    } catch (err) {
      next(err);
    }
  },

  adminMarkDelivered: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await shipmentService.markDelivered(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, shipment, 'Order marked as delivered');
    } catch (err) {
      next(err);
    }
  },

  /** Admin: Get full shipment event timeline for any order */
  adminGetTimeline: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const timeline = await shipmentService.getTimeline(req.params['orderId'] as string);
      return successResponse(res, timeline);
    } catch (err) {
      next(err);
    }
  },

  /** Admin: Provider health check — auth status, latency, capabilities */
  adminProviderHealth: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const health = await shipmentService.getProviderHealth();
      return successResponse(res, health);
    } catch (err) {
      next(err);
    }
  },

  /** Admin: Get active provider capabilities map (for dynamic UI rendering) */
  adminGetCapabilities: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const capabilities = shipmentService.getCapabilities();
      return successResponse(res, capabilities);
    } catch (err) {
      next(err);
    }
  },
};
