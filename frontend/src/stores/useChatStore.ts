import { create } from 'zustand';
import { QueueMode, IndianLanguage, ChatMessagePayload, MatchedPayload, UserGender, GenderPreference } from '../types/index';

export interface ChatMessage {
  id: string;
  sender: 'self' | 'peer' | 'system';
  content: string;
  timestamp: number;
}

export type QueueStatusState = 'idle' | 'waiting' | 'connected';

interface ChatStoreState {
  // Session Profile
  name: string;
  gender: UserGender;
  interestedIn: GenderPreference;
  age: number;
  mode: QueueMode;
  language: IndianLanguage;
  interests: string[];

  // Connected Stranger Details
  partnerName: string;
  partnerGender: UserGender | '';
  partnerAge: number | 0;
  partnerLanguage: IndianLanguage | '';
  sharedInterests: string[];
  partnerSocketId: string;
  peerInitiator: boolean;

  // Active Chat State
  status: QueueStatusState;
  roomId: string | null;
  messages: ChatMessage[];
  isPartnerTyping: boolean;
  rateLimitWarning: string | null;

  // Actions
  setName: (name: string) => void;
  setGender: (gender: UserGender) => void;
  setInterestedIn: (interestedIn: GenderPreference) => void;
  setAge: (age: number) => void;
  setMode: (mode: QueueMode) => void;
  setLanguage: (language: IndianLanguage) => void;
  setInterests: (interests: string[]) => void;
  setStatus: (status: QueueStatusState) => void;
  setMatched: (payload: MatchedPayload) => void;
  addMessage: (msg: ChatMessage) => void;
  setPartnerTyping: (isTyping: boolean) => void;
  setRateLimitWarning: (warning: string | null) => void;
  resetChat: () => void;
  fullReset: () => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  name: 'Anonymous',
  gender: 'male',
  interestedIn: 'all',
  age: 21,
  mode: 'text',
  language: 'hindi',
  interests: [],

  partnerName: '',
  partnerGender: '',
  partnerAge: 0,
  partnerLanguage: '',
  sharedInterests: [],
  partnerSocketId: '',
  peerInitiator: false,

  status: 'idle',
  roomId: null,
  messages: [],
  isPartnerTyping: false,
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
      partnerName: payload.partnerName,
      partnerGender: payload.partnerGender,
      partnerAge: payload.partnerAge,
      partnerLanguage: payload.partnerLanguage,
      sharedInterests: payload.sharedInterests,
      messages: [
        {
          id: 'sys-start',
          sender: 'system',
          content: `Connected with ${payload.partnerName || 'Stranger'}! Say Hi 👋`,
          timestamp: Date.now(),
        },
      ],
    }),

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setPartnerTyping: (isTyping) => set({ isPartnerTyping: isTyping }),
  setRateLimitWarning: (warning) => set({ rateLimitWarning: warning }),

  resetChat: () =>
    set({
      status: 'idle',
      roomId: null,
      messages: [],
      isPartnerTyping: false,
      rateLimitWarning: null,
      partnerName: '',
      partnerGender: '',
      partnerAge: 0,
      partnerLanguage: '',
      sharedInterests: [],
      partnerSocketId: '',
      peerInitiator: false,
    }),

  fullReset: () =>
    set({
      name: 'Anonymous',
      gender: 'male',
      interestedIn: 'all',
      age: 21,
      mode: 'text',
      language: 'hindi',
      interests: [],
      status: 'idle',
      roomId: null,
      messages: [],
      isPartnerTyping: false,
      rateLimitWarning: null,
      partnerName: '',
      partnerGender: '',
      partnerAge: 0,
      partnerLanguage: '',
      sharedInterests: [],
      partnerSocketId: '',
      peerInitiator: false,
    }),
}));
