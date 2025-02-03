import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

export const getRecipientSocketId = (recipientId: string) => {
  return userSocketMap[recipientId];
};

const userSocketMap: Record<string, string> = {}; // userId: socketId

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string | undefined;
  if (!userId) return;
  if (userId) userSocketMap[userId] = socket.id;
  // Send online users data to client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle the disconnect event from client
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
