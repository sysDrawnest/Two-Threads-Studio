import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { Role } from '@prisma/client';
import {
  adminListOrders,
  adminGetOrder,
  adminUpdateStatus,
  adminUpdateNote,
} from '../controllers/order.controller';
import {
  adminUpdateOrderStatusSchema,
  adminUpdateOrderNoteSchema,
} from '../validators/order.validator';

const router = Router();

// Admin endpoints require auth and ADMIN role
router.use(requireAuth);
router.use(requireRole(Role.ADMIN));

router.get('/', adminListOrders);
router.get('/:id', adminGetOrder);
router.patch('/:id/status', validate(adminUpdateOrderStatusSchema), adminUpdateStatus);
router.patch('/:id/note', validate(adminUpdateOrderNoteSchema), adminUpdateNote);

export default router;
