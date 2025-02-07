"use client";
import { getRoomId, getUsername } from "@/lib/utils";
import { useSocket } from "@/store/SocketProvider";
import { GameState } from "@/types/types";
import { useState, useEffect, useCallback } from "react";

export const useMultiplayerEngine = () => {
  const { socket, gameState, setGameState } = useSocket();
  const [typed, setTyped] = useState("");
  const [cursor, setCursor] = useState(0);
  const roomId = getRoomId();
  const username = getUsername();

  const keyboardHandler = useCallback(
    ({ key, code }: KeyboardEvent) => {
      if (
        gameState?.status !== "running" ||
        (!code.startsWith("Key") &&
          !code.startsWith("Digit") &&
          code !== "Space" &&
          code !== "Backspace")
      )
        return;

      switch (key) {
        case "Backspace":
          setTyped((prev) => prev.slice(0, -1));
          setCursor((prev) => Math.max(0, prev - 1));
          break;
        default:
          setTyped((prev) => prev.concat(key));
          setCursor((prev) => prev + 1);
      }
    },
    [gameState?.status]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyboardHandler);
    return () => window.removeEventListener("keydown", keyboardHandler);
  }, [keyboardHandler]);

  // Send updates to server when user types
  useEffect(() => {
    if (!socket) return;

    if (gameState?.status === "running") {
      socket.emit("playerUpdate", {
        roomId,
        username,
        typed,
        cursor,
      });
    }
  }, [typed, cursor, roomId, username, gameState?.status]);

  // Listen for game state updates
  useEffect(() => {
    if (!socket) return;
    socket.on("gameStateUpdate", ({ gameState }: { gameState: GameState }) => {
      setGameState(gameState);
    });

    socket.on("gameStarted", ({ gameState }: { gameState: GameState }) => {
      setGameState(gameState);
      setTyped("");
      setCursor(0);
    });

    socket.on("gameEnded", ({ gameState }: { gameState: GameState }) => {
      setGameState(gameState);
    });

    return () => {
      socket.off("gameStateUpdate");
      socket.off("gameStarted");
      socket.off("gameEnded");
    };
  }, [gameState?.status]);

  const startGame = useCallback(() => {
    if (!socket) return;
    socket.emit("startGame", { roomId });
  }, [roomId]);

  return {
    typed,
    cursor,
    startGame,
  };
};
