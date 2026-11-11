import { CraftingRecipeType, OptionType } from "@/types";

let itemsCache: OptionType[] | null = null;
let craftsCache: CraftingRecipeType[] | null = null;
let aliasesCache: Array<[string, string]> | null = null;
let wordleDebugCraftsCache: CraftingRecipeType[] | null = null;

/**
 * Get all items from static JSON.
 */
export async function getStaticItems(): Promise<OptionType[]> {
  if (itemsCache) {
    return itemsCache;
  }
  const res = await fetch("/data/items.json");
  itemsCache = await res.json();
  return itemsCache!;
}

/**
 * Get all crafts from static JSON.
 */
export async function getStaticCrafts(): Promise<CraftingRecipeType[]> {
  if (craftsCache) {
    return craftsCache;
  }
  const res = await fetch("/data/crafts.json");
  craftsCache = await res.json();
  return craftsCache!;
}

/**
 * Get all aliases from static JSON.
 */
export async function getStaticAliases(): Promise<Array<[string, string]>> {
  if (aliasesCache) {
    return aliasesCache;
  }
  const res = await fetch("/data/aliases.json");
  aliasesCache = await res.json();
  return aliasesCache!;
}

/**
 * Get wordle debug crafts from static JSON.
 */
export async function getStaticWordleDebugCrafts(): Promise<CraftingRecipeType[]> {
  if (wordleDebugCraftsCache) {
    return wordleDebugCraftsCache;
  }
  const res = await fetch("/data/wordle-debug-crafts.json");
  wordleDebugCraftsCache = await res.json();
  return wordleDebugCraftsCache!;
}
