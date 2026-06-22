import { getAllItems, getWordleDebugCrafts } from "@/lib/api/api-pala-tracker.server";
import { SetItemsState } from "@/components/shared/set-items-state.client";
import { DebugCraftCard } from "./wordle-debug.client";
import { API_PALATRACKER } from "@/lib/constants";
import { notFound } from "next/navigation";

/**
 *
 */
export default async function WordleDebugPage() {
  if (!API_PALATRACKER.includes("localhost") && !API_PALATRACKER.includes("dev")) {
    notFound();
  }

  const [crafts, allItems] = await Promise.all([
    getWordleDebugCrafts(),
    getAllItems(),
  ]);

  return (
    <SetItemsState allItems={allItems}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Debug - Crafts éligibles au Wordle</h1>
          <p className="text-zinc-400 text-sm mt-1">
            <span className="text-blue-400 font-medium">{crafts.length} crafts</span> retournés par <code className="text-zinc-300">/v1/wordle/debug</code>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {crafts.map((craft, i) => (
            <DebugCraftCard key={i} craft={craft} allItems={allItems} />
          ))}
        </div>
      </div>
    </SetItemsState>
  );
}
