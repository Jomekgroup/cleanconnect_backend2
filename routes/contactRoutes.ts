
import { Router } from 'express';
import * as contactController from '../controllers/contactController';

const router = Router();

router.post('/', contactController.handleContactForm as any);

export default router;
