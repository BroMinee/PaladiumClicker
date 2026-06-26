"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCraftFinderStore } from "@/stores/use-craft-finder-store";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";
import { useItemsStore } from "@/stores/use-items-store";
import { areSlotEquivalent, isCraftValid, pickRandomItemSetForTrain } from "@/lib/craft-finder-utils";
import { craftRecipeToDispatch } from "@/components/wordle/wordle-utils";
import { CraftingRecipeType } from "@/types";
import { CraftFinderGame } from "@/components/craft-finder/craft-finder-game";
import { CraftFinderCounter, FoundCraftsHistory } from "@/components/craft-finder/craft-finder-ui";
import { DispatchRecipePattern } from "@/components/craft/display/dispatch-recipe-pattern";
import { Button } from "@/components/ui/button-v2";
import { Card } from "@/components/ui/card";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc/patchnote";
import { toast } from "sonner";
import { CraftFinderHowToPlay } from "@/components/craft-finder/craft-finder-how-to-play";

/**
 * [Craft Finder train page](https://palatracker.bromine.fr/craft-finder/train)
 */
export function CraftFinderTrainGame({ allCraftCompatible}: { allCraftCompatible: CraftingRecipeType[] }) {
  const store = useCraftFinderStore();
  const { allItems } = useItemsStore();
  const { allCrafts } = useAllCraftsStore();

  const [targetCrafts, setTargetCrafts] = useState<CraftingRecipeType[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initNewGame = (allCraftCompatible: CraftingRecipeType[]) => {
    const result = pickRandomItemSetForTrain(allCraftCompatible, allCrafts);
    if (!result) {
      toast.error("Impossible de charger une liste d'items. Réessaie.");
      return;
    }
    setTargetCrafts(result.crafts);
    setShowAnswer(false);
    store.initDay(result.items, result.crafts.length, "train", 0, false);
  };

  useEffect(() => {
    if (allCraftCompatible.length === 0) {
      return;
    }
    initNewGame(allCraftCompatible);
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCraftCompatible]);

  const handleMatch = (slots: typeof store.currentSlots) => {
    if (store.isWaiting) {
      return;
    }
    const already = store.foundCrafts.find(f => areSlotEquivalent(f.slots, slots));
    if (already) {
      toast("Déjà trouvé !");
      return;
    }
    const matched = targetCrafts.find(craft => {
      return isCraftValid(craft, slots);
    });

    if (!matched) {
      return;
    }
    const outputItem = allItems.find(i => i.value === matched.item.item_name);
    store.addFoundCraft({
      slots,
      outputItemName: matched.item.item_name,
      outputItemImg: matched.item.img,
      table: matched.table,
    });

    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }
    store.setIsFlashing(true);
    store.setFlashingItem({ img: matched.item.img, name: matched.item.item_name });
    flashTimerRef.current = setTimeout(() => {
      store.setIsFlashing(false);
      store.setFlashingItem(null);
      store.setCurrentSlots(Array(9).fill(null));
    }, 1000);

    const newFoundCount = store.foundCrafts.length + 1;
    if (newFoundCount >= targetCrafts.length) {
      store.setWon(Date.now());
    }

    if (outputItem) {
      toast.success(`Trouvé : ${outputItem.label} !`);
    }
  };

  const answerDispatches = useMemo(
    () => targetCrafts.map(craft => ({
      ...craftRecipeToDispatch(craft, allItems),
      found: store.foundCrafts.some(f => isCraftValid(craft, f.slots)),
    })).sort((a, b) => Number(a.found) - Number(b.found)),
    [targetCrafts, allItems, store.foundCrafts]
  );

  const currentTable = targetCrafts[0]?.table ?? "crafting table";

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-400 text-sm animate-pulse">Chargement…</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader className="shrink-0">
        <PageHeaderHeading>{textFormatting("Craft °Finder° - Entraînement")}</PageHeaderHeading>
        <PageHeaderDescription>Trouve tous les crafts utilisant ces items</PageHeaderDescription>
      </PageHeader>

      <div className="flex gap-6 flex-col mt-2">
        <Card className="shrink-0 flex flex-col lg:flex-row gap-6 items-start">

          <div className="flex-1 flex flex-col gap-4 min-w-0 w-full">
            <div className="flex items-center justify-end">
              <CraftFinderCounter found={store.foundCrafts.length} total={store.totalToFind} />
            </div>

            {store.gameState === "playing" ? (
              <CraftFinderGame onMatch={handleMatch} table={currentTable} />
            ) : (
              <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-400 font-bold text-xl">Bravo !</p>
                <p className="text-gray-400 mt-1">Tu as trouvé les {targetCrafts.length} crafts.</p>
              </div>
            )}

            <div className="flex gap-2 flex-wrap pt-2 border-t border-secondary">
              <Button onClick={() => initNewGame(allCraftCompatible)} variant="primary" size="default">
                Changer de liste d&apos;items
              </Button>
              {store.gameState === "playing" && (
                <Button onClick={() => setShowAnswer(p => !p)} variant="outline" size="default">
                  {showAnswer ? "Masquer la réponse" : "Voir la réponse"}
                </Button>
              )}
            </div>

            {showAnswer && answerDispatches.length > 0 && (
              <div className="flex flex-wrap items-start pt-2 border-t border-secondary">
                {answerDispatches.map((d, i) => (
                  <>
                    {i > 0 && <div key={`sep-${i}`} className="w-px bg-secondary self-stretch mx-3" />}
                    <div key={i} className={`flex flex-col gap-1 rounded-lg p-1 transition-colors ${d.found ? "bg-green-900/30 ring-1 ring-green-700" : ""}`}>
                      <span className={`text-xs ${d.found ? "text-green-400" : "text-gray-500"}`}>
                        {d.found ? "✓ Trouvé" : `Craft ${i + 1}`}
                      </span>
                      <DispatchRecipePattern recipe={d.recipe} output={d.output} />
                    </div>
                  </>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block border-l border-secondary pl-6 ml-2">
            <CraftFinderHowToPlay mode="train" />
          </div>
        </Card>

        {store.foundCrafts.length > 0 && (
          <Card>
            <p className="text-sm text-gray-400 mb-3">Crafts trouvés</p>
            <FoundCraftsHistory foundCrafts={store.foundCrafts} />
          </Card>
        )}
      </div>
    </>
  );
}
