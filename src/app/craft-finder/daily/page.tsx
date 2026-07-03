export const dynamic = "force-dynamic";

import { getAllItems, getAllCrafts, getYesterdayCraftFinder } from "@/lib/api/api-pala-tracker.server";
import { SetItemsState } from "@/components/shared/set-items-state.client";
import { SetAllCraftsState } from "@/components/shared/set-all-craft-state.client";
import { CraftFinderDailyGame } from "./craft-finder-daily.client";

/**
 *
 */
export function generateMetadata() {
  return {
    title: "PalaTracker | Craft Finder - Daily",
    description: "Trouve tous les crafts du jour utilisant la liste d'items imposée.",
  };
}

/**
 * [Craft Finder daily page](https://palatracker.bromine.fr/craft-finder/daily)
 */
export default async function CraftFinderDailyPage() {
  const [allItems, allCrafts, yesterday] = await Promise.all([getAllItems(), getAllCrafts(), getYesterdayCraftFinder()]);

  return (
    <SetItemsState allItems={allItems}>
      <SetAllCraftsState allCrafts={allCrafts}>
        <CraftFinderDailyGame yesterday={yesterday} />
      </SetAllCraftsState>
    </SetItemsState>
  );
}
