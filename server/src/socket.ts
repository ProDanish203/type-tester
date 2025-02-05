import express from "express";
import { Server } from "socket.io";
import http from "http";
import { generateUniqueRoomId } from "./utils/helpers";

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
  if (username) userSocketMap[username] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Create a room for the user, new game
  socket.on("createRoom", (data: { username: string }) => {
    const { username } = data;
    userSocketMap[username] = socket.id;
    const roomId = generateUniqueRoomId();
    socket.join(roomId);

    socket.emit("roomCreated", { roomId, username });
  });

  // Join a room, existing game
  socket.on("joinRoom", (data: { roomId: string; username: string }) => {
    const { roomId, username } = data;
    userSocketMap[username] = socket.id;

    const currentRooms = Array.from(socket.rooms);
    // Leave any joined rooms
    currentRooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });

    // Join the new room
    socket.join(roomId);

    io.to(roomId).emit("userJoinedRoom", { roomId, username });
  });

  // Handle events within the game for the room

  // Handle the disconnect event from client
  socket.on("disconnect", () => {
    username && delete userSocketMap[username];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
