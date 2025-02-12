"use client";
import { useEffect, useState } from "react";
import { fetchWords } from "@/API/words";
import { toast } from "sonner";

// export const generateWords = (count: number): string => {
//   return faker.word.words(count).toLowerCase();
// };

export const useWords = (count: number) => {
  const [words, setWords] = useState<string>("");
  const [updatedWords, setUpdatedWords] = useState<string>("");

  const getWords = async () => {
    const [newWords, updatedWords] = await Promise.all([
      fetchWords(count),
      fetchWords(count),
    ]);
    if (!newWords.success || !updatedWords.success)
      return toast.error(newWords.response || "Something went wrong");
    setWords(newWords.response);
    setUpdatedWords(updatedWords.response);
    return newWords.response;
  };

  useEffect(() => {
    getWords();
  }, [count]);

  const updateWords = () => {
    setWords(updatedWords);
  };

  return { words, updateWords };
};
