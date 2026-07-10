import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller';
import authRoutes from './auth.routes';

const router = Router();

// Health
router.get('/health', checkHealth);

// Authentication
router.use('/auth', authRoutes);

export default router;
