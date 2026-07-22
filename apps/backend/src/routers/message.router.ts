import { Router } from 'express';
import catchAsync from '../utils/catchAsync';
import messageControllers from '../controllers/message.controller';

const router = Router();

router.get('/', catchAsync(messageControllers.getMessages));
router.post('/', catchAsync(messageControllers.create));
router.delete('/', catchAsync(messageControllers.deleteMessage));

export default router;
