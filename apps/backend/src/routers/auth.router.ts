import { Router } from 'express';
import authController from '../controllers/auth.controller';
import passport from 'passport';
import AuthMiddleware from '../middlewares/AuthMiddleware'

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/google', authController.getGoogleUrl);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.GOOGLE_FAILTURE_REDIRECT,
    scope: ['profile', 'email'],
  }),
  authController.googleCallback,
);
router.get('/currentUser', AuthMiddleware ,authController.currentUser);

export default router;
