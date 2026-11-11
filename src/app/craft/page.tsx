"use client";

import { Suspense } from "react";
import { StaticDataProvider } from "@/components/shared/static-data-provider.client";
import { CraftingHelperPage } from "@/components/craft/craft-recipe.client";
import { SetCraftingState } from "@/components/craft/set-crafting-state";

/** Craft recipe page. */
export default function CraftRecipeDisplay() {
  return (
    <Suspense fallback={<p className="text-gray-400 text-sm animate-pulse text-center py-20">Chargement...</p>}>
      <StaticDataProvider>
        <SetCraftingState>
          <CraftingHelperPage />
        </SetCraftingState>
      </StaticDataProvider>
    </Suspense>
  );
}
