import { Router } from 'express';
import roomController from '../controllers/room.controller';
import catchAsync from '../utils/catchAsync';
import AuthMiddleware from '../middlewares/AuthMiddleware';

export const router = Router();

router.get(
  '/:roomId/members',
  AuthMiddleware,
  catchAsync(roomController.getMembers),
);
router.get('/:roomId', AuthMiddleware, catchAsync(roomController.getMessages));
router.get('/', AuthMiddleware, catchAsync(roomController.getUserRooms));

router.get(
  '/join/:roomId/:inviteUrl',
  AuthMiddleware,
  catchAsync(roomController.join),
);
router.get(
  '/info/:roomId/:inviteUrl',
  AuthMiddleware,
  catchAsync(roomController.getRoomInfoByInvite),
);
router.post('/', AuthMiddleware, catchAsync(roomController.create));
router.post(
  '/inviteUrl',
  AuthMiddleware,
  catchAsync(roomController.generateInviteUrl),
);
router.delete(
  '/inviteUrl',
  AuthMiddleware,
  catchAsync(roomController.deleteInviteUrl),
);
router.delete(
  '/:roomId',
  AuthMiddleware,
  catchAsync(roomController.deleteRoom),
);
router.delete('/', AuthMiddleware, catchAsync(roomController.leave));

export default router;
