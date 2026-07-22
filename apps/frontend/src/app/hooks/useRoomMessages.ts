import { useEffect, useState } from 'react';
import { Message } from '../service/api.service';
import { useSocket } from './useSocket';

export interface TypingUser {
  userId: string;
  username?: string;
  roomId: string;
}

export function useRoomMessages(
  roomId: string | null,
  userId: string | null,
  username?: string | null,
  onReconnect?: () => void,
) {
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      if (roomId) {
        socket.emit('join_room', { roomId });
      }
      if (onReconnect) {
        onReconnect();
      }
    };

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
      );
    };

    const handleUserTyping = (data: TypingUser) => {
      setTypingUsers((prev) =>
        prev.some((u) => u.userId === data.userId) ? prev : [...prev, data],
      );

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }, 2000);
    };

    socket.on('connect', handleConnect);
    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, roomId, onReconnect]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('join_room', { roomId });

    return () => {
      socket.emit('leave_room', { roomId });
      setMessages([]);
      setTypingUsers([]);
    };
  }, [socket, roomId]);

  const sendTyping = () => {
    if (!socket || !roomId || !userId) return;

    socket.emit('typing', { roomId, userId, username });
  };

  return { messages, setMessages, typingUsers, connected, sendTyping };
}
