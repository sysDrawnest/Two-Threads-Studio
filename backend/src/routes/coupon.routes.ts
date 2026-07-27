/**
 * Coupon Routes — Phase 7.2
 * Public endpoints for applying, removing, validating, and listing coupons.
 */

import { Router } from 'express';
import { couponController } from '../controllers/coupon.controller';
import { validate } from '../middleware/validate';
import { applyCouponSchema, removeCouponSchema, validateCouponSchema } from '../validators/coupon.validator';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(optionalAuth);

router.post('/apply', validate(applyCouponSchema), couponController.applyCoupon);
router.post('/remove', validate(removeCouponSchema), couponController.removeCoupon);
router.post('/validate', validate(validateCouponSchema), couponController.validateCoupon);
router.get('/available', couponController.getAvailableCoupons);

export default router;
