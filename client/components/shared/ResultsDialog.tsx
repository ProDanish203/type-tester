"use client";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { GameState, ResultsProps } from "@/types/types";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn, getRoomId, getUsername } from "@/lib/utils";
import { useSocket } from "@/store/SocketProvider";
import { useRouter } from "next/navigation";

interface Props extends ResultsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  players: GameState["players"];
}

export const ResultsDialog: React.FC<Props> = ({
  open,
  accuracy,
  errors,
  setOpen,
  state,
  wpm,
  players,
}) => {
  const { setGameState, setJoinedUsers, setPlayers, socket } = useSocket();
  const router = useRouter();
  // Get the player with the highest WPM
  const highestWPM = Object.entries(players).reduce(
    (acc, [username, stats]) => {
      if (stats.wpm > acc.wpm) {
        return { username, wpm: stats.wpm };
      }
      return acc;
    },
    { username: "", wpm: 0 }
  );

  const [winner, setWinner] = useState<{
    username: string;
    wpm: number;
  }>({ username: highestWPM.username, wpm: highestWPM.wpm });

  const username = getUsername();

  const handlePlayAgain = () => {};

  const leaveRoom = () => {
    if (typeof window === "undefined" || !socket) return;
    const storedUsername = getUsername();
    const storedRoomId = getRoomId();
    setGameState(null);
    setJoinedUsers([]);
    setPlayers([]);

    if (!storedUsername || !storedRoomId) return;

    // TODO: create this event on the server
    socket.emit("leaveRoom", {
      roomId: storedRoomId,
      username: storedUsername,
    });
    localStorage.removeItem("roomId");
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-semibold tracking-wider">
            Results
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-between">
          <h2
            className={cn(
              "text-xl font-medium mb-4",
              username === winner.username && "text-green-500"
            )}
          >
            {username === winner.username
              ? "You won!"
              : `${winner.username} won with a WPM of ${winner.wpm}`}
          </h2>
          <p className="text-lg text-gray-500 tracking-wider">
            WPM: <span className="text-primaryCol font-bold">{wpm}</span>
          </p>
          <p className="text-lg text-gray-500 tracking-wider">
            Accuracy:{" "}
            <span className="text-primaryCol font-bold">
              {accuracy.toFixed(2)}%
            </span>
          </p>
          <p className="text-lg text-gray-500 tracking-wider">
            Errors: <span className="text-primaryCol font-bold">{errors}</span>
          </p>
        </div>
        <DialogFooter className="mt-4 flex items-center gap-2 w-full">
          <Button
            variant={"destructive"}
            onClick={() => {
              setOpen(false);
              leaveRoom();
            }}
            className="w-full"
          >
            Leave Game
          </Button>
          <Button
            onClick={handlePlayAgain}
            className="bg-green-500 hover:bg-green-600 w-full"
          >
            Play again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
