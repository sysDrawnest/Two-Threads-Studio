import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { idempotencyMiddleware } from '../middleware/idempotency';
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  downloadInvoice,
  requestReturn,
  getShipmentTracking,
} from '../controllers/order.controller';
import {
  createOrderSchema,
  cancelOrderSchema,
  returnOrderSchema,
} from '../validators/order.validator';

const router = Router();

// Customer order endpoints require authentication
router.use(requireAuth);

router.post('/', idempotencyMiddleware, validate(createOrderSchema), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', validate(cancelOrderSchema), cancelOrder);
router.get('/:id/invoice', downloadInvoice);
router.post('/:id/return', validate(returnOrderSchema), requestReturn);
router.get('/:id/shipment', getShipmentTracking);

export default router;
