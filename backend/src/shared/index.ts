import { z } from 'zod';

export const RATE_LIMIT_CONFIG = {
  MESSAGES_PER_SECOND: 5,
  JOIN_QUEUE_COOLDOWN_MS: 1500,
  NEXT_BUTTON_COOLDOWN_MS: 2000,
};

export const joinQueueSchema = z.object({
  name: z.string().min(1, 'Name is required').max(30),
  gender: z.enum(['male', 'female', 'other']),
  interestedIn: z.enum(['all', 'male', 'female', 'other']).optional().default('all'),
  age: z.coerce.number().min(13, 'Must be at least 13 years old').max(120),
  mode: z.enum(['text', 'voice', 'video']),
  language: z.enum(['en', 'hi', 'ta', 'kn', 'ml', 'te', 'mr', 'gu']),
  interests: z.array(z.string().min(1).max(30)).optional().default([]),
});

export const chatMessageSchema = z.object({
  roomId: z.string().min(1),
  messageId: z.string().min(1),
  content: z.string().min(1).max(2000),
  timestamp: z.number(),
});

export function sanitizeInterests(rawInterests: string[] = []): string[] {
  return Array.from(
    new Set(
      rawInterests
        .map((i) => i.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, ''))
        .filter((i) => i.length > 0 && i.length <= 30),
    ),
  ).slice(0, 10);
}

export function findMatchingInterests(listA: string[] = [], listB: string[] = []): string[] {
  const setB = new Set(listB.map((i) => i.toLowerCase()));
  return listA.filter((item) => setB.has(item.toLowerCase()));
}
