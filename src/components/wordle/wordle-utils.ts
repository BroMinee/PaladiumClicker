import { CraftingRecipeType, NodeType, OptionType } from "@/types";

export type SlotValue = string | null;
export type TileStatus = "correct" | "present" | "absent";

export interface Attempt {
  slots: SlotValue[];
  result: TileStatus[];
}

/** Weighted edit distance: substitution costs 2, insertion/deletion costs 1. */
export function searchDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 2);
    }
  }
  return dp[m][n];
}

function craftSlots(craft: CraftingRecipeType): SlotValue[] {
  return [craft.slot1, craft.slot2, craft.slot3, craft.slot4, craft.slot5, craft.slot6, craft.slot7, craft.slot8, craft.slot9]
    .map(s => (!s || s.item_name === "air") ? null : s.item_name);
}

/** Returns true if the given 9-slot combination matches any known crafting recipe. */
export function craftExists(slots: SlotValue[], allCrafts: CraftingRecipeType[]): boolean {
  return allCrafts.some(craft => slots.every((s, i) => s === craftSlots(craft)[i]));
}

/** Compares a 9-slot guess against the answer, returning per-slot correct/present/absent status. */
export function checkGuess(guess: SlotValue[], answer: SlotValue[]): TileStatus[] {
  const result: TileStatus[] = Array(9).fill("absent");
  const answerRemaining = [...answer];
  const guessRemaining = [...guess];

  for (let i = 0; i < 9; i++) {
    if (guessRemaining[i] === answerRemaining[i]) {
      result[i] = "correct";
      answerRemaining[i] = "__done__";
      guessRemaining[i] = "__done__";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (guessRemaining[i] === "__done__" || guessRemaining[i] === null) {
      continue;
    }
    const idx = answerRemaining.findIndex(a => a === guessRemaining[i]);
    if (idx !== -1) {
      result[i] = "present";
      answerRemaining[idx] = "__done__";
    }
  }

  return result;
}

/** Deterministic Fisher-Yates shuffle using a fixed XOR seed. */
export function seededShuffle(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  let seed = 0x12345678;
  const next = () => {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 0x100000000;
  };
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

/** Extracts the 9 slot item names from a crafting recipe, mapping air/null to null. */
export function craftToSlots(craft: CraftingRecipeType): SlotValue[] {
  return [
    craft.slot1, craft.slot2, craft.slot3,
    craft.slot4, craft.slot5, craft.slot6,
    craft.slot7, craft.slot8, craft.slot9,
  ].map(s => (!s || s.item_name === "air") ? null : s.item_name);
}

/** Converts a CraftingRecipeType to props for DispatchRecipePattern. */
export function craftRecipeToDispatch(craft: CraftingRecipeType, allItems: OptionType[]): { recipe: NodeType[]; output: NodeType } {
  const slots = [craft.slot1, craft.slot2, craft.slot3, craft.slot4, craft.slot5, craft.slot6, craft.slot7, craft.slot8, craft.slot9];
  const recipe: NodeType[] = slots.map(slot => {
    if (!slot || slot.item_name === "air") {
      return { value: "air", label: "", label2: "", img: "", count: 0, checked: false };
    }
    const opt = allItems.find(i => i.value === slot.item_name) ?? { value: slot.item_name, label: slot.item_name, label2: slot.item_name, img: slot.img };
    return { ...opt, count: 1, checked: false };
  });
  const outputOpt = allItems.find(i => i.value === craft.item.item_name) ?? { value: craft.item.item_name, label: craft.item.item_name, label2: craft.item.item_name, img: craft.item.img };
  const output: NodeType = { ...outputOpt, count: craft.count, checked: false, table: craft.table };
  return { recipe, output };
}

/** Returns only the items that appear in at least one slot of any known craft. */
export function filterItemsUsedInCrafts(items: OptionType[], allCrafts: CraftingRecipeType[]): OptionType[] {
  const used = new Set<string>();
  for (const craft of allCrafts) {
    for (const slot of [craft.slot1, craft.slot2, craft.slot3, craft.slot4, craft.slot5, craft.slot6, craft.slot7, craft.slot8, craft.slot9]) {
      if (slot && slot.item_name !== "air") {
        used.add(slot.item_name);
      }
    }
  }
  return items.filter(i => used.has(i.value));
}

/** Formats a millisecond duration as mm:ss or h mm:ss. */
export function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mmHH = `${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  if (h > 0) {
    return `${h}h ${mmHH}`;
  }
  return mmHH;
}
