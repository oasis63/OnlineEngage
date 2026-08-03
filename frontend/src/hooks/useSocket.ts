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

// Female AI Companions (Matched when user is Male)
const FEMALE_AI_BOTS = [
  { name: 'Priya (AI Companion)', gender: 'female', age: 21 },
  { name: 'Ananya (AI Companion)', gender: 'female', age: 20 },
  { name: 'Riya (AI Companion)', gender: 'female', age: 22 },
  { name: 'Neha (AI Companion)', gender: 'female', age: 21 },
];

// Male AI Companions (Matched when user is Female)
const MALE_AI_BOTS = [
  { name: 'Rahul (AI Companion)', gender: 'male', age: 22 },
  { name: 'Aarav (AI Companion)', gender: 'male', age: 23 },
  { name: 'Karan (AI Companion)', gender: 'male', age: 22 },
  { name: 'Rohan (AI Companion)', gender: 'male', age: 23 },
];

// Playful & Charming Flirty AI Responses
const FLIRTY_AI_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hey there! 😉 I was hoping I'd match with someone interesting tonight... how are you?",
    "Well hello! ✨ You just made my evening a whole lot brighter! Where are you chatting from?",
    "Hey cutie! 🙈 I'm so glad we matched. What are you up to tonight?",
  ],
  location: [
    "Ooh nice! That's an awesome city... maybe you can take me out for coffee next time I visit? ☕😉",
    "That's a great place! I bet it has amazing late-night spots... what's your ideal date spot there?",
  ],
  hobbies: [
    "Ooh late-night movies are the best! Are you a romantic comedy fan or a horror movie cuddle person? 🙈✨",
    "That sounds super cool! I love someone who has great taste... what else do you do to charm people? 😉",
  ],
  generic: [
    "Haha you're pretty charming, you know that? 😉 Tell me three cute things about yourself!",
    "I like your vibe! What's the most adventurous or romantic thing you've ever done?",
    "Aww that's so sweet! 💕 You're making me smile behind the screen 🙈",
    "Are you always this nice to talk to, or am I just getting special treatment tonight? 😉🔥",
    "Haha stop it, you're making me blush! 🙈 What's your secret to being so conversational?",
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
    // Opposite Gender Matchmaking: Male user -> Female Bot, Female user -> Male Bot
    const botPool = gender === 'female' ? MALE_AI_BOTS : FEMALE_AI_BOTS;
    const selectedBot = botPool[Math.floor(Math.random() * botPool.length)];
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
      sharedInterests: interests.length > 0 ? interests : ['chatting', 'romance'],
    });
  }, [setMatched, gender, mode, language, interests]);

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
    } else if (textLower.includes('where') || textLower.includes('city') || textLower.includes('from') || textLower.includes('delhi') || textLower.includes('mumbai') || textLower.includes('bangalore')) {
      category = 'location';
    } else if (textLower.includes('movie') || textLower.includes('anime') || textLower.includes('song') || textLower.includes('game') || textLower.includes('sport')) {
      category = 'hobbies';
    }

    const options = FLIRTY_AI_RESPONSES[category] || FLIRTY_AI_RESPONSES.generic;
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
