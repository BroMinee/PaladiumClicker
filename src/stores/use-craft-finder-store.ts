import { create } from "zustand";
import { SlotValue } from "@/components/wordle/wordle-utils";
import { CraftingTableName } from "@/types";

export interface FoundCraft {
  slots: SlotValue[];
  outputItemName: string;
  outputItemImg: string;
  table: CraftingTableName;
}

interface CraftFinderState {
  date: string;
  items: string[];
  totalToFind: number;
  foundCrafts: FoundCraft[];
  currentSlots: SlotValue[];
  gameState: "playing" | "won";
  totalTimeMs: number;
  completedAtMs?: number;
  alreadyCompleted: boolean;
  isFlashing: boolean;
  isWaiting: boolean;
  flashingItem: { img: string; name: string } | null;

  initDay: (items: string[], totalToFind: number, date: string, totalTimeMs: number, alreadyCompleted: boolean, foundCrafts?: FoundCraft[]) => void;
  addFoundCraft: (craft: FoundCraft) => void;
  setCurrentSlots: (slots: SlotValue[]) => void;
  setWon: (completedAtMs: number) => void;
  setIsFlashing: (flashing: boolean) => void;
  setIsWaiting: (waiting: boolean) => void;
  setFlashingItem: (item: { img: string; name: string } | null) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  date: "",
  items: [] as string[],
  totalToFind: 0,
  foundCrafts: [] as FoundCraft[],
  currentSlots: Array<SlotValue>(9).fill(null),
  gameState: "playing" as const,
  totalTimeMs: 0,
  completedAtMs: undefined,
  alreadyCompleted: false,
  isFlashing: false,
  isWaiting: false,
  flashingItem: null,
};

export const useCraftFinderStore = create<CraftFinderState>()(
  (set) => ({
    ...INITIAL_STATE,

    initDay: (items, totalToFind, date, totalTimeMs, alreadyCompleted, foundCrafts = []) =>
      set(state => ({
        ...(state.date !== date ? INITIAL_STATE : {}),
        items,
        totalToFind,
        date,
        totalTimeMs,
        alreadyCompleted,
        foundCrafts,
        currentSlots: Array<SlotValue>(9).fill(null),
        gameState: alreadyCompleted ? "won" as const : "playing" as const,
        completedAtMs: alreadyCompleted ? totalTimeMs : undefined,
      })),

    addFoundCraft: (craft) =>
      set(state => ({
        foundCrafts: [...state.foundCrafts, craft],
      })),

    setCurrentSlots: (slots) => set({ currentSlots: slots }),

    setWon: (completedAtMs) => set({ gameState: "won", completedAtMs }),

    setIsFlashing: (isFlashing) => set({ isFlashing }),

    setIsWaiting: (isWaiting) => set({ isWaiting }),

    setFlashingItem: (flashingItem) => set({ flashingItem }),

    reset: () => set(INITIAL_STATE),
  }),
);
