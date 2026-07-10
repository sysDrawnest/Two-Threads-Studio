import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  changePassword,
} from '../controllers/auth.controller';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// Stricter rate limit for auth routes: 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', validate(refreshSchema), refresh);

// ─── Protected Routes ──────────────────────────────────────────────────────────
router.get('/me', requireAuth, getMe);
router.post('/change-password', requireAuth, validate(changePasswordSchema), changePassword);

export default router;
