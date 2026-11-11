"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { CraftingRecipeType } from "@/types";
import { cn } from "@/lib/utils";
import { formatElapsed } from "@/components/wordle/wordle-utils";
import { CraftFinderGame } from "@/components/craft-finder/craft-finder-game";
import { CraftFinderCounter, FoundCraftsHistory } from "@/components/craft-finder/craft-finder-ui";
import { useCraftFinderStore, FoundCraft } from "@/stores/use-craft-finder-store";
import { useItemsStore } from "@/stores/use-items-store";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc/patchnote";
import { CraftFinderHowToPlay } from "@/components/craft-finder/craft-finder-how-to-play";
import { isCraftValid, areSlotEquivalent, recomputePossibleCraftFromSetOfItem } from "@/lib/craft-finder-utils";
import { getStaticWordleDebugCrafts } from "@/lib/data/static-data";
import { hashString, seededRandom, todayISO } from "@/lib/data/seed-utils";
import type { CraftingTableName } from "@/types";

const DAILY_STORAGE_KEY = "craft-finder-daily-state";

interface DailyState {
  date: string;
  foundCrafts: FoundCraft[];
  won: boolean;
  elapsedMs: number;
}

function loadDailyState(date: string): DailyState | null {
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const state = JSON.parse(raw) as DailyState;
    if (state.date !== date) {
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

function saveDailyState(state: DailyState) {
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(state));
}

/**
 * Seeded version of pickRandomItemSetForTrain.
 * Uses a deterministic RNG so all users get the same daily.
 */
function pickDailyItemSet(
  allWordleCrafts: CraftingRecipeType[],
  allCrafts: CraftingRecipeType[],
  seed: number,
): { items: string[]; crafts: CraftingRecipeType[] } | null {
  const rng = seededRandom(seed);

  const slotsAccessor = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9"] as const;
  const itemDistinct = new Map<string, CraftingRecipeType[]>();
  allWordleCrafts.forEach(c => {
    slotsAccessor.forEach(slotAccessor => {
      const itemName = c[slotAccessor]?.item_name;
      if (itemName !== undefined && itemName !== "air") {
        if (!itemDistinct.has(itemName)) {
          itemDistinct.set(itemName, []);
        }
        itemDistinct.get(itemName)!.push(c);
      }
    });
  });

  const pickedItems = new Set<string>();
  const eligibleItem = Array.from(itemDistinct.keys());
  let craftToFind = new Set<CraftingRecipeType>();
  let attempts = 0;

  while ((craftToFind.size < 10 || pickedItems.size < 4) && attempts < 200) {
    attempts++;
    const pickedItem = eligibleItem[Math.floor(rng() * eligibleItem.length)];
    const associatedCraft = itemDistinct.get(pickedItem);
    if (!associatedCraft || pickedItems.has(pickedItem)) {
      continue;
    }

    pickedItems.add(pickedItem);

    // Seeded shuffle: pick up to 3 random crafts
    const shuffled = [...associatedCraft].sort(() => rng() - 0.5);
    shuffled.slice(0, 3).forEach(c => {
      slotsAccessor.forEach(slotAccessor => {
        const itemName = c[slotAccessor]?.item_name;
        if (itemName !== undefined && itemName !== "air") {
          pickedItems.add(itemName);
        }
      });
    });

    craftToFind = recomputePossibleCraftFromSetOfItem(pickedItems, allCrafts);
  }

  if (craftToFind.size === 0) {
    return null;
  }

  return {
    items: Array.from(pickedItems),
    crafts: Array.from(craftToFind),
  };
}

/**
 *
 */
export function CraftFinderDailyGame() {
  const store = useCraftFinderStore();
  const { allItems } = useItemsStore();
  const { allCrafts } = useAllCraftsStore();

  const [hydrated, setHydrated] = useState(false);
  const [targetCrafts, setTargetCrafts] = useState<CraftingRecipeType[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [completedMs, setCompletedMs] = useState(0);
  const [currentTable, setCurrentTable] = useState<CraftingTableName>("crafting table");

  const today = useMemo(() => todayISO(), []);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { gameState, alreadyCompleted, completedAtMs } = store;
  const isFinished = gameState === "won" || alreadyCompleted;

  // Init daily game
  useEffect(() => {
    getStaticWordleDebugCrafts().then((debugCrafts) => {
      const compatible = debugCrafts.filter(e => e.table === "crafting table");
      const seed = hashString(today + "-craft-finder");
      const result = pickDailyItemSet(compatible, allCrafts, seed);
      if (!result) {
        return;
      }

      setTargetCrafts(result.crafts);

      const saved = loadDailyState(today);
      if (saved) {
        store.initDay(result.items, result.crafts.length, today, 0, saved.won, saved.foundCrafts);
        if (saved.won) {
          setCompletedMs(saved.elapsedMs);
        }
        setElapsedMs(saved.elapsedMs);
      } else {
        store.initDay(result.items, result.crafts.length, today, 0, false);
      }

      setHydrated(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCrafts, today]);

  // Timer
  useEffect(() => {
    if (!hydrated || isFinished) {
      return;
    }
    const saved = loadDailyState(today);
    const baseMs = saved?.elapsedMs ?? 0;
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(baseMs + (Date.now() - start));
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [hydrated, isFinished, today]);

  const handleMatch = (slots: (string | null)[]) => {
    if (store.isWaiting) {
      return;
    }
    if (slots.every(s => s === null)) {
      return;
    }

    const already = store.foundCrafts.find(f => areSlotEquivalent(f.slots, slots));
    if (already) {
      toast("Deja trouve !");
      return;
    }

    const matched = targetCrafts.find(craft => isCraftValid(craft, slots));
    if (!matched) {
      return;
    }

    setCurrentTable(matched.table);
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

    const item = allItems.find(i => i.value === matched.item.item_name);
    if (item) {
      toast.success(`Trouve : ${item.label} !`);
    }

    const newFoundCount = store.foundCrafts.length + 1;
    const currentElapsed = elapsedMs;
    if (newFoundCount >= targetCrafts.length) {
      store.setWon(currentElapsed);
      setCompletedMs(currentElapsed);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    // Save state
    const updatedFound = [...useCraftFinderStore.getState().foundCrafts];
    const won = newFoundCount >= targetCrafts.length;
    saveDailyState({
      date: today,
      foundCrafts: updatedFound,
      won,
      elapsedMs: currentElapsed,
    });
  };

  const displayedElapsed = gameState === "won" ? (completedMs || completedAtMs || 0) : elapsedMs;

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-[100dvh]">
        <p className="text-gray-400 text-sm animate-pulse">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader className="shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <PageHeaderHeading>{textFormatting("Craft °Finder° - Daily")}</PageHeaderHeading>
            <PageHeaderDescription>{today} - Trouve tous les crafts du jour</PageHeaderDescription>
          </div>
        </div>
      </PageHeader>

      <div className="flex gap-6 flex-col">
        <Card className="shrink-0 flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 flex flex-col gap-3 min-w-0 w-full">
            <div className="flex items-center gap-2">
              <span className={cn("font-mono text-lg font-semibold tabular-nums", isFinished ? "text-green-400" : "text-white")}>
                {formatElapsed(displayedElapsed)}
              </span>
              {isFinished && <span className="text-xs text-green-400">Termine !</span>}
            </div>

            <div className="flex items-center justify-end">
              <CraftFinderCounter found={store.foundCrafts.length} total={store.totalToFind} />
            </div>

            {!isFinished && (
              <CraftFinderGame onMatch={handleMatch} table={currentTable} />
            )}

            {gameState === "won" && (
              <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-400 font-bold text-xl">Bravo !</p>
                <p className="text-gray-400 mt-1">
                  Tu as trouve les {store.foundCrafts.length} crafts en {formatElapsed(completedMs || completedAtMs || 0)}
                </p>
              </div>
            )}

            {alreadyCompleted && gameState !== "won" && (
              <div className="p-4 bg-zinc-800/60 border border-zinc-600 rounded-lg">
                <p className="text-zinc-300 font-semibold">Tu as deja complete le Craft Finder d&apos;aujourd&apos;hui !</p>
                <p className="text-zinc-500 text-sm mt-1">Reviens demain pour une nouvelle liste d&apos;items.</p>
              </div>
            )}
          </div>

          <div className="hidden lg:block border-l border-secondary pl-6 ml-2">
            <CraftFinderHowToPlay mode="daily" />
          </div>
        </Card>

        {store.foundCrafts.length > 0 && (
          <Card>
            <p className="text-sm text-gray-400 mb-3">Crafts trouves</p>
            <FoundCraftsHistory foundCrafts={store.foundCrafts} />
          </Card>
        )}
      </div>
    </div>
  );
}
