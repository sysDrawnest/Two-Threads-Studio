/**
 * Shipment Routes
 *
 * Customer and Admin endpoints for shipping lifecycle, live tracking,
 * pickup scheduling, label/invoice generation, returns, and settings.
 */

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { shipmentController } from '../controllers/shipment.controller';
import { shippingEstimator } from '../services/shippingEstimator.service';
import { successResponse } from '../utils/response';

export const customerShipmentRouter = Router();
export const adminShipmentRouter = Router();

// ─── Customer Routes ────────────────────────────────────────────────────────
customerShipmentRouter.use(requireAuth);

/** Customer: Get shipment details */
customerShipmentRouter.get('/:orderId', shipmentController.getShipment);

/** Customer: Get live tracking from provider */
customerShipmentRouter.get('/:orderId/tracking', shipmentController.getLiveTracking);

/** Customer: Get shipment timeline */
customerShipmentRouter.get('/:orderId/timeline', shipmentController.getTimeline);

/** Customer / Guest: Rate & ETA estimation */
customerShipmentRouter.post('/estimate', async (req, res, next) => {
  try {
    const estimates = await shippingEstimator.estimate({
      originPincode: req.body.originPincode ?? '110001',
      destinationPincode: req.body.destinationPincode,
      weightGrams: req.body.weightGrams ?? 500,
      dimensions: req.body.dimensions ?? { length: 20, breadth: 15, height: 10 },
      isCOD: req.body.isCOD ?? false,
    });
    return successResponse(res, estimates);
  } catch (err) {
    next(err);
  }
});

// ─── Admin Routes ───────────────────────────────────────────────────────────
adminShipmentRouter.use(requireAuth);
adminShipmentRouter.use(requireRole(Role.ADMIN));

/** Admin: Provider health check */
adminShipmentRouter.get('/health', shipmentController.adminProviderHealth);

/** Admin: Get active provider capabilities map */
adminShipmentRouter.get('/capabilities', shipmentController.adminGetCapabilities);

/** Admin: Get shipping settings */
adminShipmentRouter.get('/settings', shipmentController.adminGetSettings);

/** Admin: Update shipping settings */
adminShipmentRouter.put('/settings', shipmentController.adminUpdateSettings);

/** Admin: Create shipment */
adminShipmentRouter.post('/:orderId', shipmentController.adminCreateShipment);

/** Admin: Mark as shipped */
adminShipmentRouter.post('/:orderId/ship', shipmentController.adminMarkShipped);

/** Admin: Mark as delivered */
adminShipmentRouter.post('/:orderId/deliver', shipmentController.adminMarkDelivered);

/** Admin: Schedule courier pickup */
adminShipmentRouter.post('/:orderId/pickup', shipmentController.adminSchedulePickup);

/** Admin: Generate shipping label PDF */
adminShipmentRouter.post('/:orderId/label', shipmentController.adminGenerateLabel);

/** Admin: Generate invoice PDF */
adminShipmentRouter.post('/:orderId/invoice', shipmentController.adminGenerateInvoice);

/** Admin: Cancel shipment */
adminShipmentRouter.post('/:orderId/cancel', shipmentController.adminCancelShipment);

/** Admin: Create return shipment */
adminShipmentRouter.post('/:orderId/return', shipmentController.adminCreateReturnShipment);

/** Admin: Get shipment timeline */
adminShipmentRouter.get('/:orderId/timeline', shipmentController.adminGetTimeline);
