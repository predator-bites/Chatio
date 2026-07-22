import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import SessionMiddleware from './middlewares/SessionMiddleware';
import passport from 'passport';
import ApiError from './utils/ApiError';

let io: Server;

export function initIO(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });

  const wrap = (middleware: any) => (socket: any, next: any) => {
    middleware(socket.request, {}, next);
  };

  io.use(wrap(SessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(ApiError.unauthorized('User not authorized'))
    }
  })

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initIO() first.');
  }

  return io;
}
