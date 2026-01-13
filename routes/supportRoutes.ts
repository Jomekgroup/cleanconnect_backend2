
import { Router } from 'express';
import * as supportController from '../controllers/supportController';
import { protect } from '../middleware/authMiddleware';
import { supportAdmin } from '../middleware/adminMiddleware';

const router = Router();

// User routes
router.post('/tickets', protect as any, supportController.createTicket as any);
router.get('/tickets', protect as any, supportController.getUserTickets as any);

// Admin routes
router.get('/admin/tickets', protect as any, supportAdmin as any, supportController.getAllTickets as any);
router.post('/admin/tickets/:id/resolve', protect as any, supportAdmin as any, supportController.resolveTicket as any);

export default router;
