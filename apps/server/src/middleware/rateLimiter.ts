import { Socket } from 'socket.io';
import { RATE_LIMIT_CONFIG } from '@anonchat/shared';

interface RateLimitTracker {
  lastJoinQueueMs: number;
  lastNextMs: number;
  messageTimestamps: number[];
}

const socketLimitsMap = new Map<string, RateLimitTracker>();

export function isSocketRateLimited(socket: Socket, event: 'message' | 'joinQueue' | 'next'): { limited: boolean; retryAfterMs: number } {
  const now = Date.now();
  let tracker = socketLimitsMap.get(socket.id);

  if (!tracker) {
    tracker = {
      lastJoinQueueMs: 0,
      lastNextMs: 0,
      messageTimestamps: [],
    };
    socketLimitsMap.set(socket.id, tracker);
  }

  if (event === 'joinQueue') {
    const elapsed = now - tracker.lastJoinQueueMs;
    if (elapsed < RATE_LIMIT_CONFIG.JOIN_QUEUE_COOLDOWN_MS) {
      return { limited: true, retryAfterMs: RATE_LIMIT_CONFIG.JOIN_QUEUE_COOLDOWN_MS - elapsed };
    }
    tracker.lastJoinQueueMs = now;
  }

  if (event === 'next') {
    const elapsed = now - tracker.lastNextMs;
    if (elapsed < RATE_LIMIT_CONFIG.NEXT_BUTTON_COOLDOWN_MS) {
      return { limited: true, retryAfterMs: RATE_LIMIT_CONFIG.NEXT_BUTTON_COOLDOWN_MS - elapsed };
    }
    tracker.lastNextMs = now;
  }

  if (event === 'message') {
    // Sliding window of 1 second
    tracker.messageTimestamps = tracker.messageTimestamps.filter((t) => now - t < 1000);
    if (tracker.messageTimestamps.length >= RATE_LIMIT_CONFIG.MESSAGES_PER_SECOND) {
      return { limited: true, retryAfterMs: 1000 };
    }
    tracker.messageTimestamps.push(now);
  }

  return { limited: false, retryAfterMs: 0 };
}

export function cleanupSocketRateLimit(socketId: string) {
  socketLimitsMap.delete(socketId);
}
