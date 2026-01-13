
import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Submit via booking is handled in bookingRoutes, 
// but we keep this for general review actions.
router.post('/', protect as any, reviewController.submitReview as any);

// Publicly fetch reviews for a specific cleaner
router.get('/cleaner/:cleanerId', reviewController.getCleanerReviews as any);

export default router;
