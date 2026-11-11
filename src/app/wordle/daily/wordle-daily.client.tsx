"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { CraftingRecipeType } from "@/types";
import { cn } from "@/lib/utils";
import {
  SlotValue, Attempt,
  craftExists, findEquivalentCraft,
  craftToSlots, checkGuess, formatElapsed,
} from "@/components/wordle/wordle-utils";
import { AttemptsHistory } from "@/components/wordle/wordle-ui";
import { WordleGame } from "@/components/wordle/wordle-game";
import { useWordleStore } from "@/stores/use-wordle-store";
import { Card } from "@/components/ui/card";
import { adaptPlurial } from "@/lib/misc";
import { textFormatting } from "@/lib/misc/patchnote";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/ui/page";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";

import { WordleHowToPlay } from "@/components/wordle/wordle-how-to-play";
import { getStaticWordleDebugCrafts } from "@/lib/data/static-data";
import { hashString, seededRandom, todayISO } from "@/lib/data/seed-utils";

const DAILY_STORAGE_KEY = "wordle-daily-state";

interface DailyState {
  date: string;
  attempts: Attempt[];
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

function pickDailyCraft(allCrafts: CraftingRecipeType[], eligible: CraftingRecipeType[], date: string): CraftingRecipeType | null {
  const pool = allCrafts.filter(c => eligible.some(e => e.item.item_name === c.item.item_name));
  if (pool.length === 0) {
    return null;
  }
  const seed = hashString(date + "-wordle");
  const rng = seededRandom(seed);
  const index = Math.floor(rng() * pool.length);
  return pool[index];
}

/**
 *
 */
export function WordleDailyGame() {
  const { allCrafts } = useAllCraftsStore();
  const store = useWordleStore();
  const { gameState, attempts, currentSlots, addAttempt, setWon, setIsWaiting, table } = store;

  const [craft, setCraft] = useState<CraftingRecipeType | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [completedMs, setCompletedMs] = useState(0);

  const today = useMemo(() => todayISO(), []);
  const pendingAttemptRef = useRef<SlotValue[] | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pick daily craft and restore state
  useEffect(() => {
    getStaticWordleDebugCrafts().then((eligible) => {
      const dailyCraft = pickDailyCraft(allCrafts, eligible, today);
      if (!dailyCraft) {
        return;
      }
      setCraft(dailyCraft);

      const saved = loadDailyState(today);
      if (saved) {
        store.initDay(dailyCraft.table, today, 0, saved.won, saved.attempts);
        if (saved.won) {
          setCompletedMs(saved.elapsedMs);
        }
        setElapsedMs(saved.elapsedMs);
      } else {
        store.initDay(dailyCraft.table, today, 0, false);
      }

      setHydrated(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCrafts, today]);

  // Timer
  useEffect(() => {
    if (!hydrated || gameState === "won" || store.alreadyCompleted) {
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
  }, [hydrated, gameState, store.alreadyCompleted, today]);

  const isFinished = gameState === "won" || store.alreadyCompleted;
  const answerSlots = useMemo(() => craft ? craftToSlots(craft) : [], [craft]);

  const preCheckSubmitCheck = (): [boolean, string] => {
    if (!craftExists(currentSlots, allCrafts) && !findEquivalentCraft(currentSlots, allCrafts)) {
      return [false, "Ce craft n'existe pas dans notre base de donnee, retente avec une recette valide."];
    }
    return [true, ""];
  };

  const handleSubmitCallback = () => {
    if (!craft) {
      return;
    }
    const equivalent = findEquivalentCraft(currentSlots, allCrafts);
    const slotsToSend = equivalent ? craftToSlots(equivalent) : currentSlots;
    const result = checkGuess(slotsToSend, answerSlots);
    addAttempt({ slots: slotsToSend, result });

    const won = result.every(r => r === "correct");
    const currentElapsed = elapsedMs;

    if (won) {
      setWon(currentElapsed);
      setCompletedMs(currentElapsed);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    // Save to localStorage
    const currentAttempts = [...useWordleStore.getState().attempts];
    saveDailyState({
      date: today,
      attempts: currentAttempts,
      won,
      elapsedMs: currentElapsed,
    });

    setIsWaiting(false);
  };

  const displayedElapsed = gameState === "won" ? completedMs : elapsedMs;

  if (!hydrated || !craft) {
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
            <PageHeaderHeading>{textFormatting("Craft °Wordle° - Daily")}</PageHeaderHeading>
            <PageHeaderDescription>{today} - Mode difficile - Tentatives illimitees</PageHeaderDescription>
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

            {!isFinished && (
              <WordleGame handleSubmitPreCheck={preCheckSubmitCheck} pendingAttemptRef={pendingAttemptRef} handleSubmitCallback={handleSubmitCallback} />
            )}

            {gameState === "won" && (
              <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-400 font-bold text-xl">Bravo !</p>
                <p className="text-gray-400 mt-1">
                  Tu as trouve en {attempts.length} {adaptPlurial("tentative", attempts.length)} - {formatElapsed(completedMs)}
                </p>
              </div>
            )}

            {store.alreadyCompleted && gameState !== "won" && (
              <div className="p-4 bg-zinc-800/60 border border-zinc-600 rounded-lg">
                <p className="text-zinc-300 font-semibold">Tu as deja complete le Wordle d&apos;aujourd&apos;hui !</p>
                <p className="text-zinc-500 text-sm mt-1">Reviens demain pour un nouveau craft.</p>
              </div>
            )}
          </div>

          <div className="hidden lg:block border-l border-secondary pl-6 ml-2">
            <WordleHowToPlay mode="daily" />
          </div>
        </Card>

        {attempts.length !== 0 && (
          <Card>
            <AttemptsHistory attempts={attempts} table={table} />
          </Card>
        )}
      </div>
    </div>
  );
}
