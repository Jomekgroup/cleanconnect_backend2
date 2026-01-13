
import { Router } from 'express';
import * as chatController from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect as any, chatController.getChats as any);
router.get('/:chatId/messages', protect as any, chatController.getChatMessages as any);
router.post('/:chatId/messages', protect as any, chatController.sendMessage as any);

export default router;
