import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  settings: {
    fallingImage: boolean
  }
}


type Actions = {
  setFallingImage: (value: boolean) => void
}

const storageKey = 'settings';

const initialState: State = {
  settings: {
    fallingImage: true
  }
};

export const useSettingsStore = create(persist<State & Actions>(
  (set) => ({
    ...initialState,
    settings: { ...initialState.settings },
    setFallingImage: (value) => set(() => ({ settings: { fallingImage: value } })),
  }),
  {
    name: storageKey,
    storage: createJSONStorage(() => localStorage)
  },
))