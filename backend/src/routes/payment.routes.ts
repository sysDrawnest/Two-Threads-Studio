import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { shipmentController } from '../controllers/shipment.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  createRazorpayOrderSchema,
  verifyPaymentSchema,
  confirmCodSchema,
} from '../validators/payment.validator';

const router = Router();

// All customer payment routes require auth
router.use(requireAuth);

// Razorpay order creation (before popup)
router.post(
  '/orders/:orderId/razorpay-order',
  validate(createRazorpayOrderSchema),
  paymentController.createRazorpayOrder
);

// Payment verification (after popup success)
router.post(
  '/orders/:orderId/verify',
  validate(verifyPaymentSchema),
  paymentController.verifyPayment
);

// COD confirmation
router.post(
  '/orders/:orderId/cod',
  validate(confirmCodSchema),
  paymentController.confirmCodOrder
);

// Get payment status for an order
router.get('/orders/:orderId', paymentController.getPaymentStatus);

// Shipment tracking for a customer order
router.get('/orders/:orderId/shipment', shipmentController.getShipment);
router.get('/orders/:orderId/shipment/tracking', shipmentController.getLiveTracking);

export default router;
