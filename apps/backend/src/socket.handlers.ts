import { Server, Socket } from 'socket.io';

const onlineMap = new Map<string, string>();

export function registerSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[socket] client connected: ${socket.id}`);

    socket.on('join_room', ({ roomId }: { roomId: string }) => {
      if (!roomId) return;

      socket.join(roomId);
      console.log(`[socket] ${socket.id} joined room: ${roomId}`);
    });

    socket.on('leave_room', ({ roomId }: { roomId: string }) => {
      if (!roomId) return;

      socket.leave(roomId);
      console.log(`[socket] ${socket.id} left room: ${roomId}`);
    });

    socket.on(
      'typing',
      ({
        roomId,
        userId,
        username,
      }: {
        roomId: string;
        userId: string;
        username?: string;
      }) => {
        if (!roomId || !userId) return;

        socket.to(roomId).emit('user_typing', { userId, username, roomId });
      },
    );

    socket.on('user_online', ({ userId }: { userId: string }) => {
      if (!userId) return;

      onlineMap.set(socket.id, userId);

      socket.emit('online_snapshot', {
        userIds: [...new Set(onlineMap.values())],
      });

      socket.broadcast.emit('user_online', { userId });

      console.log(`[socket] user online: ${userId} (${socket.id})`);
    });

    socket.on('disconnect', () => {
      const userId = onlineMap.get(socket.id);

      onlineMap.delete(socket.id);

      const isStillConnected = [...onlineMap.values()].includes(userId);

      if (userId && !isStillConnected) {
        io.emit('user_offline', { userId });
        console.log(`[socket] user offline: ${userId}`);
      }

      console.log(`[socket] client disconnected: ${socket.id}`);
    });
  });
}
