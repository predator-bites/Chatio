import { Router } from 'express';
import userController from '../controllers/user.controller';
import catchAsync from '../utils/catchAsync';
import AuthMiddleware from '../middlewares/AuthMiddleware';

export const router = Router();

router.post('/', catchAsync(userController.create));
router.get('/:id/:submitUrl', catchAsync(userController.submit));
router.post('/reset', catchAsync(userController.generatePasswordResetLink));
router.patch(
  '/reset/:id/:passwordChangeUrl',
  catchAsync(userController.changePassword),
);

export default router;
