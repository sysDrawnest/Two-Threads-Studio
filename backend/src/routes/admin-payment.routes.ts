import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { shipmentController } from '../controllers/shipment.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { adminRefundSchema } from '../validators/payment.validator';
import { Role } from '@prisma/client';

const router = Router();

// All admin payment routes require auth + ADMIN role
router.use(requireAuth, requireRole(Role.ADMIN));

// List all payments with pagination + filter by status
router.get('/', paymentController.adminListPayments);

// Process refund for a captured payment
router.post(
  '/:paymentId/refund',
  validate(adminRefundSchema),
  paymentController.adminProcessRefund
);

// Admin shipment management
router.post('/orders/:orderId/ship', shipmentController.adminCreateShipment);
router.patch('/orders/:orderId/ship/mark-shipped', shipmentController.adminMarkShipped);
router.patch('/orders/:orderId/ship/mark-delivered', shipmentController.adminMarkDelivered);

export default router;
