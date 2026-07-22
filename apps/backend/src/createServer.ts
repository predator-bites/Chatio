import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import messageRouter from './routers/message.router';
import roomRouter from './routers/room.router';
import userRouter from './routers/user.router';
import authRouter from './routers/auth.router';
import ErrorMiddleware from './middlewares/ErrorMiddleware';
import initPassport from './passport';
import passport from 'passport';
import SessionMiddleware from './middlewares/SessionMiddleware';
import rateLimit from 'express-rate-limit';
import ms from 'ms';

export default function createServer() {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    }),
  );

  app.use(cookieParser());
  app.set('trust proxy', 1);

  app.use(rateLimit({
  windowMs: ms('1m'),
  limit: 200,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

  app.use(SessionMiddleware);

  initPassport();
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/auth', authRouter);
  app.use('/message', messageRouter);
  app.use('/user', userRouter);
  app.use('/room', roomRouter);

  app.use(ErrorMiddleware);

  return app;
}
