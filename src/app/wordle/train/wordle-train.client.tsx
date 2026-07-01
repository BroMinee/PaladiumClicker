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
import { getRandomCraftAction } from "@/lib/api/wordle-actions.server";
import { WordleGame } from "@/components/wordle/wordle-game";
import { useWordleStore } from "@/stores/use-wordle-store";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button-v2";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";
import { useItemsStore } from "@/stores/use-items-store";
import { WordleHowToPlay } from "@/components/wordle/wordle-how-to-play";
import { textFormatting } from "@/lib/misc/patchnote";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/ui/page";

const TILE_ORDER = seededShuffle(100);

interface Props {
  initialItemName: string;
}

/**
 * [Wordle train page](https://palatracker.bromine.fr/wordle/train)
 */
export function WordleTrainGame({ initialItemName }: Props) {
  const { setIsWaiting, attempts, addAttempt, currentSlots, setCurrentSlots, gameState, setWon, setGameState, initDay } = useWordleStore();
  const { allCrafts } = useAllCraftsStore();
  const { allItems } = useItemsStore();

  const [craftItemName, setCraftItemName] = useState(initialItemName);
  const craft = useMemo(
    () => allCrafts.find(c => c.item.item_name === craftItemName)!,
    [craftItemName, allCrafts],
  );

  const [showImage, setShowImage] = useState(true);
  const [allowInvalid, setAllowInvalid] = useState(false);
  const [loadingCraft, setLoadingCraft] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    initDay(craft.table, "train", 0, false);
  }, [craft, initDay]);

  const answerSlots = useMemo(() => craftToSlots(craft), [craft]);
  const outputItem = useMemo(() => allItems.find(i => i.value === craft.item.item_name)!, [allItems, craft]);
  const answerDispatch = useMemo(() => craftRecipeToDispatch(craft, allItems), [craft, allItems]);

  const revealPercent = useMemo(() => gameState !== "playing" ? 100 : Math.min((attempts.length + 1) * 10, 100), [gameState, attempts.length]);

  const pendingAttemptRef = useRef<SlotValue[] | null>(null);

  const resetGame = async () => {
    const newItemName = await getRandomCraftAction();
    if (newItemName) {
      setCraftItemName(newItemName);
      setCurrentSlots(Array(9).fill(null));
      setGameState("playing");
    } else {
      toast.error("Erreur lors du chargement du craft. Retentez.");
    }
  };

  const handleChangeCraft = async () => {
    setLoadingCraft(true);
    await resetGame();
    setLoadingCraft(false);
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
                  <Button onClick={handleChangeCraft} disabled={loadingCraft} size="default" variant="primary" className="w-full">
                    {loadingCraft ? "Chargement…" : "Changer de craft"}
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
