
import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import * as reviewController from '../controllers/reviewController';
import * as paymentController from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Standard Booking operations
router.post('/', protect as any, bookingController.createBooking as any);
router.get('/', protect as any, bookingController.getUserBookings as any);
router.post('/:id/cancel', protect as any, bookingController.cancelBooking as any);
router.post('/:id/complete', protect as any, bookingController.completeBooking as any);

// Domain specific booking sub-routes (Matching apiService.ts calls)
router.post('/:bookingId/review', protect as any, reviewController.submitReview as any);
router.post('/:id/receipt', protect as any, paymentController.uploadReceipt as any);

export default router;
