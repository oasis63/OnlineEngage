import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, SignalPayload, IceCandidatePayload } from '@anonchat/types';

export function registerWebRTCHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  userRooms: Map<string, string>
) {
  socket.on('offer', (payload: SignalPayload) => {
    const currentRoomId = userRooms.get(socket.id);
    if (currentRoomId === payload.roomId) {
      socket.to(payload.roomId).emit('offer', payload);
    }
  });

  socket.on('answer', (payload: SignalPayload) => {
    const currentRoomId = userRooms.get(socket.id);
    if (currentRoomId === payload.roomId) {
      socket.to(payload.roomId).emit('answer', payload);
    }
  });

  socket.on('iceCandidate', (payload: IceCandidatePayload) => {
    const currentRoomId = userRooms.get(socket.id);
    if (currentRoomId === payload.roomId) {
      socket.to(payload.roomId).emit('iceCandidate', payload);
    }
  });
}
