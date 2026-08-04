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

  /** Admin: Schedule courier pickup */
  adminSchedulePickup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pickupDate = req.body?.pickupDate ? new Date(req.body.pickupDate) : undefined;
      const result = await shipmentService.schedulePickup(
        req.params['orderId'] as string,
        req.user!.id,
        pickupDate
      );
      return successResponse(res, result, 'Pickup scheduled successfully');
    } catch (err) {
      next(err);
    }
  },

  /** Admin: Generate shipping label PDF */
  adminGenerateLabel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await shipmentService.generateLabel(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, result, 'Label generated');
    } catch (err) {
      next(err);
    }
  },

  /** Admin: Generate invoice PDF */
  adminGenerateInvoice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await shipmentService.generateInvoice(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, result, 'Invoice generated');
    } catch (err) {
      next(err);
    }
  },

  /** Admin: Cancel shipment */
  adminCancelShipment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await shipmentService.cancelShipment(
        req.params['orderId'] as string,
        req.user!.id,
        req.body?.reason
      );
      return successResponse(res, null, 'Shipment cancelled');
    } catch (err) {
      next(err);
    }
  },

  /** Admin: Create return (reverse logistics) shipment */
  adminCreateReturnShipment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await shipmentService.createReturnShipmentForOrder(
        req.params['orderId'] as string,
        req.user!.id
      );
      return successResponse(res, shipment, 'Return shipment created');
    } catch (err) {
      next(err);
    }
  },

  /** Admin: Get shipping settings */
  adminGetSettings: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await shipmentService.getShippingSettings();
      return successResponse(res, settings);
    } catch (err) {
      next(err);
    }
  },

  /** Admin: Update shipping settings */
  adminUpdateSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await shipmentService.updateShippingSettings(req.body);
      return successResponse(res, settings, 'Shipping settings updated');
    } catch (err) {
      next(err);
    }
  },
};

