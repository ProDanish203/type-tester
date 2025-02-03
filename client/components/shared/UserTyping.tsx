"use client";

import { cn } from "@/lib/utils";
import { Caret } from "./Caret";

interface UserTypingProps {
  userInput: string;
  words: string;
}

export const UserTyping: React.FC<UserTypingProps> = ({ userInput, words }) => {
  const typedCharacters = userInput.split("");
  return (
    <div className="absolute inset-0">
      {typedCharacters.map((char, index) => (
        <Character
          key={`${char}_${index}`}
          actual={char}
          expected={words[index]}
        />
      ))}
      <Caret />
    </div>
  );
};

const Character = ({
  actual,
  expected,
}: {
  actual: string;
  expected: string;
}) => {
  const isCorrect = actual === expected;
  const isWhitespace = expected === " ";
  return (
    <span
      className={cn({
        "text-primaryCol": isCorrect,
        "text-red-500": !isCorrect && !isWhitespace,
        "bg-red-500": !isCorrect && isWhitespace,
      })}
    >
      {expected}
    </span>
  );
};
