import 'dotenv';

import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import sanitiseUser from '../utils/sanitise';
import { User } from '../../generated/prisma/client';
import ApiError from '../utils/ApiError';
import { IVerifyOptions } from 'passport-local';

const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    (
      err: string | null,
      user: Express.User | null,
      info: IVerifyOptions | null,
    ) => {
      if (err) {
        return next(ApiError.badRequest(err));
      }

      if (info) {
        return next(new ApiError(info.code, info.message, { error: info.message }))
      }

      if (!user) {
        return next(
          ApiError.unauthorized(info?.message || 'Incorrect user or password'),
        );
      }

      req.login(user, (loginError) => {
        if (loginError) return next(loginError);

        res.status(200).send(sanitiseUser(user as User));
      });
    },
  )(req, res, next);
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logOut((err) => {
    if (err) return next(err);

    req.session.destroy((destroyError) => {
      if (destroyError) return next(destroyError);

      res.clearCookie('connect.sid');
      res.sendStatus(200);
    });
  });
};

const getGoogleUrl = (req: Request, res: Response) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
};

const googleCallback = (req: Request, res: Response) => {
  res.redirect(process.env.GOOGLE_SUCCESS_REDIRECT);
};

const currentUser = (req: Request, res: Response) => {
  res.status(200).send(sanitiseUser(req.user));
};

export default {
  login,
  logout,
  getGoogleUrl,
  googleCallback,
  currentUser,
};
