import { getAllItems, getAllCrafts, getWordleDebugCrafts } from "@/lib/api/api-pala-tracker.server";
import { SetItemsState } from "@/components/shared/set-items-state.client";
import { SetAllCraftsState } from "@/components/shared/set-all-craft-state.client";
import { CraftFinderTrainGame } from "./craft-finder-train.client";

/**
 *
 */
export function generateMetadata() {
  return {
    title: "PalaTracker | Craft Finder - Entraînement",
    description: "Entraîne-toi à trouver tous les crafts qui utilisent une liste d'items donnée.",
  };
}

/**
 * [Craft Finder train page](https://palatracker.bromine.fr/craft-finder/train)
 */
export default async function CraftFinderTrainPage() {
  const [allItems, allCrafts, allCraftCompatible] = await Promise.all([getAllItems(), getAllCrafts(), getWordleDebugCrafts()]);

  return (
    <SetItemsState allItems={allItems}>
      <SetAllCraftsState allCrafts={allCrafts}>
        <CraftFinderTrainGame allCraftCompatible={allCraftCompatible.filter(e => e.table === "crafting table")}/>
      </SetAllCraftsState>
    </SetItemsState>
  );
}
