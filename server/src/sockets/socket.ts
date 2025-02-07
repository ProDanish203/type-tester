import express from "express";
import { Server } from "socket.io";
import http from "http";
import { generateUniqueRoomId } from "../utils/helpers";
import { RoomManager } from "./roomManager";

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

const roomManager = new RoomManager();

io.on("connection", (socket) => {
  const username = socket.handshake.query.username as string | undefined;
  if (username) userSocketMap[username] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Create a room for the user, new game
  socket.on("createRoom", (data: { username: string }) => {
    const { username } = data;
    userSocketMap[username] = socket.id;
    const roomId = generateUniqueRoomId();
    const gameState = roomManager.createRoom(roomId);
    roomManager.addPlayerToRoom(roomId, username);
    socket.join(roomId);

    socket.emit("roomCreated", { roomId, username, gameState });
  });

  // Join a room, existing game
  socket.on("joinRoom", (data: { roomId: string; username: string }) => {
    const { roomId, username } = data;
    userSocketMap[username] = socket.id;
    const gameState = roomManager.addPlayerToRoom(roomId, username);

    const currentRooms = Array.from(socket.rooms);
    // Leave any joined rooms
    currentRooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });

    // Join the new room
    socket.join(roomId);
    // Get all the users in the room
    const usersInRoom = io.sockets.adapter.rooms.get(roomId);
    const usersInRoomArray = usersInRoom ? Array.from(usersInRoom) : [];

    const usersInRoomWithUsername = usersInRoomArray.map((socketId) => {
      return Object.keys(userSocketMap).find(
        (username) => userSocketMap[username] === socketId
      );
    });

    io.to(roomId).emit("userJoinedRoom", {
      roomId,
      username,
      usersInRoom: usersInRoomWithUsername,
      gameState,
    });
  });

  socket.on(
    "playerUpdate",
    (data: {
      roomId: string;
      username: string;
      typed: string;
      cursor: number;
    }) => {
      const gameState = roomManager.updatePlayerProgress(
        data.roomId,
        data.username,
        data.typed,
        data.cursor
      );

      if (gameState) {
        io.to(data.roomId).emit("gameStateUpdate", { gameState });
      }
    }
  );

  socket.on("startGame", (data: { roomId: string }) => {
    const gameState = roomManager.startGame(data.roomId);
    if (gameState) {
      io.to(data.roomId).emit("gameStarted", { gameState });

      // Set up game end timeout
      setTimeout(() => {
        gameState.status = "finished";
        io.to(data.roomId).emit("gameEnded", { gameState });
      }, 60000); // 40 seconds
    }
  });

  // Handle the disconnect event from client
  socket.on("disconnect", () => {
    username && delete userSocketMap[username];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
