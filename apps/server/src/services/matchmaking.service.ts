import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { QueueMode, IndianLanguage, UserSession, UserGender, GenderPreference } from '@anonchat/types';
import { findMatchingInterests } from '@anonchat/shared';
import { logger } from '../utils/logger.js';

export interface MatchResult {
  roomId: string;
  userA: UserSession;
  userB: UserSession;
  sharedInterests: string[];
}

export class MatchmakingService {
  private redis: Redis | null;
  private inMemoryQueue: Map<QueueMode, Map<string, UserSession>> = new Map([
    ['text', new Map()],
    ['voice', new Map()],
    ['video', new Map()],
  ]);
  private inMemoryRooms: Map<string, { userAId: string; userBId: string; mode: QueueMode }> = new Map();

  constructor(redisClient?: Redis | null) {
    this.redis = redisClient || null;
  }

  private getQueueKey(mode: QueueMode): string {
    return `waiting:${mode}`;
  }

  private getSessionKey(socketId: string): string {
    return `session:${socketId}`;
  }

  async addUserToQueue(session: UserSession): Promise<MatchResult | null> {
    const { socketId, mode } = session;

    if (this.redis && this.redis.status === 'ready') {
      try {
        const queueKey = this.getQueueKey(mode);
        const sessionKey = this.getSessionKey(socketId);

        await this.redis.hset(sessionKey, {
          sessionId: session.sessionId,
          socketId: session.socketId,
          name: session.name,
          gender: session.gender,
          interestedIn: session.interestedIn || 'all',
          age: session.age.toString(),
          mode: session.mode,
          language: session.language,
          interests: JSON.stringify(session.interests),
          joinedAt: session.joinedAt.toString(),
        });

        await this.redis.sadd(queueKey, socketId);
        return await this.tryMatchRedis(session);
      } catch (err) {
        logger.error({ err }, 'Redis matchmaking error, using fallback');
      }
    }

    this.inMemoryQueue.get(mode)?.set(socketId, session);
    return this.tryMatchInMemory(session);
  }

  private calculateMatchScore(user: UserSession, candidate: UserSession): { score: number; shared: string[] } {
    const shared = findMatchingInterests(user.interests, candidate.interests);
    const isSameLanguage = user.language === candidate.language;

    // Check gender preference compatibility
    const userMatchesCand = user.interestedIn === 'all' || user.interestedIn === candidate.gender;
    const candMatchesUser = candidate.interestedIn === 'all' || candidate.interestedIn === user.gender;

    let score = 10; // Base connection score

    // Gender Match Priority: Heavy weighting so interested gender is matched first
    if (userMatchesCand && candMatchesUser) {
      if (user.interestedIn !== 'all' || candidate.interestedIn !== 'all') {
        score += 500; // Perfect mutual specific gender preference match
      } else {
        score += 300; // Both open to all
      }
    } else if (userMatchesCand || candMatchesUser) {
      score += 200; // One-way gender match
    }

    // Language Match Priority
    if (isSameLanguage) {
      score += 100;
    }

    // Shared Interests Bonus
    if (shared.length > 0) {
      score += 50 + shared.length * 20;
    }

    // Waiting time bonus (up to 60 bonus points for users waiting in queue)
    const now = Date.now();
    const waitSeconds = Math.min(Math.floor((now - candidate.joinedAt) / 1000), 60);
    score += waitSeconds * 2;

    return { score, shared };
  }

  private async tryMatchRedis(user: UserSession): Promise<MatchResult | null> {
    if (!this.redis) return null;
    const queueKey = this.getQueueKey(user.mode);
    const waitingSocketIds = await this.redis.smembers(queueKey);

    let bestCandidate: UserSession | null = null;
    let maxScore = -1;
    let bestSharedInterests: string[] = [];

    for (const candId of waitingSocketIds) {
      if (candId === user.socketId) continue;

      const rawCandData = await this.redis.hgetall(this.getSessionKey(candId));
      if (!rawCandData || !rawCandData.socketId) {
        await this.redis.srem(queueKey, candId);
        continue;
      }

      const candidate: UserSession = {
        sessionId: rawCandData.sessionId,
        socketId: rawCandData.socketId,
        name: rawCandData.name || 'Anonymous',
        gender: (rawCandData.gender as UserGender) || 'other',
        interestedIn: (rawCandData.interestedIn as GenderPreference) || 'all',
        age: parseInt(rawCandData.age || '18', 10),
        mode: rawCandData.mode as QueueMode,
        language: rawCandData.language as IndianLanguage,
        interests: rawCandData.interests ? JSON.parse(rawCandData.interests) : [],
        joinedAt: parseInt(rawCandData.joinedAt || '0', 10),
      };

      const { score, shared } = this.calculateMatchScore(user, candidate);

      if (score > maxScore) {
        maxScore = score;
        bestCandidate = candidate;
        bestSharedInterests = shared;
      }
    }

    if (bestCandidate) {
      await this.redis.srem(queueKey, user.socketId, bestCandidate.socketId);
      await this.redis.del(this.getSessionKey(user.socketId));
      await this.redis.del(this.getSessionKey(bestCandidate.socketId));

      const roomId = `room:${uuidv4()}`;
      await this.redis.hset(roomId, {
        userAId: user.socketId,
        userBId: bestCandidate.socketId,
        mode: user.mode,
      });

      return {
        roomId,
        userA: user,
        userB: bestCandidate,
        sharedInterests: bestSharedInterests,
      };
    }

    return null;
  }

  private tryMatchInMemory(user: UserSession): MatchResult | null {
    const queue = this.inMemoryQueue.get(user.mode);
    if (!queue) return null;

    let bestCandidate: UserSession | null = null;
    let maxScore = -1;
    let bestSharedInterests: string[] = [];

    for (const [candId, candidate] of queue.entries()) {
      if (candId === user.socketId) continue;

      const { score, shared } = this.calculateMatchScore(user, candidate);

      if (score > maxScore) {
        maxScore = score;
        bestCandidate = candidate;
        bestSharedInterests = shared;
      }
    }

    if (bestCandidate) {
      queue.delete(user.socketId);
      queue.delete(bestCandidate.socketId);

      const roomId = `room:${uuidv4()}`;
      this.inMemoryRooms.set(roomId, {
        userAId: user.socketId,
        userBId: bestCandidate.socketId,
        mode: user.mode,
      });

      return {
        roomId,
        userA: user,
        userB: bestCandidate,
        sharedInterests: bestSharedInterests,
      };
    }

    return null;
  }

  async removeUserFromQueue(socketId: string, mode: QueueMode): Promise<void> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        await this.redis.srem(this.getQueueKey(mode), socketId);
        await this.redis.del(this.getSessionKey(socketId));
      } catch (err) {
        logger.error({ err }, 'Error removing user from Redis queue');
      }
    }
    this.inMemoryQueue.get(mode)?.delete(socketId);
  }

  async getRoom(roomId: string): Promise<{ userAId: string; userBId: string; mode: QueueMode } | null> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        const data = await this.redis.hgetall(roomId);
        if (data && data.userAId && data.userBId) {
          return {
            userAId: data.userAId,
            userBId: data.userBId,
            mode: data.mode as QueueMode,
          };
        }
      } catch (err) {
        logger.error({ err }, 'Error getting room from Redis');
      }
    }
    return this.inMemoryRooms.get(roomId) || null;
  }

  async removeRoom(roomId: string): Promise<void> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        await this.redis.del(roomId);
      } catch (err) {
        logger.error({ err }, 'Error removing room from Redis');
      }
    }
    this.inMemoryRooms.delete(roomId);
  }
}
