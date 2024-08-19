import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_COMMUNITY_SERVER_URL || '';
export interface PongResponse {
  event: string;
  data: string;
}

const clientId = Math.random().toString(36).substring(2, 10);
export const socket: Socket = io(SOCKET_URL, {
  auth: {
    clientId,
  },
});

// Handle connection events
socket.on('connect', () => {
  console.log(`Connected with id: ${socket.id}`);
});
