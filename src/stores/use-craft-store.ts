import { create } from "zustand";
import {
  CraftPrice,
} from "@/types";

type State = {
  craftingList: CraftPrice[],
}

type Actions = {
  setCraftingList: (craftingList: CraftPrice[]) => void
}

const initialState: State = {
  craftingList: [],
};

export const useCraftStore = create<State & Actions>(
  (set) => ({
    ...initialState,
    setCraftingList: (craftingList: CraftPrice[]) => set({ craftingList }),
  })
);