import { create } from "zustand";
import { Attempt, SlotValue } from "@/components/wordle/wordle-utils";
import { CraftingTableName } from "@/types";

interface WordleState {
  date: string;
  table: CraftingTableName;
  attempts: Attempt[];
  currentSlots: SlotValue[];
  gameState: "playing" | "won" | "revealed";
  completedAtMs?: number;
  totalTimeMs: number;
  alreadyCompleted: boolean;
  isWaiting: boolean;

  initDay: (table: CraftingTableName, date: string, totalTimeMs: number, alreadyCompleted: boolean, attempts?: Attempt[]) => void;
  addAttempt: (attempt: Attempt) => void;
  setCurrentSlots: (slots: SlotValue[]) => void;
  setWon: (displayMs: number) => void;
  reset: () => void;
  setIsWaiting: (isWaiting: boolean) => void;
  setGameState: (gameState: "playing" | "revealed") => void;
}

const INITIAL_STATE = {
  date: "",
  table: "crafting table" as CraftingTableName,
  attempts: [],
  currentSlots: Array<SlotValue>(9).fill(null),
  gameState: "playing" as const,
  completedAtMs: undefined,
  totalTimeMs: 0,
  alreadyCompleted: false,
  isWaiting: false,
};

export const useWordleStore = create<WordleState>()(
  (set) => ({
    ...INITIAL_STATE,

    initDay: (table, date, totalTimeMs, alreadyCompleted, attempts = []) =>
      set(state => ({
        ...(state.date !== date ? INITIAL_STATE : {}),
        table,
        date,
        totalTimeMs,
        alreadyCompleted,
        attempts,
        gameState: alreadyCompleted ? "won" as const : "playing" as const,
        completedAtMs: alreadyCompleted ? totalTimeMs : undefined,
      })),

    addAttempt: (attempt) =>
      set(state => ({
        attempts: [...state.attempts, attempt],
        currentSlots: Array<SlotValue>(9).fill(null),
      })),

    setCurrentSlots: (slots) => set({ currentSlots: slots }),

    setWon: (displayMs) => set({ gameState: "won", completedAtMs: displayMs }),

    setGameState: (gameState: "playing" | "revealed") => set({ gameState }),

    reset: () => set(INITIAL_STATE),
    setIsWaiting: (isWaiting) => set({ isWaiting }),
  }),
);
