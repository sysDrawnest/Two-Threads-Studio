import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  getProfile,
  updateProfile,
  getDashboardSummary,
} from '../controllers/profile.controller';
import { updateProfileSchema } from '../validators/profile.validator';

const router = Router();

// Apply authentication middleware to all profile routes
router.use(requireAuth);

router.get('/', getProfile);
router.put('/', validate(updateProfileSchema), updateProfile);
router.get('/dashboard', getDashboardSummary);

export default router;
