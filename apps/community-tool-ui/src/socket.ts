import { io, Socket } from 'socket.io-client';
export interface PongResponse {
  event: string;
  data: string;
}
const clientId = 'dsdad';
export const socket: Socket = io(process.env.NEXT_PUBLIC_SOKET_URL || '', {
  auth: {
    clientId,
  },
});

// Handle connection events
socket.on('connect', () => {
  console.log(`Connected with id: ${socket.id}`);
});
