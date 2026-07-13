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

export default router;
