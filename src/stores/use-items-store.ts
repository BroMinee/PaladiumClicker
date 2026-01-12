import { create } from "zustand";
import {
  OptionType,
} from "@/types";

type StateRecipe = {
  selectedItem: OptionType | undefined,
  closeItems: OptionType[],
  allItems: OptionType[],
}

type ActionRecipe = {
  setAllItems: (allItems: OptionType[]) => void,
  setSelectedItem: (item: OptionType | undefined) => void,
  setCloseItems: (closeItems: OptionType[]) => void,
}

const initialStateRecipe: StateRecipe = {
  selectedItem: undefined,
  allItems: [],
  closeItems: [],
};

export const useItemsStore = create<StateRecipe & ActionRecipe>(
  (set) => ({
    ...initialStateRecipe,
    setAllItems: (allItems: OptionType[]) => set({ allItems }),
    setSelectedItem: (item: OptionType | undefined) => set({ selectedItem: item, closeItems: [] }),
    setCloseItems: (closeItems: OptionType[]) => set({ closeItems }),
  })
);
