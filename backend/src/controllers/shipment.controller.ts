import { Request, Response, NextFunction } from 'express';
import { shipmentService } from '../services/shipment.service';
import { HTTP_STATUS } from '../constants/httpStatus';
import { successResponse } from '../utils/response';

export const shipmentController = {
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
};
