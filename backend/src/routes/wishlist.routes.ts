import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
} from '../controllers/wishlist.controller';
import { addToWishlistSchema, moveToCartSchema } from '../validators/wishlist.validator';

const router = Router();

// Wishlist endpoints require user authentication
router.use(requireAuth);

router.get('/', getWishlist);
router.post('/', validate(addToWishlistSchema), addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.delete('/', clearWishlist);
router.post('/:productId/move-to-cart', validate(moveToCartSchema), moveToCart);

export default router;
