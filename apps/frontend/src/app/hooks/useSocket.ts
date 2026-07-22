import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

/**
 * useSocket
 *
 * Creates and manages a single Socket.IO connection for the lifetime
 * of the component that uses it.
 *
 * Returns:
 *   socket    — the Socket instance (stable ref, same object across renders)
 *   connected — boolean reflecting the current connection state
 *
 * Usage:
 *   const { socket, connected } = useSocket();
 */
export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create the connection once
    const socket = io(BACKEND_URL, {
      withCredentials: true, // send session cookie for auth
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[socket] connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('[socket] disconnected');
      setConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { socket: socketRef.current, connected };
}
