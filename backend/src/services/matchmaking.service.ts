import { Redis } from 'ioredis';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { QueueMode, IndianLanguage, UserSession, UserGender, GenderPreference } from '../types/index.js';
import { findMatchingInterests } from '../shared/index.js';
import { logger } from '../utils/logger.js';
import { redisClient } from './redis.js';

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
  private inMemoryRooms: Map<string, { userA: string; userB: string; mode: QueueMode }> = new Map();
  private userToRoom: Map<string, string> = new Map();

  constructor(redisClient?: Redis | null) {
    this.redis = redisClient || null;
  }

  private getQueueKey(mode: QueueMode): string {
    return `waiting:${mode}`;
  }

  private getSessionKey(socketId: string): string {
    return `session:${socketId}`;
  }

  private calculateMatchScore(user: UserSession, candidate: UserSession): { score: number; shared: string[] } {
    const shared = findMatchingInterests(user.interests, candidate.interests);
    const isSameLanguage = user.language === candidate.language;

    const userMatchesCand = user.interestedIn === 'all' || user.interestedIn === candidate.gender;
    const candMatchesUser = candidate.interestedIn === 'all' || candidate.interestedIn === user.gender;

    let score = 10;

    if (userMatchesCand && candMatchesUser) {
      if (user.interestedIn !== 'all' || candidate.interestedIn !== 'all') {
        score += 500;
      } else {
        score += 300;
      }
    } else if (userMatchesCand || candMatchesUser) {
      score += 200;
    }

    if (isSameLanguage) {
      score += 100;
    }

    if (shared.length > 0) {
      score += 50 + shared.length * 20;
    }

    const now = Date.now();
    const waitSeconds = Math.min(Math.floor((now - candidate.joinedAt) / 1000), 60);
    score += waitSeconds * 2;

    return { score, shared };
  }

  async enqueueUser(session: UserSession, io: Server): Promise<void> {
    const match = await this.addUserToQueue(session);
    if (match) {
      this.userToRoom.set(match.userA.socketId, match.roomId);
      this.userToRoom.set(match.userB.socketId, match.roomId);

      // Emit matched event to User A
      io.to(match.userA.socketId).emit('matched', {
        roomId: match.roomId,
        partnerSocketId: match.userB.socketId,
        mode: match.userA.mode,
        peerInitiator: true,
        partnerName: match.userB.name,
        partnerGender: match.userB.gender,
        partnerAge: match.userB.age,
        partnerLanguage: match.userB.language,
        sharedInterests: match.sharedInterests,
      });

      // Emit matched event to User B
      io.to(match.userB.socketId).emit('matched', {
        roomId: match.roomId,
        partnerSocketId: match.userA.socketId,
        mode: match.userB.mode,
        peerInitiator: false,
        partnerName: match.userA.name,
        partnerGender: match.userA.gender,
        partnerAge: match.userA.age,
        partnerLanguage: match.userA.language,
        sharedInterests: match.sharedInterests,
      });
    }
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
        userA: user.socketId,
        userB: bestCandidate.socketId,
        mode: user.mode,
      });

      this.inMemoryRooms.set(roomId, {
        userA: user.socketId,
        userB: bestCandidate.socketId,
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
        userA: user.socketId,
        userB: bestCandidate.socketId,
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

  async dequeueUser(socketId: string): Promise<void> {
    for (const mode of ['text', 'voice', 'video'] as QueueMode[]) {
      await this.removeUserFromQueue(socketId, mode);
    }
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

  async getRoom(roomId: string): Promise<{ userA: string; userB: string; mode: QueueMode } | null> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        const data = await this.redis.hgetall(roomId);
        if (data && data.userA && data.userB) {
          return {
            userA: data.userA,
            userB: data.userB,
            mode: data.mode as QueueMode,
          };
        }
      } catch (err) {
        logger.error({ err }, 'Error getting room from Redis');
      }
    }
    return this.inMemoryRooms.get(roomId) || null;
  }

  async leaveRoom(roomId: string, socketId: string, io: Server): Promise<void> {
    const room = await this.getRoom(roomId);
    if (room) {
      const partnerSocketId = room.userA === socketId ? room.userB : room.userA;
      if (partnerSocketId) {
        io.to(partnerSocketId).emit('partnerLeft', { roomId, reason: 'Stranger disconnected' });
        this.userToRoom.delete(partnerSocketId);
      }
      this.userToRoom.delete(socketId);
      await this.removeRoom(roomId);
    }
  }

  async handleDisconnect(socketId: string, io: Server): Promise<void> {
    await this.dequeueUser(socketId);
    const roomId = this.userToRoom.get(socketId);
    if (roomId) {
      await this.leaveRoom(roomId, socketId, io);
    }
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

export const matchmakingService = new MatchmakingService(redisClient);
