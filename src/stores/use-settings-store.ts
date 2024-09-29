import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  settings: {
    fallingImage: boolean
    defaultProfile: boolean
  }
}


type Actions = {
  setFallingImage: (value: boolean) => void
  setDefaultProfile: (value: boolean) => void
}

const storageKey = 'settings';

const initialState: State = {
  settings: {
    fallingImage: true,
    defaultProfile: false
  }
};

export const useSettingsStore = create<State & Actions, [["zustand/persist", State & Actions]]>(persist<State & Actions>(
  (set) => ({
    ...initialState,
    settings: { ...initialState.settings },
    setFallingImage: (value) => set((state) => {
      state.settings.fallingImage = value;
      return { ...state };
    }),
    setDefaultProfile: (value) => set((state) => {
      state.settings.defaultProfile = value;
      return { ...state };
    }),
  }),
  {
    name: storageKey,
    storage: createJSONStorage(() => localStorage)
  },
))