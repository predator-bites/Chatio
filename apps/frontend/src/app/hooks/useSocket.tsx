import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(BACKEND_URL, {
      withCredentials: true,
    });

    setSocket(socketInstance);

    const onConnect = () => {
      console.log('[socket] connected:', socketInstance.id);
      setConnected(true);
    };

    const onDisconnect = () => {
      console.log('[socket] disconnected');
      setConnected(false);
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket(): SocketContextValue {
  return useContext(SocketContext);
}
