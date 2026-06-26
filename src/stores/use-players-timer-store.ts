"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  elapsed: number;
  running: boolean;
};

type Actions = {
  setElapsed: (elapsed: number) => void;
  setRunning: (running: boolean) => void;
  reset: () => void;
};

const storageKey = "players-timer";

export const usePlayersTimerStore = create<State & Actions, [["zustand/persist", State & Actions]]>(
  persist<State & Actions>(
    (set) => ({
      elapsed: 0,
      running: false,
      setElapsed: (elapsed) => set({ elapsed }),
      setRunning: (running) => set({ running }),
      reset: () => set({ elapsed: 0, running: false }),
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
