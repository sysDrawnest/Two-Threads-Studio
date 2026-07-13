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
} from '../controllers/order.controller';
import {
  createOrderSchema,
  cancelOrderSchema,
} from '../validators/order.validator';

const router = Router();

// Customer order endpoints require authentication
router.use(requireAuth);

router.post('/', idempotencyMiddleware, validate(createOrderSchema), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', validate(cancelOrderSchema), cancelOrder);
router.get('/:id/invoice', downloadInvoice);

export default router;
