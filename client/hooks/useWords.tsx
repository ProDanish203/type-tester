"use client";
import { useCallback, useState } from "react";
import { faker } from "@faker-js/faker";

export const generateWords = (count: number): string => {
  return faker.word.words(count).toLowerCase();
};

export const useWords = (count: number) => {
  const [words, setWords] = useState<string>(generateWords(count));

  const updateWords = useCallback(() => {
    setWords(generateWords(count));
  }, [count]);

  return { words, updateWords };
};
