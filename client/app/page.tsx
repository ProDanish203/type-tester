"use client";
import { MultiplayerModal } from "@/components/shared/MultiplayerModal";
import { Results } from "@/components/shared/Results";
import { CountdownTimer, DisplayWords, RestartButton } from "@/components/shared/TypingHelpers";
import { UserTyping } from "@/components/shared/UserTyping";
import { useEngine } from "@/hooks";
import { calculateAccuracyPercentage } from "@/lib/helpers";
import { useState } from "react";

export default function Home() {
  const { state, words, timeLeft, typed, wpm, totalTyped, errors, restart } =
    useEngine();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen w-full flex items-center justify-center lg:px-10 md:px-5 px-4 bg-bgCol text-text">
      <div className="container">
        <div className="flex justify-end w-full mb-10">
          <MultiplayerModal open={modalOpen} setOpen={setModalOpen} />
        </div>
        <div className="flex items-center justify-between mb-4">
          <CountdownTimer timeLeft={timeLeft} />
          <RestartButton handleReset={restart} />
        </div>
        <div className="relative text-4xl font-bold font-mono tracking-wider leading-snug mx-auto w-full break-all">
          <DisplayWords words={words} />
          <UserTyping userInput={typed} words={words} />
        </div>

        <div className="mt-10">
          <Results
            state={state}
            accuracy={calculateAccuracyPercentage(errors, totalTyped)}
            errors={errors}
            wpm={wpm}
          />
        </div>
      </div>
    </main>
  );
}
