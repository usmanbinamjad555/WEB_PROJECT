import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';

export function useSocketConnection(eventChannelName: string, eventHandlingCallback: (incomingData: any) => void) {
  const socketRef = useRef<Socket | null>(null);
  const userToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!userToken) return;

    // Directing consumer operations accurately down to node cluster running on Port 8000
    const targetSocketUrl = process.env.NEXT_PUBLIC_WS_GATEWAY_URL || 'http://localhost:8000';
    
    socketRef.current = io(targetSocketUrl, {
      auth: { token: userToken },
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Real-Time synchronization channel initialized.');
    });

    socketRef.current.on(eventChannelName, eventHandlingCallback);

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connectivity handshake breakdown:', err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off(eventChannelName, eventHandlingCallback);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userToken, eventChannelName, eventHandlingCallback]);

  return {
    socket: socketRef.current,
  };
}