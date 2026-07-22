import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import prisma from './db';
import ms from 'ms';
import messageRouter from './routers/message.router';
import roomRouter from './routers/room.router';
import userRouter from './routers/user.router';
import authRouter from './routers/auth.router';
import ErrorMiddleware from './middlewares/ErrorMiddleware';
import initPassport from './passport';
import passport from 'passport';

export default function createServer() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error(
      'FATAL: SESSION_SECRET environment variable is required but missing.',
    );
  }

  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser(secret));

  app.use(
    session({
      secret,
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(prisma, {
        checkPeriod: ms('2m'),
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.MODE === 'production',
        sameSite: process.env.MODE === 'production' ? 'none' : 'lax',
        maxAge: ms('7d'),
      },
    }),
  );

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
