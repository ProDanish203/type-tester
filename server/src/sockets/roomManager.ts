import { GameState } from "../types/types";
import { getWords } from "../utils/helpers";

export class RoomManager {
  private rooms: Map<string, GameState> = new Map();
  private readonly WORD_COUNT = 50;
  private readonly GAME_DURATION = 40;
  private readonly GAME_START_DELAY = 5;

  async generateWords(): Promise<string | null> {
    return await getWords(this.WORD_COUNT);
  }

  async createRoom(roomId: string): Promise<GameState | null> {
    const words = await this.generateWords();
    if (!words) return null;
    const gameState: GameState = {
      words,
      startTime: null,
      endTime: null,
      players: {},
      status: "waiting",
    };
    this.rooms.set(roomId, gameState);
    return gameState;
  }

  getRoomState(roomId: string): GameState | null {
    return this.rooms.get(roomId) || null;
  }

  deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
  }

  private _countErrors(typed: string, original: string): number {
    return typed.split("").reduce((errors, char, i) => {
      return errors + (char !== original[i] ? 1 : 0);
    }, 0);
  }

  addPlayerToRoom(roomId: string, username: string): GameState | null {
    const gameState = this.rooms.get(roomId);
    if (!gameState) return null;

    gameState.players[username] = {
      typed: "",
      cursor: 0,
      wpm: 0,
      errors: 0,
      finished: false,
    };

    return gameState;
  }

  removePlayerFromRoom(roomId: string, username: string): GameState | null {
    const gameState = this.rooms.get(roomId);
    if (!gameState) return null;

    delete gameState.players[username];

    // If no players left, delete the room
    if (Object.keys(gameState.players).length === 0) this.deleteRoom(roomId);

    return gameState;
  }

  startGame(roomId: string): GameState | null {
    const gameState = this.rooms.get(roomId);
    if (!gameState) return null;

    gameState.status = "running";
    gameState.startTime = Date.now();
    gameState.endTime =
      Date.now() + (this.GAME_DURATION + this.GAME_START_DELAY) * 1000;

    return gameState;
  }

  updatePlayerProgress(
    roomId: string,
    username: string,
    typed: string,
    cursor: number
  ): GameState | null {
    const gameState = this.rooms.get(roomId);
    if (!gameState) return null;

    const player = gameState.players[username];
    if (!player) return null;

    player.typed = typed;
    player.cursor = cursor;

    // Calculate errors
    const wordsReached = gameState.words.substring(0, cursor);
    player.errors = this._countErrors(typed, wordsReached);

    // Calculate WPM if game is running
    if (gameState.startTime) {
      const elapsedTime = (Date.now() - gameState.startTime) / 1000;
      const wordsTyped = (cursor - player.errors) / 5;
      player.wpm = Math.max(0, Math.round((wordsTyped / elapsedTime) * 60));
    }

    return gameState;
  }

  async playAgain(roomId: string): Promise<GameState | null> {
    const gameState = this.rooms.get(roomId);
    if (!gameState) return null;
    const words = await this.generateWords();
    if (!words) return null;
    gameState.words = words;
    gameState.status = "waiting";
    gameState.startTime = null;
    gameState.endTime = null;

    Object.values(gameState.players).forEach((player) => {
      player.typed = "";
      player.cursor = 0;
      player.wpm = 0;
      player.errors = 0;
      player.finished = false;
    });

    return gameState;
  }
}
