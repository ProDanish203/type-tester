"use client";
import { MultiplayerProgress } from "@/components/shared/MultiplayerProgress";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/store/SocketProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

interface MultiplayerPageClientProps {
  roomId: string;
}

const MultiplayerPageClient: React.FC<MultiplayerPageClientProps> = ({
  roomId,
}) => {
  const {
    socket,
    onlineUsers,
    joinedUsers,
    setPlayers,
    players,
    setJoinedUsers,
  } = useSocket();
  const router = useRouter();

  const handleUserJoined = (data: {
    roomId: string;
    username: string;
    usersInRoom: string[];
  }) => {
    const { username, usersInRoom } = data;
    const storedUsername = localStorage.getItem("username");

    setPlayers(usersInRoom);
    setJoinedUsers((prev: string) => {
      if (storedUsername !== username && !prev.includes(username)) {
        toast.success(`${username} joined the room. Let's play!`, {
          id: username,
        });
        return [...prev, username];
      }
      return prev;
    });
  };

  useEffect(() => {
    if (typeof window === "undefined" || !socket) return;
    socket.on("userJoinedRoom", handleUserJoined);

    return () => {
      socket.off("userJoinedRoom", handleUserJoined);
    };
  }, [socket]);

  const leaveRoom = () => {
    if (typeof window === "undefined" || !socket) return;
    const storedUsername = localStorage.getItem("username");
    const storedRoomId = localStorage.getItem("roomId");

    if (!storedUsername || !storedRoomId) return;

    // TODO: create this event on the server
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
      <div className="md:py-4 py-8 bg-bgCol border-r-2 min-w-[250px] max-w-[250px] h-screen w-full">
        <h2 className="md:px-6 px-4 text-xl font-medium border-b-2 pb-5 pt-1 mb-4">
          Game ID: <span className="font-bold text-primaryCol">{roomId}</span>
        </h2>
        <div className="px-4">
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
      </div>

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
          <MultiplayerProgress
            players={[
              { username: "Danish", score: 70 },
              { username: "Mustafa", score: 40 },
            ]}
          />
          {/* Typing Game */}
        </main>
      </div>
    </div>
  );
};

export default MultiplayerPageClient;
