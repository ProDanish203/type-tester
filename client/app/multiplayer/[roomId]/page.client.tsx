"use client";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/store/SocketProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface MultiplayerPageClientProps {
  roomId: string;
}

const MultiplayerPageClient: React.FC<MultiplayerPageClientProps> = ({
  roomId,
}) => {
  const { socket, onlineUsers, joinedUsers, setJoinedUsers } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || !socket) return;
    const storedUsername = localStorage.getItem("username");

    const handleUserJoined = (data: { roomId: string; username: string }) => {
      const { username } = data;
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
    localStorage.removeItem("username");
    localStorage.removeItem("roomId");
    router.push("/");
  };

  return (
    <div>
      <div>Room: {roomId}</div>
      <Button onClick={leaveRoom} variant={"destructive"}>
        Leave Room
      </Button>
    </div>
  );
};

export default MultiplayerPageClient;
