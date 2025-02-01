"use client";
import { useCallback, useEffect, useState } from "react";
import { useWords } from "./useWords";
import { useCountdownTimer } from "./useCountdownTimer";
import { useTyping } from "./useTyping";
import { countErrors } from "@/lib/helpers";

export type State = "start" | "run" | "finish";
const NUMBER_OF_WORDS = 30;
const COUNTDOWN_SECONDS = 40;

export const useEngine = () => {
  const [state, setState] = useState<State>("start");
  const { words, updateWords } = useWords(NUMBER_OF_WORDS);
  const { timeLeft, resetCountdown, startCountdown } =
    useCountdownTimer(COUNTDOWN_SECONDS);

  const { typed, totalTyped, cursor, clearTyped, resetTotalTyped } = useTyping(
    state !== "finish"
  );

  const isStarted = state === "start" && cursor > 0;
  const areWordsFinished = cursor === words.length;

  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);

  const sumErrors = useCallback(() => {
    const wordsReached = words.substring(0, cursor);
    setErrors((prevErrors) => prevErrors + countErrors(typed, wordsReached));
  }, [typed, words, cursor]);

  const calculateWPM = useCallback(() => {
    const elapsedTime = COUNTDOWN_SECONDS - timeLeft;
    if (elapsedTime === 0) return;

    const wordsTyped = (totalTyped - errors) / 5;

    const wordsPerMinute = (wordsTyped / elapsedTime) * 60;

    setWpm(Math.max(0, Math.round(wordsPerMinute)));
  }, [totalTyped, errors, timeLeft]);

  useEffect(() => {
    if (isStarted) {
      setState("run");
      startCountdown();
    }
  }, [isStarted, startCountdown]);

  useEffect(() => {
    if (!timeLeft) {
      setState("finish");
      sumErrors();
      calculateWPM();
    }
  }, [timeLeft, sumErrors]);

  useEffect(() => {
    if (areWordsFinished) {
      sumErrors();
      updateWords();
      clearTyped();
    }
  }, [
    cursor,
    words,
    clearTyped,
    typed,
    areWordsFinished,
    updateWords,
    sumErrors,
  ]);

  const restart = useCallback(() => {
    setState("start");
    resetCountdown();
    resetTotalTyped();
    setErrors(0);
    setWpm(0);
    updateWords();
    clearTyped();
  }, [clearTyped, updateWords, resetTotalTyped, resetCountdown]);

  return { state, words, timeLeft, typed, errors, wpm, totalTyped, restart };
};
