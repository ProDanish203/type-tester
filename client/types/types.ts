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
