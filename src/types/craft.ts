import { Item, OptionType } from "./market";

export type CraftingRecipeType =
  {
    item: Item,
    table: "crafting table" | "furnace" | "grinder" | "palamachine" | "cauldron" | "alchemy creator",
    slot1: Item | null,
    slot2: Item | null,
    slot3: Item | null,
    slot4: Item | null,
    slot5: Item | null,
    slot6: Item | null,
    slot7: Item | null,
    slot8: Item | null,
    slot9: Item | null,
    count: number
  }

export type CraftingRecipeKey = keyof Pick<CraftingRecipeType,
  "slot1" |
  "slot2" |
  "slot3" |
  "slot4" |
  "slot5" |
  "slot6" |
  "slot7" |
  "slot8" |
  "slot9"
>;

export type NodeType = OptionType & { count: number } & { checked: boolean }

export type Tree<T> = {
  value: T;
  children: Tree<T>[];
}

export enum CraftSectionEnum {
  "recipe" = "recipe",
  "optimizer" = "optimizer",
}

export interface searchParamsCraftPage {
  item?: string,
  count?: number,
  section?: string
}

export interface CraftPrice {
  created_at: string,
  item: Item,
  priceToCraft: number,
  currentPrice: number,
  averagePrice: number,
  totalSold: number,
}

export type MyTreeNode = {
  id: string;
  label: string;
  nodeData: NodeType;
  parent?: MyTreeNode;
  children: MyTreeNode[];
}