/**
 * Checkout Routes — Phase 7.1
 * REST Endpoints for Session, Address, Shipping, ETAs, and Server Pricing.
 */

import { Router } from 'express';
import { checkoutController } from '../controllers/checkout.controller';
import { validate } from '../middleware/validate';
import {
  createCheckoutSessionSchema,
  updateCheckoutCustomerSchema,
  updateCheckoutAddressSchema,
  updateCheckoutShippingSchema,
} from '../validators/checkout.validator';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Protect all checkout endpoints — guests must authenticate
router.use(requireAuth);

// Session management & summaries
router.post('/session', validate(createCheckoutSessionSchema), checkoutController.createOrResumeSession);
router.get('/summary', checkoutController.getSummary);

// Information & Customer step
router.patch('/customer', validate(updateCheckoutCustomerSchema), checkoutController.updateCustomerInfo);

// Address step
router.patch('/address', validate(updateCheckoutAddressSchema), checkoutController.updateAddresses);

// Shipping step & ETAs
router.get('/shipping-methods', checkoutController.listShippingMethods);
router.patch('/shipping', validate(updateCheckoutShippingSchema), checkoutController.updateShippingMethod);

export default router;
