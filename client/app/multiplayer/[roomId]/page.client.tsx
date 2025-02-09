"use client";
import { MultiplayerProgress } from "@/components/shared/MultiplayerProgress";
import { Button } from "@/components/ui/button";
import { getRoomId, getUsername } from "@/lib/utils";
import { useSocket } from "@/store/SocketProvider";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { MultiplayerGame } from "./_components/MultiplayerGame";
import { GameStartingIndicator } from "@/components/shared/GameStartingIndicator";
import { GameState, PlayersProgress } from "@/types/types";

interface MultiplayerPageClientProps {
  roomId: string;
}

const MultiplayerPageClient: React.FC<MultiplayerPageClientProps> = ({
  roomId,
}) => {
  const {
    socket,
    setPlayers,
    players,
    setJoinedUsers,
    gameState,
    setGameState,
  } = useSocket();
  const router = useRouter();
  const [playersProgress, setPlayersProgresss] = useState<PlayersProgress[]>(
    []
  );

  const handleUserJoined = useCallback(
    (data: {
      roomId: string;
      username: string;
      usersInRoom: string[];
      gameState: GameState | null;
    }) => {
      const { username, usersInRoom, gameState } = data;
      const storedUsername = getUsername();

      setPlayers(usersInRoom);
      setGameState(gameState);
      setJoinedUsers((prev: string) => {
        if (storedUsername !== username && !prev.includes(username)) {
          toast.success(`${username} joined the room. Let's play!`, {
            id: username,
          });
          return [...prev, username];
        }
        return prev;
      });
    },
    [setGameState, setJoinedUsers, setPlayers]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !socket) return;
    socket.on("userJoinedRoom", handleUserJoined);

    return () => {
      socket.off("userJoinedRoom", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  const leaveRoom = () => {
    if (typeof window === "undefined" || !socket) return;
    const storedUsername = getUsername();
    const storedRoomId = getRoomId();
    setGameState(null);
    setJoinedUsers([]);
    setPlayers([]);

    if (!storedUsername || !storedRoomId) return;

    socket.emit("leaveRoom", {
      roomId: storedRoomId,
      username: storedUsername,
    });
    localStorage.removeItem("roomId");
    router.push("/");
  };

  if (typeof window === "undefined") return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar to show players */}
      <aside className="flex flex-col max-md:hidden md:py-4 py-8 bg-bgCol border-r-2 min-w-[250px] max-w-[250px] h-screen">
        {/* Main content container */}
        <div className="flex flex-col h-full">
          {/* Header section */}
          <h2 className="md:px-6 px-4 text-xl font-medium border-b-2 pb-5 pt-1 mb-4">
            Game ID: <span className="font-bold text-primaryCol">{roomId}</span>
          </h2>

          {/* Players section - will scroll if content overflows */}
          <div className="px-4 flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold">Players: </h3>
            <div className="flex flex-col gap-y-2 mt-4">
              {players.map((player) => (
                <div key={player} className="flex items-center gap-x-2">
                  <span className="text-lg font-medium">{player}</span>
                  {player === localStorage.getItem("username") && (
                    <span className="text-sm font-light text-gray-400">
                      (You)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer section - will stay at bottom */}
          <footer className="mt-auto pt-8 px-4">
            <p className="text-center text-sm text-gray-500">
              Made with <span className="text-primaryCol">❤️</span> by <br />
              <a
                href="https://github.com/ProDanish203"
                target="_blank"
                className="text-primaryCol"
              >
                Danish Siddiqui
              </a>
            </p>
          </footer>
        </div>
      </aside>

      <div className="w-full">
        {/* Topbar */}
        <div className="md:px-6 px-4 py-4 flex items-center justify-end border-b-2 w-full">
          <Button onClick={leaveRoom} variant={"destructive"}>
            Leave Game
          </Button>
        </div>
        {/* Main Content */}
        <main className="px-2 py-3">
          {/* Progress */}
          <MultiplayerProgress players={playersProgress} />
          {/* Typing Game */}
          {gameState && (
            <MultiplayerGame
              gameState={gameState}
              setPlayersProgresss={setPlayersProgresss}
            />
          )}
          <GameStartingIndicator gameState={gameState || null} />
        </main>
      </div>
    </div>
  );
};

export default MultiplayerPageClient;
