import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, JoinQueuePayload } from '@anonchat/types';

import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { initRedis } from './services/redis.js';
import { MatchmakingService } from './services/matchmaking.service.js';
import { registerQueueHandlers } from './sockets/queue.handler.js';
import { registerChatHandlers } from './sockets/chat.handler.js';
import { registerWebRTCHandlers } from './sockets/webrtc.handler.js';
import { globalErrorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false, // Allow inline WebRTC and media elements
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any incoming origin (local network IP, mobile, localhost)
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

const httpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', httpLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'AnonChat Backend', time: new Date().toISOString() });
});

app.use(globalErrorHandler);

const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow any incoming origin for WebSockets (mobile browsers, laptops on local network)
      callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

const redisClient = initRedis();
const matchmakingService = new MatchmakingService(redisClient);

const activeUserModes = new Map<string, JoinQueuePayload['mode']>();
const userRooms = new Map<string, string>();

io.on('connection', (socket) => {
  logger.info({ socketId: socket.id }, 'New socket connected');

  registerQueueHandlers(io, socket, matchmakingService, activeUserModes, userRooms);
  registerChatHandlers(io, socket, userRooms);
  registerWebRTCHandlers(io, socket, userRooms);
});

server.listen(env.PORT, '0.0.0.0', () => {
  logger.info(`AnonChat backend running on 0.0.0.0:${env.PORT} in ${env.NODE_ENV} mode`);
});

export { app, server, io };
