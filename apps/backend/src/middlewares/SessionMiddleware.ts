// session.middleware.ts
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import ms from 'ms';
import prisma from '../db';

const secret = process.env.SESSION_SECRET;
const isProd = process.env.NODE_ENV === 'production';

const SessionMiddleware = session({
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
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: ms('7d'),
  },
});

export default SessionMiddleware;
