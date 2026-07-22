import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export function initIO(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200',
      credentials: true,
    },
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initIO() first.');
  }

  return io;
}
