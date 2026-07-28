import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { reviewController } from '../controllers/review.controller';

const router = Router();

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Authenticated user routes
router.use(requireAuth);
router.post('/', reviewController.createOrUpdateReview);
router.post('/:reviewId/vote', reviewController.voteHelpful);
router.get('/my-reviews', reviewController.getMyReviews);

export default router;
