'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../stores/useChatStore';
import { ClientToServerEvents, ServerToClientEvents, ChatMessagePayload } from '../types/index';

const getSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.');
    if (!isLocal) {
      return 'https://onlineengage.onrender.com';
    }
    return window.location.origin;
  }
  return 'http://localhost:4000';
};

export function useSocket() {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const {
    name,
    gender,
    interestedIn,
    age,
    mode,
    language,
    interests,
    roomId,
    status,
    setStatus,
    setMatched,
    addMessage,
    setPartnerTyping,
    setRateLimitWarning,
    resetChat,
  } = useChatStore();

  useEffect(() => {
    const socketUrl = getSocketUrl();
    const isHttps = socketUrl.startsWith('https://');

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(socketUrl, {
      transports: ['websocket', 'polling'],
      secure: isHttps,
      rejectUnauthorized: false,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      resetChat();
    });

    socket.on('queueStatus', ({ status: qStatus }) => {
      if (qStatus === 'waiting') {
        setStatus('waiting');
      } else if (qStatus === 'idle') {
        setStatus('idle');
      }
    });

    socket.on('matched', (payload) => {
      setMatched(payload);
    });

    socket.on('partnerLeft', () => {
      addMessage({
        id: `sys-left-${Date.now()}`,
        sender: 'system',
        content: 'Stranger has left the chat.',
        timestamp: Date.now(),
      });
    });

    socket.on('message', (payload: ChatMessagePayload) => {
      addMessage({
        id: `peer-${Date.now()}`,
        sender: 'peer',
        content: payload.content,
        timestamp: payload.timestamp,
      });
      setPartnerTyping(false);
    });

    socket.on('typing', () => {
      setPartnerTyping(true);
    });

    socket.on('stopTyping', () => {
      setPartnerTyping(false);
    });

    socket.on('rateLimitExceeded', ({ message }) => {
      setRateLimitWarning(message);
      setTimeout(() => setRateLimitWarning(null), 4000);
    });

    socket.on('error', ({ message }) => {
      addMessage({
        id: `sys-err-${Date.now()}`,
        sender: 'system',
        content: `Error: ${message}`,
        timestamp: Date.now(),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [setStatus, setMatched, addMessage, setPartnerTyping, setRateLimitWarning, resetChat]);

  const joinQueue = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('joinQueue', {
        name,
        gender,
        interestedIn,
        age,
        mode,
        language,
        interests,
      });
    }
  }, [name, gender, interestedIn, age, mode, language, interests]);

  const leaveQueue = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leaveQueue');
    }
    resetChat();
  }, [resetChat]);

  const nextStranger = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('next', { roomId });
    }
    resetChat();
    joinQueue();
  }, [roomId, resetChat, joinQueue]);

  const sendMessage = useCallback(
    (content: string) => {
      if (socketRef.current && roomId) {
        const payload = {
          roomId,
          content,
          timestamp: Date.now(),
        };

        addMessage({
          id: `self-${Date.now()}`,
          sender: 'self',
          content,
          timestamp: payload.timestamp,
        });

        socketRef.current.emit('message', payload);
      }
    },
    [roomId, addMessage]
  );

  const sendTyping = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('typing', { roomId });
    }
  }, [roomId]);

  const sendStopTyping = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('stopTyping', { roomId });
    }
  }, [roomId]);

  return {
    socket: socketRef.current,
    isConnected,
    joinQueue,
    leaveQueue,
    nextStranger,
    sendMessage,
    sendTyping,
    sendStopTyping,
  };
}
