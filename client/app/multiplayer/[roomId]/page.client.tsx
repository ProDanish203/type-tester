"use client";
import React from "react";

interface MultiplayerPageClientProps {
  roomId: string;
}

const MultiplayerPageClient: React.FC<MultiplayerPageClientProps> = ({
  roomId,
}) => {
  return (
    <div>
      <div>Room: {roomId}</div>
    </div>
  );
};

export default MultiplayerPageClient;
