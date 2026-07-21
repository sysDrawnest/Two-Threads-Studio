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
  logoutAll,
} from '../controllers/auth.controller';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_ATTEMPTS',
    message: 'Too many failed login attempts. Please try again in 15 minutes.',
  },
  handler: (_req, res, _next, options) => {
    res.status(429).json(options.message);
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
router.post('/logout-all', requireAuth, logoutAll);

export default router;
