import { z } from 'zod';
import { IndianLanguage } from '../types/index';

export const SUPPORTED_LANGUAGES: { code: IndianLanguage; name: string; nativeName: string }[] = [
  { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'english', name: 'English', nativeName: 'English' },
  { code: 'hinglish', name: 'Hinglish', nativeName: 'Hinglish' },
  { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'marathi', name: 'Marathi', nativeName: 'मराठी' },
];

export const joinQueueSchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Name too long'),
  gender: z.enum(['male', 'female', 'other']),
  interestedIn: z.enum(['male', 'female', 'other', 'all']).default('all'),
  age: z.number().min(13, 'Must be at least 13').max(120, 'Invalid age'),
  mode: z.enum(['text', 'video', 'voice']),
  language: z.enum(['hindi', 'english', 'hinglish', 'tamil', 'telugu', 'kannada', 'malayalam', 'marathi']),
  interests: z.array(z.string()).max(10, 'Maximum 10 interests allowed').default([]),
});

export const chatMessageSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  timestamp: z.number().optional(),
});

export function sanitizeInterests(interests: string[]): string[] {
  return interests
    .map((tag) => tag.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, ''))
    .filter((tag) => tag.length > 0 && tag.length <= 20)
    .slice(0, 10);
}

export function getIceServers(): RTCIceServer[] {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    {
      urls: [
        `turn:${host}:3478?transport=udp`,
        `turn:${host}:3478?transport=tcp`,
      ],
      username: 'anonuser',
      credential: 'anonpassword',
    },
  ];
}
