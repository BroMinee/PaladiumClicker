import { create } from "zustand";

type State = {
  rps: number;
}

type Actions = {
  setRPS: (rps: number) => void;
}

const initialState: State = {
  rps: 0,
};

export const useRpsStore = create<State & Actions>(
  (set) => ({
    ...initialState,
    setRPS: (rps) => set({ rps }),
  })
);