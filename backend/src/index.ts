import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { matchmakingService } from './services/matchmaking.service.js';
import { joinQueueSchema, chatMessageSchema } from './shared/index.js';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  JoinQueuePayload,
  ChatMessagePayload,
  SignalPayload,
  IceCandidatePayload,
  NextPayload,
} from './types/index.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  logger.info(`Socket connected: ${socket.id}`);

  // 1. Join Matchmaking Queue
  socket.on('joinQueue', async (payload: JoinQueuePayload) => {
    try {
      const limitCheck = rateLimiter.checkJoinQueue(socket.id);
      if (limitCheck.limited) {
        socket.emit('rateLimitExceeded', { message: 'Too many queue join requests' });
        return;
      }

      const parsed = joinQueueSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit('error', { message: 'Invalid queue join parameters' });
        return;
      }

      const userSession = {
        sessionId: socket.id,
        socketId: socket.id,
        name: parsed.data.name,
        gender: parsed.data.gender,
        interestedIn: parsed.data.interestedIn || 'all',
        age: parsed.data.age,
        mode: parsed.data.mode,
        language: parsed.data.language,
        interests: parsed.data.interests || [],
        joinedAt: Date.now(),
      };

      socket.emit('queueStatus', { status: 'waiting' });
      await matchmakingService.enqueueUser(userSession, io);
    } catch (err: any) {
      logger.error(`Error in joinQueue: ${err.message}`);
      socket.emit('error', { message: 'Failed to join queue' });
    }
  });

  // 2. Leave Queue
  socket.on('leaveQueue', async () => {
    try {
      await matchmakingService.dequeueUser(socket.id);
      socket.emit('queueStatus', { status: 'idle' });
    } catch (err: any) {
      logger.error(`Error in leaveQueue: ${err.message}`);
    }
  });

  // 3. Next Stranger
  socket.on('next', async (payload: NextPayload) => {
    try {
      const limitCheck = rateLimiter.checkNextButton(socket.id);
      if (limitCheck.limited) {
        socket.emit('rateLimitExceeded', { message: 'Please wait before clicking Next again' });
        return;
      }

      if (payload.roomId) {
        await matchmakingService.leaveRoom(payload.roomId, socket.id, io);
      } else {
        await matchmakingService.dequeueUser(socket.id);
      }

      socket.emit('queueStatus', { status: 'idle' });
    } catch (err: any) {
      logger.error(`Error in next: ${err.message}`);
    }
  });

  // 4. Text Messaging
  socket.on('message', async (payload: ChatMessagePayload) => {
    try {
      const limitCheck = rateLimiter.checkChatMessage(socket.id);
      if (limitCheck.limited) {
        socket.emit('rateLimitExceeded', { message: 'Sending messages too fast' });
        return;
      }

      const parsed = chatMessageSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit('error', { message: 'Invalid message payload' });
        return;
      }

      const room = await matchmakingService.getRoom(parsed.data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Chat room not found' });
        return;
      }

      const partnerSocketId = room.userA === socket.id ? room.userB : room.userA;
      if (partnerSocketId) {
        io.to(partnerSocketId).emit('message', {
          roomId: parsed.data.roomId,
          content: parsed.data.content,
          timestamp: parsed.data.timestamp || Date.now(),
        });
      }
    } catch (err: any) {
      logger.error(`Error in message handler: ${err.message}`);
      socket.emit('error', { message: 'Failed to deliver message' });
    }
  });

  // 5. Typing Indicators
  socket.on('typing', async (payload: { roomId: string }) => {
    try {
      const room = await matchmakingService.getRoom(payload.roomId);
      if (room) {
        const partnerSocketId = room.userA === socket.id ? room.userB : room.userA;
        if (partnerSocketId) {
          io.to(partnerSocketId).emit('typing', { roomId: payload.roomId });
        }
      }
    } catch (err: any) {
      logger.error(`Error in typing handler: ${err.message}`);
    }
  });

  socket.on('stopTyping', async (payload: { roomId: string }) => {
    try {
      const room = await matchmakingService.getRoom(payload.roomId);
      if (room) {
        const partnerSocketId = room.userA === socket.id ? room.userB : room.userA;
        if (partnerSocketId) {
          io.to(partnerSocketId).emit('stopTyping', { roomId: payload.roomId });
        }
      }
    } catch (err: any) {
      logger.error(`Error in stopTyping handler: ${err.message}`);
    }
  });

  // 6. WebRTC Signaling (Offers, Answers & Candidates)
  socket.on('signal', async (payload: SignalPayload) => {
    try {
      if (payload.targetSocketId) {
        io.to(payload.targetSocketId).emit('signal', {
          roomId: payload.roomId,
          signal: payload.signal,
          fromSocketId: socket.id,
        });
      } else {
        const room = await matchmakingService.getRoom(payload.roomId);
        if (room) {
          const partnerSocketId = room.userA === socket.id ? room.userB : room.userA;
          if (partnerSocketId) {
            io.to(partnerSocketId).emit('signal', {
              roomId: payload.roomId,
              signal: payload.signal,
              fromSocketId: socket.id,
            });
          }
        }
      }
    } catch (err: any) {
      logger.error(`Error in WebRTC signal handler: ${err.message}`);
    }
  });

  socket.on('iceCandidate', async (payload: IceCandidatePayload) => {
    try {
      if (payload.targetSocketId) {
        io.to(payload.targetSocketId).emit('iceCandidate', {
          roomId: payload.roomId,
          candidate: payload.candidate,
          fromSocketId: socket.id,
        });
      } else {
        const room = await matchmakingService.getRoom(payload.roomId);
        if (room) {
          const partnerSocketId = room.userA === socket.id ? room.userB : room.userA;
          if (partnerSocketId) {
            io.to(partnerSocketId).emit('iceCandidate', {
              roomId: payload.roomId,
              candidate: payload.candidate,
              fromSocketId: socket.id,
            });
          }
        }
      }
    } catch (err: any) {
      logger.error(`Error in ICE candidate handler: ${err.message}`);
    }
  });

  // 7. Disconnect
  socket.on('disconnect', async () => {
    logger.info(`Socket disconnected: ${socket.id}`);
    rateLimiter.cleanup(socket.id);
    await matchmakingService.handleDisconnect(socket.id, io);
  });
});

httpServer.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
