"use client";
import { ResultsDialog } from "@/components/shared/ResultsDialog";
import {
  CountdownTimer,
  DisplayWords,
} from "@/components/shared/TypingHelpers";
import { UserTyping } from "@/components/shared/UserTyping";
import { useMultiplayerEngine } from "@/hooks/useMultiplayerEngine";
import { GAME_DURATION } from "@/lib/constants";
import { calculateAccuracyPercentage } from "@/lib/helpers";
import { getUsername } from "@/lib/utils";
import { GameState, PlayersProgress } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

interface MultiplayerGameProps {
  gameState: GameState;
  setPlayersProgresss: (playerProgress: PlayersProgress[]) => void;
}

export const MultiplayerGame: React.FC<MultiplayerGameProps> = ({
  gameState,
  setPlayersProgresss,
}) => {
  const [displayResults, setDisplayResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const username = getUsername();
  const { typed, cursor, startGame } = useMultiplayerEngine();

  const updateProgress = useCallback(() => {
    const progressPlayers = Object.entries(gameState.players).map(
      ([username, stats]) => {
        const effectiveProgress = Math.max(0, stats.cursor - stats.errors);
        const score = (effectiveProgress / gameState.words.length) * 100;

        return {
          username,
          score: Math.max(0, Math.min(100, score)),
        };
      }
    );
    setPlayersProgresss(progressPlayers);
  }, [gameState.players, gameState.words.length, setPlayersProgresss]);

  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  useEffect(() => {
    if (gameState.status === "waiting") startGame();
  }, [gameState.status, startGame]);

  // Get current player's stats
  const currentPlayer = username && gameState.players[username];

  useEffect(() => {
    if (gameState.endTime) {
      const initialTimeLeft = Math.max(
        0,
        Math.ceil((gameState.endTime - Date.now()) / 1000)
      );
      setTimeLeft(initialTimeLeft);
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerInterval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [gameState.endTime]);

  useEffect(() => {
    if (gameState.status === "finished" && currentPlayer)
      setDisplayResults(true);
  }, [gameState.status, currentPlayer]);

  return (
    <div className="container mt-10">
      <div className="flex items-center justify-between mb-4">
        <CountdownTimer timeLeft={timeLeft} />
      </div>
      <div className="relative text-4xl font-bold font-mono tracking-wider leading-snug mx-auto w-full break-all">
        <DisplayWords words={gameState.words} />
        <UserTyping userInput={typed} words={gameState.words} />
      </div>
      {gameState.status === "finished" && currentPlayer && (
        <ResultsDialog
          state="finish"
          accuracy={calculateAccuracyPercentage(
            currentPlayer.errors,
            currentPlayer.cursor
          )}
          errors={currentPlayer.errors}
          wpm={currentPlayer.wpm}
          open={displayResults}
          setOpen={setDisplayResults}
          players={gameState.players}
        />
      )}
    </div>
  );
};
