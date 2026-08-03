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

const AI_BOT_NAMES = [
  { name: 'Priya (AI Companion)', gender: 'female', age: 21 },
  { name: 'Rahul (AI Buddy)', gender: 'male', age: 22 },
  { name: 'Ananya (AI Friend)', gender: 'female', age: 20 },
  { name: 'Vikram (AI Chatbot)', gender: 'male', age: 23 },
];

const AI_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hey! Great to connect with you! How's your day going so far? 😊",
    "Hello there! I'm chatting from Mumbai. Where in India are you from?",
    "Hi! Nice to meet you here on Womegle! What are you up to today?",
  ],
  location: [
    "Oh nice! That's a fantastic place! How's the weather over there today?",
    "Awesome! I love connecting with people from different parts of India! 🇮🇳",
  ],
  hobbies: [
    "That sounds so cool! I'm really into movies, music, and learning new things!",
    "Nice! What series or anime are you currently watching?",
  ],
  generic: [
    "That's so interesting! Tell me more about it! 😄",
    "Haha totally agree with you on that! What else do you enjoy doing in your free time?",
    "That makes a lot of sense! Do you use Womegle often to meet people?",
    "Super cool! If you could travel anywhere right now, where would you go?",
  ]
};

export function useSocket() {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const queueTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aiTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    partnerSocketId,
    status,
    setStatus,
    setMatched,
    addMessage,
    setPartnerTyping,
    setRateLimitWarning,
    resetChat,
  } = useChatStore();

  const clearQueueTimer = useCallback(() => {
    if (queueTimeoutRef.current) {
      clearTimeout(queueTimeoutRef.current);
      queueTimeoutRef.current = null;
    }
  }, []);

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
      clearQueueTimer();
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
      clearQueueTimer();
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
      clearQueueTimer();
      if (aiTypingTimeoutRef.current) clearTimeout(aiTypingTimeoutRef.current);
      socket.disconnect();
    };
  }, [setStatus, setMatched, addMessage, setPartnerTyping, setRateLimitWarning, resetChat, clearQueueTimer]);

  const triggerAIBotFallback = useCallback(() => {
    const selectedBot = AI_BOT_NAMES[Math.floor(Math.random() * AI_BOT_NAMES.length)];
    const aiRoomId = `ai-room-${Date.now()}`;

    setMatched({
      roomId: aiRoomId,
      partnerSocketId: 'ai-bot-socket',
      mode: mode || 'text',
      peerInitiator: false,
      partnerName: selectedBot.name,
      partnerGender: selectedBot.gender as any,
      partnerAge: selectedBot.age,
      partnerLanguage: language || 'hindi',
      sharedInterests: interests.length > 0 ? interests : ['chatting', 'friends'],
    });
  }, [setMatched, mode, language, interests]);

  const joinQueue = useCallback(() => {
    clearQueueTimer();
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

    // 20-Second Timeout Fallback for AI Companion
    queueTimeoutRef.current = setTimeout(() => {
      triggerAIBotFallback();
    }, 20000);
  }, [name, gender, interestedIn, age, mode, language, interests, clearQueueTimer, triggerAIBotFallback]);

  const leaveQueue = useCallback(() => {
    clearQueueTimer();
    if (aiTypingTimeoutRef.current) clearTimeout(aiTypingTimeoutRef.current);
    if (socketRef.current) {
      socketRef.current.emit('leaveQueue');
    }
    resetChat();
  }, [resetChat, clearQueueTimer]);

  const nextStranger = useCallback(() => {
    clearQueueTimer();
    if (aiTypingTimeoutRef.current) clearTimeout(aiTypingTimeoutRef.current);
    if (socketRef.current && roomId && partnerSocketId !== 'ai-bot-socket') {
      socketRef.current.emit('next', { roomId });
    }
    resetChat();
    joinQueue();
  }, [roomId, partnerSocketId, resetChat, joinQueue, clearQueueTimer]);

  const handleAIBotReply = useCallback((userContent: string) => {
    setPartnerTyping(true);

    const textLower = userContent.toLowerCase();
    let category = 'generic';
    if (textLower.includes('hi') || textLower.includes('hello') || textLower.includes('hey') || textLower.includes('namaste')) {
      category = 'greeting';
    } else if (textLower.includes('where') || textLower.includes('city') || textLower.includes('from') || textLower.includes('delhi') || textLower.includes('mumbai')) {
      category = 'location';
    } else if (textLower.includes('movie') || textLower.includes('anime') || textLower.includes('song') || textLower.includes('game') || textLower.includes('sport')) {
      category = 'hobbies';
    }

    const options = AI_RESPONSES[category] || AI_RESPONSES.generic;
    const replyText = options[Math.floor(Math.random() * options.length)];

    aiTypingTimeoutRef.current = setTimeout(() => {
      setPartnerTyping(false);
      addMessage({
        id: `peer-ai-${Date.now()}`,
        sender: 'peer',
        content: replyText,
        timestamp: Date.now(),
      });
    }, 1400);
  }, [addMessage, setPartnerTyping]);

  const sendMessage = useCallback(
    (content: string) => {
      addMessage({
        id: `self-${Date.now()}`,
        sender: 'self',
        content,
        timestamp: Date.now(),
      });

      if (partnerSocketId === 'ai-bot-socket') {
        handleAIBotReply(content);
      } else if (socketRef.current && roomId) {
        socketRef.current.emit('message', {
          roomId,
          content,
          timestamp: Date.now(),
        });
      }
    },
    [roomId, partnerSocketId, addMessage, handleAIBotReply]
  );

  const sendTyping = useCallback(() => {
    if (socketRef.current && roomId && partnerSocketId !== 'ai-bot-socket') {
      socketRef.current.emit('typing', { roomId });
    }
  }, [roomId, partnerSocketId]);

  const sendStopTyping = useCallback(() => {
    if (socketRef.current && roomId && partnerSocketId !== 'ai-bot-socket') {
      socketRef.current.emit('stopTyping', { roomId });
    }
  }, [roomId, partnerSocketId]);

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
