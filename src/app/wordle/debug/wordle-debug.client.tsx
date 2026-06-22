"use client";

import { CraftingRecipeType, OptionType } from "@/types";
import { craftRecipeToDispatch } from "@/components/wordle/wordle-utils";
import { DispatchRecipePattern } from "@/components/craft/display/dispatch-recipe-pattern";

/**
 *
 */
export function DebugCraftCard({ craft, allItems }: { craft: CraftingRecipeType; allItems: OptionType[] }) {
  const { recipe, output } = craftRecipeToDispatch(craft, allItems);
  return (
    <div className="border rounded-lg p-4 bg-zinc-900 border-zinc-700">
      <DispatchRecipePattern recipe={recipe} output={output} />
    </div>
  );
}
