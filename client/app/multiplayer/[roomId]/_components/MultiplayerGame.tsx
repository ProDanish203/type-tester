"use client";
import { Results } from "@/components/shared/Results";
import {
  CountdownTimer,
  DisplayWords,
} from "@/components/shared/TypingHelpers";
import { UserTyping } from "@/components/shared/UserTyping";
import { useMultiplayerEngine } from "@/hooks/useMultiplayerEngine";
import { calculateAccuracyPercentage } from "@/lib/helpers";
import { getUsername } from "@/lib/utils";
import { GameState } from "@/types/types";
import { useCallback, useEffect } from "react";

interface MultiplayerGameProps {
  gameState: GameState;
  setPlayersProgresss: any;
}

export const MultiplayerGame: React.FC<MultiplayerGameProps> = ({
  gameState,
  setPlayersProgresss,
}) => {
  const username = getUsername();
  const { typed, cursor, startGame } = useMultiplayerEngine();

  const updateProgress = useCallback(() => {
    const progressPlayers = Object.entries(gameState.players).map(
      ([username, stats]) => ({
        username,
        score: (stats.cursor / gameState.words.length) * 100,
      })
    );
    setPlayersProgresss(progressPlayers);
  }, [gameState.players, gameState.words.length, setPlayersProgresss]);

  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  useEffect(() => {
    if (gameState.status === "waiting") {
      setTimeout(() => {
        startGame();
      }, 3000);
    }
  }, [gameState.status, startGame]);

  // Get current player's stats
  const currentPlayer = username && gameState.players[username];
  const timeLeft = gameState.endTime
    ? Math.max(0, Math.ceil((gameState.endTime - Date.now()) / 1000))
    : 40; // Default time if game hasn't started

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
        <div className="mt-10">
          <Results
            state="finish"
            accuracy={calculateAccuracyPercentage(
              currentPlayer.errors,
              currentPlayer.cursor
            )}
            errors={currentPlayer.errors}
            wpm={currentPlayer.wpm}
          />
        </div>
      )}
    </div>
  );
};
