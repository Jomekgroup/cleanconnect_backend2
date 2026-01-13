
import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import * as paymentController from '../controllers/paymentController';
import * as supportController from '../controllers/supportController';
import { protect } from '../middleware/authMiddleware';
import { superAdmin, verificationAdmin, paymentAdmin, supportAdmin } from '../middleware/adminMiddleware';

const router = Router();

// User Management
router.get('/users', protect as any, adminController.getAllUsers as any);
router.delete('/users/:id', protect as any, superAdmin as any, adminController.deleteUser as any);
router.post('/create-admin', protect as any, superAdmin as any, adminController.createAdmin as any);

// Subscription Verification
router.post('/users/:id/subscription/approve', protect as any, verificationAdmin as any, adminController.approveSubscription as any);

// Booking Payment Management
router.post('/bookings/:id/confirm', protect as any, paymentAdmin as any, paymentController.confirmPayment as any);
router.post('/bookings/:id/pay', protect as any, paymentAdmin as any, paymentController.markAsPaid as any);

// Support Ticket Management
router.get('/support/tickets', protect as any, supportAdmin as any, supportController.getAllTickets as any);
router.post('/support/tickets/:id/resolve', protect as any, supportAdmin as any, supportController.resolveTicket as any);

export default router;
