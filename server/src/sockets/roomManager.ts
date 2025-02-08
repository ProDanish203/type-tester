import { faker } from "@faker-js/faker";
import { GameState } from "../types/types";

export class RoomManager {
  private rooms: Map<string, GameState> = new Map();
  private readonly WORD_COUNT = 30;
  private readonly GAME_DURATION = 10;

  generateWords(): string {
    return faker.word.words(this.WORD_COUNT).toLowerCase();
  }

  createRoom(roomId: string): GameState {
    const gameState: GameState = {
      words: this.generateWords(),
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

  startGame(roomId: string): GameState | null {
    const gameState = this.rooms.get(roomId);
    if (!gameState) return null;

    gameState.status = "running";
    gameState.startTime = Date.now();
    gameState.endTime = Date.now() + this.GAME_DURATION * 1000;

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
}
