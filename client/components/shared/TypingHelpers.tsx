"use client";
import { RotateCw } from "lucide-react";
import { useRef } from "react";
import { Button } from "../ui/button";

export const DisplayWords = ({ words }: { words: string }) => {
  return <p className="text-gray-500">{words}</p>;
};

export const CountdownTimer = ({ timeLeft }: { timeLeft: number }) => {
  return (
    <div className="flex items-center">
      <h2 className="text-primaryCol text-2xl font-semibold">
        Time: {timeLeft}
      </h2>
    </div>
  );
};

export const RestartButton = ({ handleReset }: { handleReset: () => void }) => {
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
