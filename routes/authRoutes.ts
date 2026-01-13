
import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/register', authController.register as any);
router.post('/login', authController.login as any);
router.post('/forgot-password', authController.forgotPassword as any);

export default router;
