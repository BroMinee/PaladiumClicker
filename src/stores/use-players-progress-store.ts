"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  lastCheckedIndex: number; // -1 = aucun coché
};

type Actions = {
  setLastCheckedIndex: (index: number) => void;
  reset: () => void;
};

const storageKey = "players-progress";

export const usePlayersProgressStore = create<State & Actions, [["zustand/persist", State & Actions]]>(
  persist<State & Actions>(
    (set) => ({
      lastCheckedIndex: -1,
      setLastCheckedIndex: (index) => set({ lastCheckedIndex: index }),
      reset: () => set({ lastCheckedIndex: -1 }),
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
