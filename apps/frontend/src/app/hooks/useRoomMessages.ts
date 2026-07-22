import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../service/api.service';

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export interface TypingUser {
  userId: string;
  username?: string;
  roomId: string;
}

export function useRoomMessages(
  roomId: string | null,
  userId: string | null,
  username?: string | null,
) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    const socket = io(BACKEND_URL, { withCredentials: true });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('new_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('user_typing', (data: TypingUser) => {
      setTypingUsers((prev) =>
        prev.some((u) => u.userId === data.userId) ? prev : [...prev, data],
      );

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }, 2000);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !roomId) return;

    socket.emit('join_room', { roomId });

    return () => {
      socket.emit('leave_room', { roomId });
      setMessages([]);
      setTypingUsers([]);
    };
  }, [roomId]);

  const sendTyping = () => {
    if (!socketRef.current || !roomId || !userId) return;

    socketRef.current.emit('typing', { roomId, userId, username });
  };

  return { messages, setMessages, typingUsers, connected, sendTyping };
}
