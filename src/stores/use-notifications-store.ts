import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PathValid } from "@/lib/constants.ts";

type State = {
  last_visited: { [T in PathValid]: number }
}

type Actions = {
  setLastVisited: (url: PathValid) => void,
}

const storageKey = "notifications";

const initialState: State = {
  last_visited: {} as { [T in PathValid]: number }
};

export const useNotificationStore = create<State & Actions, [["zustand/persist", State & Actions]]>(persist<State & Actions>(
  (set) => ({
    ...initialState,
    setLastVisited: (value: PathValid) => set((state) => {
      state.last_visited[value] = Date.now();
      return { ...state };
    }),
  }),
  {
    name: storageKey,
    storage: createJSONStorage(() => localStorage)
  },
));