import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller';

const router = Router();

// Define API v1 routes here
router.get('/health', checkHealth);

export default router;
