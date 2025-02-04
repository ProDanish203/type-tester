"use client";
import { MultiplayerModal } from "@/components/shared/MultiplayerModal";
import { Results } from "@/components/shared/Results";
import { UserTyping } from "@/components/shared/UserTyping";
import { Button } from "@/components/ui/button";
import { useEngine } from "@/hooks";
import { calculateAccuracyPercentage } from "@/lib/helpers";
import { RotateCw } from "lucide-react";
import { useRef, useState } from "react";

export default function Home() {
  const { state, words, timeLeft, typed, wpm, totalTyped, errors, restart } =
    useEngine();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen w-full flex items-center justify-center lg:px-10 md:px-5 px-4 bg-bgCol text-text">
      <div className="container">
        <MultiplayerModal open={modalOpen} setOpen={setModalOpen} />
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

const DisplayWords = ({ words }: { words: string }) => {
  return <p className="text-gray-500">{words}</p>;
};

const CountdownTimer = ({ timeLeft }: { timeLeft: number }) => {
  return (
    <div className="flex items-center">
      <h2 className="text-primaryCol text-2xl font-semibold">
        Time: {timeLeft}
      </h2>
    </div>
  );
};

const RestartButton = ({ handleReset }: { handleReset: () => void }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButonClick = () => {
    buttonRef.current?.blur();
    handleReset();
  };

  return (
    <Button className="px-4" variant={"secondary"} onClick={handleButonClick}>
      <RotateCw size={20} />
    </Button>
  );
};
