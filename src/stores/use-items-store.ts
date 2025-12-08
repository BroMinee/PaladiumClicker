import { create } from "zustand";
import {
  OptionType,
} from "@/types";

type StateRecipe = {
  selectedItem: OptionType | undefined,
  allItems: OptionType[],
}

type ActionRecipe = {
  setAllItems: (allItems: OptionType[]) => void,
  setSelectedItem: (item: OptionType | undefined) => void,
}

const initialStateRecipe: StateRecipe = {
  selectedItem: undefined,
  allItems: [],
};

export const useItemsStore = create<StateRecipe & ActionRecipe>(
  (set) => ({
    ...initialStateRecipe,
    setAllItems: (allItems: OptionType[]) => set({ allItems }),
    setSelectedItem: (item: OptionType | undefined) => set({ selectedItem: item }),
  })
);
