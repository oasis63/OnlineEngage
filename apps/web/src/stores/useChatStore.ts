import { create } from 'zustand';
import { QueueMode, IndianLanguage, ChatMessagePayload, MatchedPayload, UserGender, GenderPreference } from '@anonchat/types';

export type ConnectionStatus = 'idle' | 'waiting' | 'connected';

export interface ChatMessage {
  id: string;
  sender: 'self' | 'partner' | 'system';
  content: string;
  timestamp: number;
}

interface ChatState {
  status: ConnectionStatus;
  mode: QueueMode;
  name: string;
  gender: UserGender;
  interestedIn: GenderPreference;
  age: number;
  language: IndianLanguage;
  interests: string[];
  roomId: string | null;
  partnerSocketId: string | null;
  partnerName: string | null;
  partnerGender: UserGender | null;
  partnerAge: number | null;
  partnerLanguage: IndianLanguage | null;
  sharedInterests: string[];
  peerInitiator: boolean;
  messages: ChatMessage[];
  isPartnerTyping: boolean;
  unreadCount: number;
  rateLimitWarning: string | null;

  // Actions
  setName: (name: string) => void;
  setGender: (gender: UserGender) => void;
  setInterestedIn: (interestedIn: GenderPreference) => void;
  setAge: (age: number) => void;
  setMode: (mode: QueueMode) => void;
  setLanguage: (lang: IndianLanguage) => void;
  setInterests: (interests: string[]) => void;
  setStatus: (status: ConnectionStatus) => void;
  setMatched: (payload: MatchedPayload) => void;
  addMessage: (message: ChatMessage) => void;
  setIsPartnerTyping: (isTyping: boolean) => void;
  setRateLimitWarning: (warning: string | null) => void;
  resetChat: () => void;
  fullReset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  status: 'idle',
  mode: 'text',
  name: '',
  gender: 'male',
  interestedIn: 'all',
  age: 20,
  language: 'en',
  interests: [],
  roomId: null,
  partnerSocketId: null,
  partnerName: null,
  partnerGender: null,
  partnerAge: null,
  partnerLanguage: null,
  sharedInterests: [],
  peerInitiator: false,
  messages: [],
  isPartnerTyping: false,
  unreadCount: 0,
  rateLimitWarning: null,

  setName: (name) => set({ name }),
  setGender: (gender) => set({ gender }),
  setInterestedIn: (interestedIn) => set({ interestedIn }),
  setAge: (age) => set({ age }),
  setMode: (mode) => set({ mode }),
  setLanguage: (language) => set({ language }),
  setInterests: (interests) => set({ interests }),
  setStatus: (status) => set({ status }),
  setMatched: (payload) =>
    set({
      status: 'connected',
      roomId: payload.roomId,
      partnerSocketId: payload.partnerSocketId,
      peerInitiator: payload.peerInitiator,
      partnerName: payload.partnerName || 'Stranger',
      partnerGender: payload.partnerGender || null,
      partnerAge: payload.partnerAge || null,
      partnerLanguage: payload.partnerLanguage || null,
      sharedInterests: payload.sharedInterests || [],
      messages: [
        {
          id: 'sys-matched',
          sender: 'system',
          content: `You are connected with ${payload.partnerName || 'a stranger'} (${payload.partnerAge ? payload.partnerAge + 'y/o' : ''} ${payload.partnerGender || ''})! Say Hello.`,
          timestamp: Date.now(),
        },
      ],
      isPartnerTyping: false,
      rateLimitWarning: null,
    }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
      unreadCount: msg.sender === 'partner' ? state.unreadCount + 1 : state.unreadCount,
    })),
  setIsPartnerTyping: (isPartnerTyping) => set({ isPartnerTyping }),
  setRateLimitWarning: (warning) => set({ rateLimitWarning: warning }),
  resetChat: () =>
    set({
      status: 'idle',
      roomId: null,
      partnerSocketId: null,
      partnerName: null,
      partnerGender: null,
      partnerAge: null,
      partnerLanguage: null,
      sharedInterests: [],
      peerInitiator: false,
      messages: [],
      isPartnerTyping: false,
      rateLimitWarning: null,
    }),
  fullReset: () =>
    set({
      status: 'idle',
      mode: 'text',
      name: '',
      gender: 'male',
      interestedIn: 'all',
      age: 20,
      language: 'en',
      interests: [],
      roomId: null,
      partnerSocketId: null,
      partnerName: null,
      partnerGender: null,
      partnerAge: null,
      partnerLanguage: null,
      sharedInterests: [],
      peerInitiator: false,
      messages: [],
      isPartnerTyping: false,
      unreadCount: 0,
      rateLimitWarning: null,
    }),
}));
