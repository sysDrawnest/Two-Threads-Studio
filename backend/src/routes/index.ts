import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller';
import authRoutes       from './auth.routes';
import productRoutes    from './product.routes';
import categoryRoutes   from './category.routes';
import collectionRoutes from './collection.routes';
import profileRoutes    from './profile.routes';

const router = Router();

// Health
router.get('/health', checkHealth);

// Authentication (Phase 2)
router.use('/auth', authRoutes);

// Catalog (Phase 3)
router.use('/products',    productRoutes);
router.use('/categories',  categoryRoutes);
router.use('/collections', collectionRoutes);

// Profile (Phase 4A)
router.use('/profile',     profileRoutes);

// Commerce (Phase 4B)
import addressRoutes from './address.routes';
import wishlistRoutes from './wishlist.routes';
import cartRoutes from './cart.routes';

router.use('/addresses', addressRoutes);
router.use('/wishlist',  wishlistRoutes);
router.use('/cart',      cartRoutes);

// Order Management (Phase 5A)
import orderRoutes from './order.routes';
import adminOrderRoutes from './admin-order.routes';

router.use('/orders',       orderRoutes);
router.use('/admin/orders', adminOrderRoutes);

// Payment & Fulfillment (Phase 5B & 7.4)
import paymentRoutes from '../payment/payment.routes';
import adminPaymentRoutes from './admin-payment.routes';

router.use('/payments',       paymentRoutes);
router.use('/admin/payments', adminPaymentRoutes);


// Trust & Risk Management (Phase 5C)
import { riskRoutes, adminRiskRoutes } from './risk.routes';

router.use('/risk',       riskRoutes);
router.use('/admin/risk', adminRiskRoutes);

// Phase 6A — Admin Commerce Platform
import adminRoutes from './admin.routes';
import devRoutes from './dev.routes';
import uploadRoutes from './upload.routes';

router.use('/admin',  adminRoutes);
router.use('/dev',    devRoutes);
router.use('/upload', uploadRoutes);

// Phase 7.1 — Checkout Engine
import checkoutRoutes from './checkout.routes';

router.use('/checkout', checkoutRoutes);

// Phase 7.2 — Promotions & Coupon Engine
import couponRoutes from './coupon.routes';
import reviewRoutes from './review.routes';

router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);

// Phase 10 — Bulk Product Import & Export Engine
import importRoutes from './import.routes';

router.use('/admin/import', importRoutes);

// Shipping Engine (Provider-Agnostic Logistics)
import { customerShipmentRouter, adminShipmentRouter } from './shipment.routes';
import devShippingRouter from './devShipping.routes';

router.use('/shipments',       customerShipmentRouter);
router.use('/admin/shipments', adminShipmentRouter);
router.use('/dev/shipping',    devShippingRouter);

// CMS Engine (Phase 9 — CMS Phase 1)
import { publicCmsRouter, adminCmsRouter } from './cms.routes';

router.use('/cms',       publicCmsRouter);
router.use('/admin/cms', adminCmsRouter);

// Feature Flags Launch Control
import { publicFeatureRouter, adminFeatureRouter } from './feature.routes';

router.use('/features',       publicFeatureRouter);
router.use('/admin/features', adminFeatureRouter);

export default router;







