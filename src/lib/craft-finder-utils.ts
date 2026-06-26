import { CraftingRecipeType } from "@/types";
import { SlotValue, craftToSlots } from "@/components/wordle/wordle-utils";
import { shuffle } from "d3";

/** Returns the distinct ingredient item names of a craft (no duplicates, sorted). */
export function getDistinctItems(craft: CraftingRecipeType): string[] {
  return [...new Set(craftToSlots(craft).filter((s): s is string => s !== null))].sort();
}

/**
 * Returns all crafts whose distinct ingredients are EXACTLY the given set.
 */
export function findCraftsWithExactDistinctItems(items: string[], allCrafts: CraftingRecipeType[]): CraftingRecipeType[] {
  const sorted = [...items].sort();
  return allCrafts.filter(craft => {
    const distinct = getDistinctItems(craft);
    return distinct.length === sorted.length && distinct.every((v, i) => v === sorted[i]);
  });
}

/**
 * Returns the set of crafts that are fully achievable from the given set of available items.
 * A craft is included only if every ingredient slot (excluding 'air') is present in availableItems.
 */
export function recomputePossibleCraftFromSetOfItem(
  availableItems: Set<string>,
  allCrafts: CraftingRecipeType[],
): Set<CraftingRecipeType> {
  const slotsAccessor = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9"] as const;
  const result = new Set<CraftingRecipeType>();

  for (const craft of allCrafts.filter(e => e.table === "crafting table")) {
    const isPossible = slotsAccessor.every(slot => {
      const itemName = craft[slot]?.item_name;
      return itemName === undefined || itemName === "air" || availableItems.has(itemName);
    });
    const asAtleastOneItem = slotsAccessor.some(slot => {
      return craft[slot]?.item_name !== undefined && craft[slot]?.item_name !== "air";
    });

    if (isPossible && asAtleastOneItem) {
      result.add(craft);
    }
  }

  // Deduplicate by slot content (keep first occurrence per unique recipe)
  const seen = new Set<string>();
  const deduped = new Set<CraftingRecipeType>();
  for (const craft of result) {
    const key = slotsAccessor.map(accessor => craft[accessor]?.item_name ?? "").join(",");
    if (!seen.has(key)) {
      seen.add(key);
      deduped.add(craft);
    }
  }

  // Remove remaining duplicates using areCraftsEquivalent (symmetry/translation)
  const unique: CraftingRecipeType[] = [];
  for (const craft of deduped) {
    if (!unique.some(u => areCraftsEquivalent(u, craft))) {
      unique.push(craft);
    }
  }
  return new Set(unique);
}

/**
 * Picks a random item set that has ≥ minCrafts crafts with exactly those distinct ingredients.
 * Returns null if no such set exists in the dataset.
 */
export function pickRandomItemSetForTrain(
  allWordleCrafts: CraftingRecipeType[],
  allCrafts: CraftingRecipeType[],
): { items: string[]; crafts: CraftingRecipeType[] } | null {

  // Pre-compute distinct items per craft once

  const slotsAccessor = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9"] as const;
  const itemDistrinct = new Map<string, CraftingRecipeType[]>();
  allWordleCrafts.forEach(c => {
    slotsAccessor.forEach(slotAccessor => {
      const itemName = c[slotAccessor]?.item_name;
      if (itemName !== undefined && itemName !== "air") {
        const listAssociatedRecipe = itemDistrinct.get(itemName) ?? (() => {
          itemDistrinct.set(itemName, []); return itemDistrinct.get(itemName)!;
        })();
        listAssociatedRecipe.push(c);
      }
    });
  });

  const pickedItems = new Set<string>();
  const eligibleItem = Array.from(itemDistrinct.keys());
  let craftToFind = new Set<CraftingRecipeType>();
  while (craftToFind.size < 10 || pickedItems.size < 4) {
    // pick a random item
    const pickedItem = eligibleItem[Math.floor(Math.random() * eligibleItem.length)];
    const associatedCraft = itemDistrinct.get(pickedItem);
    if (!associatedCraft || pickedItems.has(pickedItem)) {
      continue;
    }
    // at that item to the list picked item
    pickedItems.add(pickedItem);

    // At all other
    shuffle(associatedCraft).slice(0, 3).forEach(c => {
      slotsAccessor.forEach(slotAccessor => {
        const itemName = c[slotAccessor]?.item_name;
        if (itemName !== undefined && itemName !== "air") {
          pickedItems.add(itemName);
        }
      });
    });

    // Recompute all craft possible
    craftToFind = recomputePossibleCraftFromSetOfItem(pickedItems, allCrafts);
  }

  return {
    items: Array.from(pickedItems),
    crafts: Array.from(craftToFind),
  };
}

