export type IndianLanguage =
  | 'en'
  | 'hi'
  | 'ta'
  | 'kn'
  | 'ml'
  | 'te'
  | 'mr'
  | 'gu';

export type QueueMode = 'text' | 'voice' | 'video';

export type UserGender = 'male' | 'female' | 'other';
export type GenderPreference = 'all' | 'male' | 'female' | 'other';

export interface UserSession {
  sessionId: string;
  socketId: string;
  name: string;
  gender: UserGender;
  interestedIn: GenderPreference;
  age: number;
  mode: QueueMode;
  language: IndianLanguage;
  interests: string[];
  joinedAt: number;
}

export interface JoinQueuePayload {
  name: string;
  gender: UserGender;
  interestedIn?: GenderPreference;
  age: number;
  mode: QueueMode;
  language: IndianLanguage;
  interests?: string[];
}

export interface MatchedPayload {
  roomId: string;
  partnerSocketId: string;
  mode: QueueMode;
  peerInitiator: boolean;
  partnerName?: string;
  partnerGender?: UserGender;
  partnerAge?: number;
  partnerLanguage?: IndianLanguage;
  sharedInterests?: string[];
}

export interface ChatMessagePayload {
  roomId: string;
  messageId: string;
  content: string;
  timestamp: number;
}

export interface TypingPayload {
  roomId: string;
  isTyping: boolean;
}

export interface SignalPayload {
  roomId: string;
  sdp: any;
}

export interface IceCandidatePayload {
  roomId: string;
  candidate: any;
}

export interface NextPayload {
  roomId?: string;
  reason?: 'user_requested' | 'partner_left';
}

export interface PartnerLeftPayload {
  roomId: string;
  reason: string;
}

export interface QueueStatusPayload {
  status: 'waiting' | 'matched' | 'idle';
  estimatedWaitSeconds?: number;
  positionInQueue?: number;
}

export interface ClientToServerEvents {
  joinQueue: (payload: JoinQueuePayload) => void;
  leaveQueue: () => void;
  next: (payload: NextPayload) => void;
  message: (payload: ChatMessagePayload) => void;
  typing: (payload: TypingPayload) => void;
  stopTyping: (payload: { roomId: string }) => void;
  offer: (payload: SignalPayload) => void;
  answer: (payload: SignalPayload) => void;
  iceCandidate: (payload: IceCandidatePayload) => void;
  disconnect: () => void;
}

export interface ServerToClientEvents {
  queueStatus: (payload: QueueStatusPayload) => void;
  matched: (payload: MatchedPayload) => void;
  message: (payload: ChatMessagePayload) => void;
  typing: (payload: TypingPayload) => void;
  stopTyping: (payload: { roomId: string }) => void;
  offer: (payload: SignalPayload) => void;
  answer: (payload: SignalPayload) => void;
  iceCandidate: (payload: IceCandidatePayload) => void;
  partnerLeft: (payload: PartnerLeftPayload) => void;
  rateLimitExceeded: (payload: { message: string; retryAfterMs: number }) => void;
  error: (payload: { code: string; message: string }) => void;
}
