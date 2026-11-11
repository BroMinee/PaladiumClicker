"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  SlotValue,
  checkGuess, craftExists, findEquivalentCraft,
  seededShuffle, craftToSlots, craftRecipeToDispatch,
} from "@/components/wordle/wordle-utils";
import {
  ProgressiveItemReveal,
  ToggleSwitch, AttemptsHistory,
} from "@/components/wordle/wordle-ui";
import { DispatchRecipePattern } from "@/components/craft/display/dispatch-recipe-pattern";
import { getStaticWordleDebugCrafts } from "@/lib/data/static-data";
import { WordleGame } from "@/components/wordle/wordle-game";
import { useWordleStore } from "@/stores/use-wordle-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button-v2";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";
import { useItemsStore } from "@/stores/use-items-store";
import { WordleHowToPlay } from "@/components/wordle/wordle-how-to-play";
import { textFormatting } from "@/lib/misc/patchnote";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/ui/page";

const TILE_ORDER = seededShuffle(100);

function pickRandomEligibleCraft(allCrafts: import("@/types").CraftingRecipeType[], eligible: import("@/types").CraftingRecipeType[]): string {
  const pool = allCrafts.filter(c => eligible.some(e => e.item.item_name === c.item.item_name));
  if (pool.length === 0) {
    return allCrafts[0]?.item.item_name ?? "";
  }
  return pool[Math.floor(Math.random() * pool.length)].item.item_name;
}

/**
 * [Wordle train page](https://palatracker.bromine.fr/wordle/train)
 */
