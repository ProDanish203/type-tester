"use client";
import { useState, useCallback, useRef, useEffect } from "react";

const isKeyboardCodeAllowed = (code: string) => {
  return (
    code.startsWith("Key") ||
    code.startsWith("Digit") ||
    code === "Space" ||
    code === "Backspace"
  );
};

export const useTyping = (enabled: boolean, modalOpen: boolean) => {
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState("");
  const totalTyped = useRef(0);

  const keyboardHandler = useCallback(
    ({ key, code }: KeyboardEvent) => {
      if (!enabled || !isKeyboardCodeAllowed(code) || modalOpen) return;

      switch (key) {
        case "Backspace":
          setTyped((prevTyped) => prevTyped.slice(0, -1));
          setCursor((prevCursor) => Math.max(0, prevCursor - 1));
          // setCursor((prevCursor) => prevCursor - 1);
          totalTyped.current -= 1;
          break;

        default:
          setTyped((prevTyped) => prevTyped.concat(key));
          setCursor((prevCursor) => prevCursor + 1);
          totalTyped.current += 1;
      }
    },
    [cursor, enabled, modalOpen]
  );

  const clearTyped = useCallback(() => {
    setTyped("");
    setCursor(0);
  }, []);

  const resetTotalTyped = useCallback(() => {
    totalTyped.current = 0;
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", keyboardHandler);

    return () => {
      window.removeEventListener("keydown", keyboardHandler);
    };
  }, [keyboardHandler]);

  return {
    typed,
    cursor,
    totalTyped: totalTyped.current,
    clearTyped,
    resetTotalTyped,
  };
};
