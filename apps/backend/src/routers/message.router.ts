import { Router } from 'express';
import catchAsync from '../utils/catchAsync';
import messageControllers from '../controllers/message.controller';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = Router();

router.get(
  '/',
  AuthMiddleware,
  catchAsync(messageControllers.getGeneralRoomMessages),
);
router.post('/', AuthMiddleware, catchAsync(messageControllers.create));
router.delete(
  '/',
  AuthMiddleware,
  catchAsync(messageControllers.deleteMessage),
);

export default router;
