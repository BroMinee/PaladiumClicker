export const dynamic = "force-dynamic";

import { getAllItems, getAllCrafts, getYesterdayWordle } from "@/lib/api/api-pala-tracker.server";
import { SetItemsState } from "@/components/shared/set-items-state.client";
import { WordleDailyGame } from "./wordle-daily.client";
import { SetAllCraftsState } from "@/components/shared/set-all-craft-state.client";

/**
 * [wordle daily page](https://paladiumclicker.com/wordle/daily)
 */
export default async function WordleDailyPage() {
  const [allItems, allCrafts, yesterday] = await Promise.all([
    getAllItems(),
    getAllCrafts(),
    getYesterdayWordle(),
  ]);

  return (
    <SetItemsState allItems={allItems}>
      <SetAllCraftsState allCrafts={allCrafts}>
        <WordleDailyGame
          yesterdayCraft={yesterday?.craft ?? null}
        />
      </SetAllCraftsState>
    </SetItemsState>
  );
}
