import { create } from "zustand";
import {
  CraftPrice,
  NodeType,
  Tree,
} from "@/types";

type StateRecipe = {
  language: "fr" | "us",
  quantity: number,
  checkedItems: Set<NodeType>,
  root: Tree<NodeType> | undefined,
  flatResources: Map<string, [NodeType, number]>,
}

type ActionRecipe = {
  setLanguage: (language: "fr" | "us") => void,
  setQuantity: (quantity: number) => void,
  setCheckedItems: (checkedItems: Set<NodeType>) => void,
  setRoot: (craftingTree: Tree<NodeType> | undefined) => void,
  setFlatResources: (flatResources: Map<string, [NodeType, number]>) => void,
}

const initialStateRecipe: StateRecipe = {
  language: "us",
  quantity: 1,
  checkedItems: new Set<NodeType>,
  root: undefined,
  flatResources: new Map<string, [NodeType, number]>(),
};

export const useCraftRecipeStore = create<StateRecipe & ActionRecipe>(
  (set) => ({
    ...initialStateRecipe,
    setLanguage: (language: "fr" | "us") => set({ language }),
    setQuantity: (quantity: number) => set({ quantity }),
    setCheckedItems: (checkedItems: Set<NodeType>) => set({ checkedItems }),
    setRoot: (craftingTree: Tree<NodeType> | undefined) => set({ root: craftingTree }),
    setFlatResources: (flatResources: Map<string, [NodeType, number]>) => set({ flatResources }),
  })
);

type State = {
  craftingList: CraftPrice[],
}

type Actions = {
  setCraftingList: (craftingList: CraftPrice[]) => void
}

const initialState: State = {
  craftingList: [],
};

export const useCraftOptimizerStore = create<State & Actions>(
  (set) => ({
    ...initialState,
    setCraftingList: (craftingList: CraftPrice[]) => set({ craftingList }),
  })
);
