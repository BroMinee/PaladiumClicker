import { getAllItems, getAllCrafts, getRandomWordleCraftName } from "@/lib/api/api-pala-tracker.server";
import { SetItemsState } from "@/components/shared/set-items-state.client";
import { WordleTrainGame } from "./wordle-train.client";
import { SetAllCraftsState } from "@/components/shared/set-all-craft-state.client";

/**
 *
 */
export default async function WordleTrainPage() {
  const [allItems, allCrafts, initialItemName] = await Promise.all([
    getAllItems(),
    getAllCrafts(),
    getRandomWordleCraftName(),
  ]);

  if (!initialItemName) {
    return (
      <p className="text-center py-20 text-gray-400">
        Impossible de charger un craft d&apos;entraînement
      </p>
    );
  }

  return (
    <SetItemsState allItems={allItems}>
      <SetAllCraftsState allCrafts={allCrafts}>
        <WordleTrainGame
          initialItemName={initialItemName}
        />
      </SetAllCraftsState>
    </SetItemsState>
  );
}
