/**
 * Developer Shipping Utilities Router
 *
 * Exposes QA and development testing endpoints to simulate webhooks, advance shipment
 * states, trigger RTO flows, and reset shipments without external provider credentials.
 *
 * SECURITY: Active ONLY when NODE_ENV !== 'production'.
 * Route prefix: /api/v1/dev/shipping
 */

import { Router, Request, Response } from 'express';
import { shippingSimulator } from '../services/shippingSimulator.service';
import type { MockShippingEvent } from '../services/shippingSimulator.service';
import { shipmentService } from '../services/shipment.service';
import { successResponse } from '../utils/response';
import logger from '../lib/logger';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// Security Guard
// ─────────────────────────────────────────────────────────────────────────────

router.use((_req: Request, res: Response, next) => {
  if (process.env['NODE_ENV'] === 'production') {
    logger.warn('[DevShippingRoutes] Attempt to access developer shipping routes in production rejected');
    return res.status(403).json({ error: 'Developer utilities are disabled in production' });
  }
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Utility Routes
// ─────────────────────────────────────────────────────────────────────────────

/** POST /api/v1/dev/shipping/advance — Advance shipment state by 1 step */
router.post('/advance', async (req: Request, res: Response, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId is required' });

    const result = await shippingSimulator.advanceState(orderId);
    return successResponse(res, result, 'Shipment advanced to next state');
  } catch (err) {
    next(err);
  }
});

/** POST /api/v1/dev/shipping/webhook — Trigger arbitrary webhook event */
router.post('/webhook', async (req: Request, res: Response, next) => {
  try {
    const { orderId, event, location } = req.body;
    if (!orderId || !event) {
      return res.status(400).json({ error: 'orderId and event are required' });
    }

    const result = await shippingSimulator.emitWebhookEvent(
      orderId,
      event as MockShippingEvent,
      location
    );
    return successResponse(res, result, `Emitted webhook event: ${event}`);
  } catch (err) {
    next(err);
  }
});

/** POST /api/v1/dev/shipping/simulate-full-history — Generate complete 5-step event timeline */
router.post('/simulate-full-history', async (req: Request, res: Response, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId is required' });

    const result = await shippingSimulator.simulateFullHistory(orderId);
    return successResponse(res, result, 'Full tracking history simulated');
  } catch (err) {
    next(err);
  }
});

/** POST /api/v1/dev/shipping/simulate-rto — Trigger RTO (Return to Origin) flow */
router.post('/simulate-rto', async (req: Request, res: Response, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId is required' });

    const res1 = await shippingSimulator.emitWebhookEvent(orderId, 'FAILED_DELIVERY');
    const res2 = await shippingSimulator.emitWebhookEvent(orderId, 'RTO_INITIATED');
    const res3 = await shippingSimulator.emitWebhookEvent(orderId, 'RTO_IN_TRANSIT');
    const res4 = await shippingSimulator.emitWebhookEvent(orderId, 'RTO_DELIVERED');

    return successResponse(
      res,
      [res1, res2, res3, res4],
      'Simulated complete RTO sequence'
    );
  } catch (err) {
    next(err);
  }
});

/** POST /api/v1/dev/shipping/reset — Reset shipment to PACKING state */
router.post('/reset', async (req: Request, res: Response, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId is required' });

    const result = await shippingSimulator.resetShipment(orderId);
    return successResponse(res, result, 'Shipment reset successfully');
  } catch (err) {
    next(err);
  }
});

/** GET /api/v1/dev/shipping/active-provider — Query current active provider & capabilities */
router.get('/active-provider', async (_req: Request, res: Response, next) => {
  try {
    const health = await shipmentService.getProviderHealth();
    return successResponse(res, health);
  } catch (err) {
    next(err);
  }
});

export default router;
