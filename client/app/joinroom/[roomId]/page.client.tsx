"use client";
import { MultiplayerModal } from "@/components/shared/MultiplayerModal";
import { useEffect } from "react";

export const JoinRoomPageClient = ({ roomId }: { roomId: string }) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("roomId", roomId);
  }, []);

  return <MultiplayerModal open={true} isJoin paramsRoomId={roomId} />;
};
