import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller';
import authRoutes       from './auth.routes';
import productRoutes    from './product.routes';
import categoryRoutes   from './category.routes';
import collectionRoutes from './collection.routes';

const router = Router();

// Health
router.get('/health', checkHealth);

// Authentication (Phase 2)
router.use('/auth', authRoutes);

// Catalog (Phase 3)
router.use('/products',    productRoutes);
router.use('/categories',  categoryRoutes);
router.use('/collections', collectionRoutes);

export default router;
