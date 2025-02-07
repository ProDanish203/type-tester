import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface MultiplayerProgressProps {
  players: { username: string; score: number }[];
}

export const MultiplayerProgress: React.FC<MultiplayerProgressProps> = ({
  players,
}) => {
  const getPlayerPosition = (score: number) => {
    // The track width is considered 100%
    // Convert score to a percentage of track width
    // If score is 100, car should be at the end of track
    const progressPercentage = score <= 10 ? 10 : score;

    // Calculate left position (start from left side)
    // As score increases, left position decreases
    const leftPosition = 100 - progressPercentage;

    return {
      left: `${leftPosition - 2}%`,
    };
  };

  return (
    <div className="relative w-full overflow-x-clip">
      {/* Track */}
      <Image
        src={"/images/track.jpg"}
        alt="track-img"
        width={500}
        height={400}
        className="w-full max-h-[350px] rounded-md select-none"
      />
      {/* Cars */}
      {players.map((player, index) => (
        <div
          key={`${player.username}-${index}`}
          className="absolute transition-all duration-300 ease-linear"
          style={{
            ...getPlayerPosition(player.score),
            bottom: index === 0 ? "2rem" : "5rem", // Fixed vertical positions for each car
          }}
        >
          <Image
            src={`/images/car-${index + 1}.png`}
            alt={player.username}
            width={100}
            height={150}
            className="select-none min-w-[100px]"
          />
          <PlayerLabel
            username={player.username}
            className={cn("right-4", index === 1 && "-top-7")}
          />
        </div>
      ))}
    </div>
  );
};

const PlayerLabel = ({
  username,
  className,
}: {
  username: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute  bg-black text-white px-3 py-1 rounded-md",
        className
      )}
    >
      <p className="text-xs">{username}</p>
    </div>
  );
};
