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

const userSocketMap: Record<string, string> = {}; // username: socketId

io.on("connection", (socket) => {
  const username = socket.handshake.query.username as string | undefined;
  if (!username) return;
  if (username) userSocketMap[username] = socket.id;
  // Send online users data to client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle the disconnect event from client
  socket.on("disconnect", () => {
    delete userSocketMap[username];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
