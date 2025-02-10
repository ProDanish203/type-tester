"use client";
import { useCallback, useEffect, useState } from "react";
import { fetchWords } from "@/API/words";
import { toast } from "sonner";

// export const generateWords = (count: number): string => {
//   return faker.word.words(count).toLowerCase();
// };

export const useWords = (count: number) => {
  const [words, setWords] = useState<string>("");

  const getWords = async () => {
    const { response, success } = await fetchWords(count);
    if (!success) return toast.error(response || "something went wrong");
    setWords(response);
    return response;
  };

  useEffect(() => {
    getWords();
  }, [count]);

  const updateWords = useCallback(async () => {
    const updatedWords = await getWords();
    setWords(updatedWords);
  }, [count]);

  return { words, updateWords };
};
