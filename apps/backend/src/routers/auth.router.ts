import { Router } from 'express';
import authController from '../controllers/auth.controller';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', AuthMiddleware, authController.logout);
router.get('/currentUser', AuthMiddleware, authController.currentUser);

export default router;
