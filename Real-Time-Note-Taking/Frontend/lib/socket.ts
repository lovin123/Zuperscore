import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (
  serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
) => {
  if (!socket) {
    socket = io(serverUrl, {
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
