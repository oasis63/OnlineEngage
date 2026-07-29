import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { ClientToServerEvents, ServerToClientEvents, JoinQueuePayload, NextPayload, UserSession } from '@anonchat/types';
import { joinQueueSchema, sanitizeInterests } from '@anonchat/shared';
import { MatchmakingService } from '../services/matchmaking.service.js';
import { isSocketRateLimited, cleanupSocketRateLimit } from '../middleware/rateLimiter.js';
import { logger } from '../utils/logger.js';

export function registerQueueHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  matchmakingService: MatchmakingService,
  activeUserModes: Map<string, JoinQueuePayload['mode']>,
  userRooms: Map<string, string>
) {
  socket.on('joinQueue', async (rawPayload: JoinQueuePayload) => {
    const rateCheck = isSocketRateLimited(socket, 'joinQueue');
    if (rateCheck.limited) {
      socket.emit('rateLimitExceeded', {
        message: 'Please wait before joining queue again.',
        retryAfterMs: rateCheck.retryAfterMs,
      });
      return;
    }

    const validation = joinQueueSchema.safeParse(rawPayload);
    if (!validation.success) {
      socket.emit('error', {
        code: 'INVALID_PAYLOAD',
        message: validation.error.errors[0]?.message || 'Invalid queue parameters provided.',
      });
      return;
    }

    const payload = validation.data;
    const sanitizedInterests = sanitizeInterests(payload.interests);
    activeUserModes.set(socket.id, payload.mode);

    // If user was already in a room, leave room first
    const existingRoomId = userRooms.get(socket.id);
    if (existingRoomId) {
      await leaveRoom(io, socket, existingRoomId, matchmakingService, userRooms);
    }

    const session: UserSession = {
      sessionId: uuidv4(),
      socketId: socket.id,
      name: payload.name,
      gender: payload.gender,
      interestedIn: payload.interestedIn || 'all',
      age: payload.age,
      mode: payload.mode,
      language: payload.language,
      interests: sanitizedInterests,
      joinedAt: Date.now(),
    };

    socket.emit('queueStatus', { status: 'waiting', estimatedWaitSeconds: 5 });

    const match = await matchmakingService.addUserToQueue(session);

    if (match) {
      const { roomId, userA, userB, sharedInterests } = match;

      userRooms.set(userA.socketId, roomId);
      userRooms.set(userB.socketId, roomId);

      const socketA = io.sockets.sockets.get(userA.socketId);
      const socketB = io.sockets.sockets.get(userB.socketId);

      if (socketA) socketA.join(roomId);
      if (socketB) socketB.join(roomId);

      if (socketA) {
        socketA.emit('matched', {
          roomId,
          partnerSocketId: userB.socketId,
          mode: userA.mode,
          peerInitiator: true,
          partnerName: userB.name,
          partnerGender: userB.gender,
          partnerAge: userB.age,
          partnerLanguage: userB.language,
          sharedInterests,
        });
      }

      if (socketB) {
        socketB.emit('matched', {
          roomId,
          partnerSocketId: userA.socketId,
          mode: userB.mode,
          peerInitiator: false,
          partnerName: userA.name,
          partnerGender: userA.gender,
          partnerAge: userA.age,
          partnerLanguage: userA.language,
          sharedInterests,
        });
      }

      logger.info({ roomId, mode: userA.mode }, 'Users matched successfully');
    }
  });

  socket.on('leaveQueue', async () => {
    const mode = activeUserModes.get(socket.id);
    if (mode) {
      await matchmakingService.removeUserFromQueue(socket.id, mode);
    }
    const roomId = userRooms.get(socket.id);
    if (roomId) {
      await leaveRoom(io, socket, roomId, matchmakingService, userRooms);
    }
    socket.emit('queueStatus', { status: 'idle' });
  });

  socket.on('next', async (payload: NextPayload) => {
    const rateCheck = isSocketRateLimited(socket, 'next');
    if (rateCheck.limited) {
      socket.emit('rateLimitExceeded', {
        message: 'Please wait before clicking Next again.',
        retryAfterMs: rateCheck.retryAfterMs,
      });
      return;
    }

    const roomId = userRooms.get(socket.id) || payload.roomId;
    if (roomId) {
      await leaveRoom(io, socket, roomId, matchmakingService, userRooms);
    }
  });

  socket.on('disconnect', async () => {
    logger.info({ socketId: socket.id }, 'Socket disconnected');
    const mode = activeUserModes.get(socket.id);
    if (mode) {
      await matchmakingService.removeUserFromQueue(socket.id, mode);
      activeUserModes.delete(socket.id);
    }

    const roomId = userRooms.get(socket.id);
    if (roomId) {
      await leaveRoom(io, socket, roomId, matchmakingService, userRooms);
    }

    cleanupSocketRateLimit(socket.id);
  });
}

export async function leaveRoom(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  roomId: string,
  matchmakingService: MatchmakingService,
  userRooms: Map<string, string>
) {
  socket.to(roomId).emit('partnerLeft', {
    roomId,
    reason: 'Stranger has disconnected or left the chat.',
  });

  socket.leave(roomId);
  userRooms.delete(socket.id);

  const roomData = await matchmakingService.getRoom(roomId);
  if (roomData) {
    const partnerId = roomData.userAId === socket.id ? roomData.userBId : roomData.userAId;
    userRooms.delete(partnerId);
    await matchmakingService.removeRoom(roomId);
  }
}
