import { create } from "zustand";
import {
  CraftingRecipeType,
} from "@/types";

type StateRecipe = {
  allCrafts: CraftingRecipeType[],
}

type ActionRecipe = {
  setAllCrafts: (allCrafts: CraftingRecipeType[]) => void,
}

const initialStateRecipe: StateRecipe = {
  allCrafts: [],
};

export const useAllCraftsStore = create<StateRecipe & ActionRecipe>(
  (set) => ({
    ...initialStateRecipe,
    setAllCrafts: (allCrafts: CraftingRecipeType[]) => set({ allCrafts }),
  })
);