type CraftSlots = Omit<CraftingRecipeType, "item" | "table" | "count">;

const SLOTS = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9"] as const;

/** Reads the 9 slots as a flat array of item names (null = empty, "air" treated as empty). */
function slotsToGrid(c: CraftSlots): (string | null)[] {
  return SLOTS.map(s => {
    const name = c[s]?.item_name;
    return (!name || name === "air") ? null : name;
  });
}

/** Returns a 3×3 grid (row-major) from a flat 9-element array. */
function to3x3(flat: (string | null)[]): (string | null)[][] {
  return [[flat[0], flat[1], flat[2]], [flat[3], flat[4], flat[5]], [flat[6], flat[7], flat[8]]];
}

/** Checks if two flat 9-element grids have identical content. */
function gridsEqual(a: (string | null)[], b: (string | null)[]): boolean {
  return a.every((v, i) => v === b[i]);
}

/**
 * Returns true if the two crafts are equivalent by:
 * - vertical axis symmetry (left↔right mirror), or
 * - translation (shifting the pattern within the 3×3 grid).
 * Both checks are combined: a mirrored pattern can also be translated.
 */
export function areCraftsEquivalent(a: CraftSlots, b: CraftSlots): boolean {
  const gridA = slotsToGrid(a);
  const gridB = slotsToGrid(b);

  function isTranslationOf(source: (string | null)[], target: (string | null)[]): boolean {
    const s = to3x3(source);
    const t = to3x3(target);

    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        // Every cell of source must match the shifted cell of target
        const sourceMatchesTarget = Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 3 }, (_, col) => {
            const tRow = row + dy;
            const tCol = col + dx;
            const tVal = (tRow >= 0 && tRow < 3 && tCol >= 0 && tCol < 3) ? t[tRow][tCol] : null;
            return s[row][col] === tVal;
          }).every(Boolean)
        ).every(Boolean);
        // Every cell of target must match the reverse-shifted cell of source
        const targetMatchesSource = Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 3 }, (_, col) => {
            const sRow = row - dy;
            const sCol = col - dx;
            const sVal = (sRow >= 0 && sRow < 3 && sCol >= 0 && sCol < 3) ? s[sRow][sCol] : null;
            return t[row][col] === sVal;
          }).every(Boolean)
        ).every(Boolean);
        if (sourceMatchesTarget && targetMatchesSource) {
          return true;
        }
      }
    }
    return false;
  }

  // Mirror gridA horizontally (swap columns 0↔2 per row)
  const mirrored = to3x3(gridA).flatMap(row => [row[2], row[1], row[0]]);

  return (
    gridsEqual(gridA, gridB) ||
    isTranslationOf(gridA, gridB) ||
    gridsEqual(mirrored, gridB) ||
    isTranslationOf(mirrored, gridB)
  );
}

/**
 *
 */
export function isCraftValid(a: CraftSlots, b: SlotValue[]) {
  const slots = b.map(e => ({
    item_name: e ?? "air",
    fr_trad: "osef",
    us_trad: "osef",
    img: "osef",
  }));
  const c = { slot1: slots[0], slot2: slots[1], slot3: slots[2], slot4: slots[3], slot5: slots[4], slot6: slots[5], slot7: slots[6], slot8: slots[7], slot9: slots[8] };
  return areCraftsEquivalent(a, c);
}

/**
 *
 */
export function areSlotEquivalent(a: SlotValue[], b: SlotValue[]) {

  const slotsA = a.map(e => ({
    item_name: e ?? "air",
    fr_trad: "osef",
    us_trad: "osef",
    img: "osef",
  }));
  const slotsB = b.map(e => ({
    item_name: e ?? "air",
    fr_trad: "osef",
    us_trad: "osef",
    img: "osef",
  }));
  const c = { slot1: slotsA[0], slot2: slotsA[1], slot3: slotsA[2], slot4: slotsA[3], slot5: slotsA[4], slot6: slotsA[5], slot7: slotsA[6], slot8: slotsA[7], slot9: slotsA[8] };
  const d = { slot1: slotsB[0], slot2: slotsB[1], slot3: slotsB[2], slot4: slotsB[3], slot5: slotsB[4], slot6: slotsB[5], slot7: slotsB[6], slot8: slotsB[7], slot9: slotsB[8] };
  return areCraftsEquivalent(c, d);

}