'use client';
import {  NavBarCategory } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  opened: NavBarCategory[],
}

type Actions = {
  setToggleOpen: (category: NavBarCategory) => void,
}

const storageKey = 'navbar';
const initialState: State = {
  opened: ["Statistiques et données", "Outils"],
};

export const useNavbarStore = create<State & Actions, [["zustand/persist", State & Actions]]>(persist<State & Actions>(
  (set) => ({
    ...initialState,

    setToggleOpen: (category) => set((state) => {
      if(state.opened.includes(category)) {
        state.opened = state.opened.filter((c) => c !== category);
      } else {
        state.opened.push(category);
      }
      return { ...state };
    }),
  }),
  {
    name: storageKey,
    storage: createJSONStorage(() => localStorage)
  },
));