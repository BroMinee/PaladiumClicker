import { create } from "zustand";
import {
  CraftPrice,
  NodeType,
  OptionType,
  Tree,
} from "@/types";

type StateRecipe = {
  language: "fr" | "us",
  selectedItem: OptionType | null,
  quantity: number,
  checkedItems: Set<NodeType>,
  root: Tree<NodeType> | undefined,
  flatResources: Map<string, [NodeType, number]>,
  allItems: OptionType[],
}

type ActionRecipe = {
  setSelectedItem: (item: OptionType | null) => void,
  setLanguage: (language: "fr" | "us") => void,
  setQuantity: (quantity: number) => void,
  setCheckedItems: (checkedItems: Set<NodeType>) => void,
  setRoot: (craftingTree: Tree<NodeType> | undefined) => void,
  setFlatResources: (flatResources: Map<string, [NodeType, number]>) => void,
  setAllItems: (allItems: OptionType[]) => void,
}

const initialStateRecipe: StateRecipe = {
  language: "us",
  selectedItem: null,
  quantity: 1,
  checkedItems: new Set<NodeType>,
  root: undefined,
  flatResources: new Map<string, [NodeType, number]>(),
  allItems: [],
};

export const useCraftRecipeStore = create<StateRecipe & ActionRecipe>(
  (set) => ({
    ...initialStateRecipe,
    setSelectedItem: (item: OptionType | null) => set({ selectedItem: item }),
    setLanguage: (language: "fr" | "us") => set({ language }),
    setQuantity: (quantity: number) => set({ quantity }),
    setCheckedItems: (checkedItems: Set<NodeType>) => set({ checkedItems }),
    setRoot: (craftingTree: Tree<NodeType> | undefined) => set({ root: craftingTree }),
    setFlatResources: (flatResources: Map<string, [NodeType, number]>) => set({ flatResources }),
    setAllItems: (allItems: OptionType[]) => set({ allItems }),
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
