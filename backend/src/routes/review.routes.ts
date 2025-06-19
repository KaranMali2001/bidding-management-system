import { Router } from 'express';
import {
  submitReview,
  getSellerReviews,
} from '@/controllers/review.controller';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';
import { reviewSchema } from '@/types/review';

const router = Router();

router.post(
  '/:projectId',
  authenticate('BUYER'),
  validateRequest(reviewSchema),
  submitReview,
);
router.get('/seller/:sellerId', getSellerReviews);

export default router;
