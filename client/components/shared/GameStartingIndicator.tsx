"use client";
import { GameState } from "@/types/types";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { cn, getRoomId } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface GameStartingIndicatorProps {
  gameState: GameState | null;
}

export const GameStartingIndicator: React.FC<GameStartingIndicatorProps> = ({
  gameState,
}) => {
  const [open, setOpen] = useState(true);
  const [loadingState, setLoadingState] = useState<"waiting" | "starting">(
    "waiting"
  );
  const roomId = getRoomId();

  const [countdown, setCountdown] = useState(3);
  const [showGameStarted, setShowGameStarted] = useState(false);

  useEffect(() => {
    if (!gameState) return setLoadingState("waiting");
    setLoadingState(gameState.status === "running" ? "starting" : "waiting");
  }, [gameState]);

  useEffect(() => {
    if (loadingState === "starting" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (loadingState === "starting" && countdown === 0) {
      const timer = setTimeout(() => {
        setShowGameStarted(true);
      }, 500);

      const closeTimer = setTimeout(() => {
        setOpen(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    }
  }, [countdown, loadingState]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/joinroom/${roomId}`
    );
    toast.info("Link copied to clipboard!");
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md flex flex-col items-center justify-center min-h-[200px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownCapture={(e) => e.preventDefault()}
      >
        <DialogHeader className="w-full text-center">
          <DialogTitle
            className={cn(
              "text-2xl font-bold text-center",
              loadingState === "starting" && "text-green-500"
            )}
          >
            {loadingState === "waiting"
              ? "Waiting for Players"
              : "Game Starting"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          {loadingState === "waiting" ? (
            <>
              <div className="loader" />
              <p className="text-lg text-muted-foreground animate-pulse">
                Waiting for other players to join...
              </p>
            </>
          ) : showGameStarted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-primary"
            >
              Game Started!
            </motion.div>
          ) : (
            <div className="text-6xl font-bold text-primary animate-pulse">
              {countdown}
            </div>
          )}
        </div>
        {loadingState === "waiting" && (
          <DialogFooter>
            <p
              className="text-center text-sm text-muted-foreground"
              onClick={handleCopyLink}
            >
              Share the{" "}
              <span className="text-green-500 font-medium cursor-pointer">
                Link
              </span>{" "}
              with your friends to play together!{" "}
            </p>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
