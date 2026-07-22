import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';

export function useOnlineUsers(userId: string | null): Set<string> {
  const { socket } = useSocket();
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket || !userId) return;

    const handleUserOnline = ({ userId: id }: { userId: string }) => {
      setOnlineUserIds((prev) => new Set([...prev, id]));
    };

    const handleUserOffline = ({ userId: id }: { userId: string }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    };

    const handleOnlineSnapshot = ({ userIds }: { userIds: string[] }) => {
      setOnlineUserIds(new Set(userIds));
    };

    socket.emit('user_online', { userId });

    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);
    socket.on('online_snapshot', handleOnlineSnapshot);

    return () => {
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
      socket.off('online_snapshot', handleOnlineSnapshot);
    };
  }, [socket, userId]);

  return onlineUserIds;
}