export function WordleTrainGame() {
  const { setIsWaiting, attempts, addAttempt, currentSlots, setCurrentSlots, gameState, setWon, setGameState, initDay } = useWordleStore();
  const { allCrafts } = useAllCraftsStore();
  const { allItems } = useItemsStore();

  const [eligible, setEligible] = useState<import("@/types").CraftingRecipeType[]>([]);
  const [craftItemName, setCraftItemName] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [allowInvalid, setAllowInvalid] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const pendingAttemptRef = useRef<SlotValue[] | null>(null);

  useEffect(() => {
    getStaticWordleDebugCrafts().then((debugCrafts) => {
      setEligible(debugCrafts);
      setCraftItemName(pickRandomEligibleCraft(allCrafts, debugCrafts));
    });
  }, [allCrafts]);

  const craft = useMemo(
    () => allCrafts.find(c => c.item.item_name === craftItemName),
    [craftItemName, allCrafts],
  );

  useEffect(() => {
    if (craft) {
      initDay(craft.table, "train", 0, false);
    }
  }, [craft, initDay]);

  const answerSlots = useMemo(() => craft ? craftToSlots(craft) : [], [craft]);
  const outputItem = useMemo(() => craft ? allItems.find(i => i.value === craft.item.item_name) : undefined, [allItems, craft]);
  const answerDispatch = useMemo(() => craft ? craftRecipeToDispatch(craft, allItems) : null, [craft, allItems]);

  const revealPercent = useMemo(() => gameState !== "playing" ? 100 : Math.min((attempts.length + 1) * 10, 100), [gameState, attempts.length]);

  if (!craft || !outputItem || !answerDispatch) {
    return <p className="text-gray-400 text-sm animate-pulse text-center py-20">Chargement...</p>;
  }

  const resetGame = () => {
    const newName = pickRandomEligibleCraft(allCrafts, eligible);
    setCraftItemName(newName);
    setCurrentSlots(Array(9).fill(null));
    setGameState("playing");
  };

  const handleChangeCraft = () => {
    resetGame();
  };

  const preCheckSubmitCheck = (): [boolean, string] => {
    if (!allowInvalid && !craftExists(currentSlots, allCrafts) && !findEquivalentCraft(currentSlots, allCrafts)) {
      return [false, "Ce craft n'existe pas dans notre base de donnée. Retente avec une recette valide."];
    }
    return [true, ""];
  };

  const handleSubmitCallback = () => {
    const equivalent = findEquivalentCraft(currentSlots, allCrafts);
    const slotsToCheck = equivalent ? craftToSlots(equivalent) : currentSlots;
    const result = checkGuess(slotsToCheck, answerSlots);
    addAttempt({ slots: slotsToCheck, result });
    setCurrentSlots(Array(9).fill(null));
    if (result.every(r => r === "correct")) {
      setWon(-1);
    }
    setIsWaiting(false);
  };

  return (
    <>

      <PageHeader className="shrink-0">
        <PageHeaderHeading>{textFormatting("Craft °Wordle° - Entraînement")}</PageHeaderHeading>
        <PageHeaderDescription>Tentatives illimitées · Changement de craft possible</PageHeaderDescription>
      </PageHeader>

      <div className="flex gap-6 flex-col mt-2">

        <Card className="shrink-0 flex flex-col lg:flex-row gap-6 items-start">

          <div className="flex flex-col lg:flex-col gap-4 shrink-0 w-full lg:w-auto">
            <p className="text-xs text-gray-400 uppercase tracking-wide text-center">Item à crafter</p>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 items-center sm:items-start lg:items-start">
              <div className="flex flex-col items-center gap-1 shrink-0">
                {showImage ? (
                  <>
                    <button
                      onClick={() => setLightbox(true)}
                      className="rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-zoom-in"
                      title="Agrandir l'image"
                    >
                      <ProgressiveItemReveal src={`/AH_img/${outputItem.img}`} revealPercent={revealPercent} tileOrder={TILE_ORDER} />
                    </button>
                    <p className="text-xs text-gray-500">{revealPercent}% révélé</p>
                  </>
                ) : (
                  <div className="rounded-lg border border-secondary bg-background flex flex-col items-center justify-center gap-1 text-center" style={{ width: 160, height: 160 }}>
                    <p className="text-xs text-gray-500 font-medium">Image masquée</p>
                    <p className="text-xs text-gray-600 px-3">Active &quot;Afficher l&apos;image&quot; pour voir l&apos;item à deviner.</p>
                  </div>
                )}
                {gameState !== "playing" && (
                  <p className="font-semibold text-sm text-center">
                    {outputItem.label}<br />
                    <span className="text-xs text-gray-400">{outputItem.label2}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-48 lg:w-full">
                <div className="flex flex-col gap-2 pt-2 border-t border-secondary">
                  <ToggleSwitch checked={showImage} onChange={() => setShowImage(p => !p)} label="Afficher l'image" color="blue" />
                  <ToggleSwitch checked={allowInvalid} onChange={() => setAllowInvalid(p => !p)} label="Autoriser les crafts invalides" />
                </div>
                <div className="flex flex-col gap-2">
                  {gameState === "playing" && (
                    <Button onClick={() => setGameState("revealed")} variant="outline" size="default" className="w-full">
                      Voir la réponse
                    </Button>
                  )}
                  <Button onClick={handleChangeCraft} size="default" variant="primary" className="w-full">
                    Changer de craft
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {lightbox && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setLightbox(false)}
            >
              <div className="relative" onClick={e => e.stopPropagation()}>
                <div className="rounded-xl border border-secondary shadow-2xl overflow-hidden scale-150">
                  <ProgressiveItemReveal src={`/AH_img/${outputItem.img}`} revealPercent={revealPercent} tileOrder={TILE_ORDER} />
                </div>
                <button
                  onClick={() => setLightbox(false)}
                  className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-card border border-secondary text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {gameState === "playing" ? (
              <WordleGame handleSubmitPreCheck={preCheckSubmitCheck} pendingAttemptRef={pendingAttemptRef} handleSubmitCallback={handleSubmitCallback}/>
            ) : (
              <div className="p-4 bg-zinc-900/60 border border-zinc-700 rounded-lg flex flex-col gap-3">
                <p className="text-gray-300 font-semibold">Réponse :</p>
                <DispatchRecipePattern recipe={answerDispatch.recipe} output={answerDispatch.output} />
                <Button onClick={resetGame} className="self-start px-4 py-2" variant="primary">
                  Rejouer
                </Button>
              </div>
            )}
          </div>

          <div className="hidden lg:block border-l border-secondary pl-6 ml-2">
            <WordleHowToPlay mode="train" />
          </div>
        </Card>

        { attempts.length !== 0 &&
           <Card>
             <AttemptsHistory attempts={attempts} table={craft.table} />
           </Card>
        }
      </div>

    </>
  );
}
