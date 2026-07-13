import { Router } from 'express';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  mergeCart,
} from '../controllers/cart.controller';
import {
  addCartItemSchema,
  updateCartItemSchema,
  mergeCartSchema,
} from '../validators/cart.validator';

const router = Router();

// General cart operations use optional authentication (handles both guest and logged-in user)
router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, validate(addCartItemSchema), addItem);
router.patch('/items/:id', optionalAuth, validate(updateCartItemSchema), updateItem);
router.delete('/items/:id', optionalAuth, removeItem);
router.delete('/', optionalAuth, clearCart);

// Merging carts requires user authentication
router.post('/merge', requireAuth, validate(mergeCartSchema), mergeCart);

export default router;
