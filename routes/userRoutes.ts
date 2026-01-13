
import { Router } from 'express';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/me', protect as any, userController.getMe as any);
router.post('/update', protect as any, userController.updateProfile as any);
router.post('/change-password', protect as any, userController.changePassword as any);

export default router;
