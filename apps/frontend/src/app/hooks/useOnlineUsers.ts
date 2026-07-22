import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.SERVER_URL;

export function useOnlineUsers(userId: string | null): Set<string> {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;

    const socket = io(BACKEND_URL, { withCredentials: true });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('user_online', { userId });
    });

    socket.on('user_online', ({ userId: id }: { userId: string }) => {
      setOnlineUserIds((prev) => new Set([...prev, id]));
    });

    socket.on('user_offline', ({ userId: id }: { userId: string }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);

        next.delete(id);
        return next;
      });
    });

    socket.on('online_snapshot', ({ userIds }: { userIds: string[] }) => {
      setOnlineUserIds(new Set(userIds));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  return onlineUserIds;
}
