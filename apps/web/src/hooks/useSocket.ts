import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents, ChatMessagePayload } from '@anonchat/types';
import { useChatStore } from '../stores/useChatStore';

const getSocketUrl = (): string => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    if (!port || port === '80' || port === '443' || port === '8080' || port === '8443') {
      return `${protocol}//${hostname}${port ? ':' + port : ''}`;
    }
    return `${protocol}//${hostname}:4000`;
  }
  return 'http://localhost:4000';
};

export function useSocket() {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  const {
    name,
    gender,
    interestedIn,
    age,
    mode,
    language,
    interests,
    roomId,
    setStatus,
    setMatched,
    addMessage,
    setIsPartnerTyping,
    setRateLimitWarning,
    resetChat,
  } = useChatStore();

  useEffect(() => {
    const socketUrl = getSocketUrl();
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('matched', (payload) => {
      setMatched(payload);
    });

    socket.on('message', (payload: ChatMessagePayload) => {
      addMessage({
        id: payload.messageId,
        sender: 'partner',
        content: payload.content,
        timestamp: payload.timestamp,
      });
    });

    socket.on('typing', () => {
      setIsPartnerTyping(true);
    });

    socket.on('stopTyping', () => {
      setIsPartnerTyping(false);
    });

    socket.on('partnerLeft', (payload) => {
      addMessage({
        id: `sys-left-${Date.now()}`,
        sender: 'system',
        content: payload.reason || 'Stranger has left the conversation.',
        timestamp: Date.now(),
      });
    });

    socket.on('rateLimitExceeded', (payload) => {
      setRateLimitWarning(payload.message);
      setTimeout(() => setRateLimitWarning(null), payload.retryAfterMs || 3000);
    });

    socket.on('error', (err) => {
      setRateLimitWarning(err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [setMatched, addMessage, setIsPartnerTyping, setRateLimitWarning]);

  const joinQueue = useCallback(() => {
    if (!socketRef.current) return;
    setStatus('waiting');
    socketRef.current.emit('joinQueue', { name, gender, interestedIn, age, mode, language, interests });
  }, [name, gender, interestedIn, age, mode, language, interests, setStatus]);

  const leaveQueue = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('leaveQueue');
    resetChat();
  }, [resetChat]);

  const nextStranger = useCallback(() => {
    if (!socketRef.current) return;
    if (roomId) {
      socketRef.current.emit('next', { roomId, reason: 'user_requested' });
    }
    joinQueue();
  }, [roomId, joinQueue]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !roomId || !content.trim()) return;

      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const payload: ChatMessagePayload = {
        roomId,
        messageId,
        content: content.trim(),
        timestamp: Date.now(),
      };

      socketRef.current.emit('message', payload);
      addMessage({
        id: messageId,
        sender: 'self',
        content: content.trim(),
        timestamp: payload.timestamp,
      });
    },
    [roomId, addMessage]
  );

  const sendTyping = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('typing', { roomId, isTyping: true });
    }
  }, [roomId]);

  const sendStopTyping = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('stopTyping', { roomId });
    }
  }, [roomId]);

  return {
    socket: socketRef.current,
    joinQueue,
    leaveQueue,
    nextStranger,
    sendMessage,
    sendTyping,
    sendStopTyping,
  };
}
