import { State } from "@/hooks/useEngine";

export interface GameState {
  words: string;
  startTime: number | null;
  endTime: number | null;
  players: {
    [username: string]: {
      typed: string;
      cursor: number;
      wpm: number;
      errors: number;
      finished: boolean;
    };
  };
  status: "waiting" | "running" | "finished";
}

export interface ResultsProps {
  errors: number;
  accuracy: number;
  wpm: number;
  state: State;
}

export interface PlayersProgress {
  username: string;
  score: number;
}
