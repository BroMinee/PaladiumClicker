import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  settings: {
    defaultProfile: boolean
  }
}

type Actions = {
  setDefaultProfile: (value: boolean) => void
}

const storageKey = "settings";

const initialState: State = {
  settings: {
    defaultProfile: false
  }
};

export const useSettingsStore = create<State & Actions, [["zustand/persist", State & Actions]]>(persist<State & Actions>(
  (set) => ({
    ...initialState,
    settings: { ...initialState.settings },
    setDefaultProfile: (value) => set((state) => {
      state.settings.defaultProfile = value;
      return { ...state };
    }),
  }),
  {
    name: storageKey,
    storage: createJSONStorage(() => localStorage)
  },
));