import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, ChatMessagePayload, TypingPayload } from '@anonchat/types';
import { chatMessageSchema } from '@anonchat/shared';
import { isSocketRateLimited } from '../middleware/rateLimiter.js';

export function registerChatHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  userRooms: Map<string, string>
) {
  socket.on('message', (rawPayload: ChatMessagePayload) => {
    const rateCheck = isSocketRateLimited(socket, 'message');
    if (rateCheck.limited) {
      socket.emit('rateLimitExceeded', {
        message: 'You are sending messages too quickly.',
        retryAfterMs: rateCheck.retryAfterMs,
      });
      return;
    }

    const validation = chatMessageSchema.safeParse(rawPayload);
    if (!validation.success) {
      socket.emit('error', {
        code: 'INVALID_MESSAGE',
        message: 'Invalid message payload.',
      });
      return;
    }

    const payload = validation.data;
    const currentRoomId = userRooms.get(socket.id);

    if (!currentRoomId || currentRoomId !== payload.roomId) {
      socket.emit('error', {
        code: 'NOT_IN_ROOM',
        message: 'You are not in an active room.',
      });
      return;
    }

    // Broadcast message to room partner
    socket.to(payload.roomId).emit('message', payload);
  });

  socket.on('typing', (payload: TypingPayload) => {
    const currentRoomId = userRooms.get(socket.id);
    if (currentRoomId === payload.roomId) {
      socket.to(payload.roomId).emit('typing', payload);
    }
  });

  socket.on('stopTyping', (payload: { roomId: string }) => {
    const currentRoomId = userRooms.get(socket.id);
    if (currentRoomId === payload.roomId) {
      socket.to(payload.roomId).emit('stopTyping', payload);
    }
  });
}
