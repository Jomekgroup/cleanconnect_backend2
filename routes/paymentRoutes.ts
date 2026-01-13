
import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';
import { paymentAdmin } from '../middleware/adminMiddleware';

const router = Router();

// Public/Client routes
router.post('/:id/receipt', protect as any, paymentController.uploadReceipt as any);

// Admin routes
router.post('/:id/confirm', protect as any, paymentAdmin as any, paymentController.confirmPayment as any);
router.post('/:id/pay', protect as any, paymentAdmin as any, paymentController.markAsPaid as any);

export default router;
