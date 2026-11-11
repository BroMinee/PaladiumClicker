"use client";

import { useState, useRef, useEffect } from "react";
import { CraftingRecipeType, CraftingTableName } from "@/types";
import { cn } from "@/lib/utils";
import { SlotValue, formatElapsed, craftRecipeToDispatch } from "@/components/wordle/wordle-utils";
import { API_PALATRACKER_WS, API_PALATRACKER } from "@/lib/constants";
import { CraftFinderGame } from "@/components/craft-finder/craft-finder-game";
import { CraftFinderCounter, FoundCraftsHistory } from "@/components/craft-finder/craft-finder-ui";
import { useCraftFinderStore, FoundCraft } from "@/stores/use-craft-finder-store";
import { useItemsStore } from "@/stores/use-items-store";
import { useProfileStore } from "@/stores/use-profile-store";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { LoginButton } from "@/components/login/login-button.client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { adaptPlurial } from "@/lib/misc";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc/patchnote";
import { ChevronDown } from "lucide-react";
import { DispatchRecipePattern } from "@/components/craft/display/dispatch-recipe-pattern";
import { ItemsBadgeList } from "@/components/craft-finder/craft-finder-ui";
import { CraftFinderHowToPlay } from "@/components/craft-finder/craft-finder-how-to-play";

const PING_INTERVAL_MS = 30_000;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

interface WsFoundCraftItem {
  slots: string[];
  outputItemName: string;
  outputItemImg: string;
  table: CraftingTableName;
}

interface LeaderboardEntry {
  totalTimeMs: number;
  username: string | null;
  avatar: string | null;
  isMe?: boolean;
}

interface WsHelloData {
  items: string[];
  totalToFind: number;
  completed: boolean;
  found: WsFoundCraftItem[];
  totalTimeMs: number;
  leaderboard: LeaderboardEntry[];
}

interface WsCraftData {
  outputItemName: string;
  outputItemImg: string;
  table: CraftingTableName;
  totalFound: number;
  totalTimeMs?: number;
  leaderboard?: LeaderboardEntry[];
}

interface WsMessage {
  type: "hello" | "found" | "already_found" | "not_a_match" | "complete" | "error" | "pong";
  data?: WsHelloData & WsCraftData & { message?: string };
}

/**
 * [Craft Finder daily page](https://palatracker.bromine.fr/craft-finder/daily)
 */
interface Props {
  yesterday: { items: string[]; crafts: CraftingRecipeType[]; date: string } | null;
}

/**
 *
 */
export function CraftFinderDailyGame({ yesterday }: Props) {
  const store = useCraftFinderStore();
  const { allItems } = useItemsStore();
  const { profileInfo } = useProfileStore();

  const { gameState, totalTimeMs, alreadyCompleted, completedAtMs } = store;
  const isFinished = gameState === "won" || alreadyCompleted;

  const [elapsedMs, setElapsedMs] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [showYesterday, setShowYesterday] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentTable, setCurrentTable] = useState<CraftingTableName>("crafting table");

  const wsRef = useRef<WebSocket | null>(null);
  const connectionStartRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAttemptRef = useRef<SlotValue[] | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const today = todayISO();
    const ws = new WebSocket(`${API_PALATRACKER_WS}/v1/ws/craft-finder`);
    wsRef.current = ws;

    ws.onopen = () => {
      connectionStartRef.current = Date.now();
      pingRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, PING_INTERVAL_MS);
    };

    ws.onmessage = (event: MessageEvent) => {
      let msg: WsMessage;
      try {
        msg = JSON.parse(event.data as string) as WsMessage;
      } catch {
        return;
      }

      if (msg.type === "hello" && msg.data) {
        const { items, totalToFind, completed, found, totalTimeMs, leaderboard } = msg.data as WsHelloData;
        const foundCrafts: FoundCraft[] = (found ?? []).map(f => ({
          slots: f.slots.map(s => s === "air" ? null : s),
          outputItemName: f.outputItemName,
          outputItemImg: f.outputItemImg,
          table: f.table,
        }));
        if (foundCrafts[0]) {
          setCurrentTable(foundCrafts[0].table);
        }
        useCraftFinderStore.getState().initDay(items, totalToFind, today, totalTimeMs, completed, foundCrafts);
        const me = useProfileStore.getState().profileInfo;
        setLeaderboard((leaderboard ?? []).map(e => ({
          ...e,
          isMe: me !== null && (e.username === me.global_name || e.username === me.username),
        })));
        setHydrated(true);
      }

      if (msg.type === "found" && msg.data) {
        const slots = pendingAttemptRef.current;
        if (!slots) {
          return;
        }
        pendingAttemptRef.current = null;
        const { outputItemName, outputItemImg, table } = msg.data as WsCraftData;
        setCurrentTable(table);
        const store = useCraftFinderStore.getState();
        store.addFoundCraft({ slots, outputItemName, outputItemImg, table });
        store.setFlashingItem({ img: outputItemImg, name: outputItemName });
        store.setIsFlashing(true);
        if (flashTimerRef.current) {
          clearTimeout(flashTimerRef.current);
        }
        flashTimerRef.current = setTimeout(() => {
          useCraftFinderStore.getState().setIsFlashing(false);
          useCraftFinderStore.getState().setFlashingItem(null);
          useCraftFinderStore.getState().setCurrentSlots(Array(9).fill(null));
        }, 1000);
        const item = useItemsStore.getState().allItems.find(i => i.value === outputItemName);
        if (item) {
          toast.success(`Trouvé : ${item.label} !`);
        }
        store.setIsWaiting(false);
      }

      if (msg.type === "complete" && msg.data) {
        const slots = pendingAttemptRef.current;
        if (!slots) {
          return;
        }
        pendingAttemptRef.current = null;
        const { outputItemName, outputItemImg, table, totalTimeMs: finalMs, leaderboard: lb } = msg.data as WsCraftData;
        setCurrentTable(table);
        const store = useCraftFinderStore.getState();
        store.addFoundCraft({ slots, outputItemName, outputItemImg, table });
        store.setFlashingItem({ img: outputItemImg, name: outputItemName });
        store.setIsFlashing(true);
        if (flashTimerRef.current) {
          clearTimeout(flashTimerRef.current);
        }
        flashTimerRef.current = setTimeout(() => {
          useCraftFinderStore.getState().setIsFlashing(false);
          useCraftFinderStore.getState().setFlashingItem(null);
          useCraftFinderStore.getState().setCurrentSlots(Array(9).fill(null));
        }, 1000);
        const sessionMs = connectionStartRef.current > 0 ? Date.now() - connectionStartRef.current : 0;
        const resolvedMs = finalMs ?? (store.totalTimeMs + sessionMs);
        store.setWon(resolvedMs);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        const p = useProfileStore.getState().profileInfo;
        if (lb && lb.length > 0) {
          setLeaderboard(lb.map(e => ({
            ...e,
            isMe: p !== null && (e.username === p.global_name || e.username === p.username),
          })));
        } else {
          setLeaderboard(prev => {
            const next = [...prev, { totalTimeMs: resolvedMs, username: p?.global_name ?? p?.username ?? null, avatar: p?.avatar ?? null, isMe: true }];
            return next.sort((a, b) => a.totalTimeMs - b.totalTimeMs);
          });
        }
        setShowLeaderboard(true);
        store.setIsWaiting(false);
      }

      if (msg.type === "already_found") {
        pendingAttemptRef.current = null;
        useCraftFinderStore.getState().setIsWaiting(false);
        toast("Déjà trouvé !");
      }

      if (msg.type === "not_a_match") {
        pendingAttemptRef.current = null;
        useCraftFinderStore.getState().setIsWaiting(false);
      }

      if (msg.type === "error") {
        pendingAttemptRef.current = null;
        useCraftFinderStore.getState().setIsWaiting(false);
        toast.error("Erreur serveur. Réessaie.");
      }
    };

    ws.onerror = (e) => console.error("[craft-finder/ws] error", e);
    ws.onclose = (e) => {
      console.log(`[craft-finder/ws] disconnected - code: ${e.code} ${JSON.stringify(e)}`);
      if (pingRef.current) {
        clearInterval(pingRef.current);
      }
      connectionStartRef.current = 0;
    };

    return () => {
      if (pingRef.current) {
        clearInterval(pingRef.current);
      }
      ws.close();
    };

  }, []);

  useEffect(() => {
    if (!hydrated || gameState === "won" || alreadyCompleted) {
      return;
    }
    const tick = () => {
      const sessionMs = connectionStartRef.current > 0 ? Date.now() - connectionStartRef.current : 0;
      setElapsedMs(totalTimeMs + sessionMs);
    };
    timerRef.current = setInterval(tick, 1000);
    setTimeout(tick, 0);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [hydrated, gameState, alreadyCompleted, totalTimeMs]);

  const handleMatch = (slots: SlotValue[]) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN || store.isWaiting) {
      return;
    }
    if (slots.every(s => s === null)) {
      return;
    }
    pendingAttemptRef.current = slots;
    store.setIsWaiting(true);
    wsRef.current.send(JSON.stringify({ type: "guess", data: slots.map(s => s ?? "air") }));
  };

  const displayedElapsed = gameState === "won" ? (completedAtMs ?? 0) : elapsedMs;

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-[100dvh]">
        <p className="text-gray-400 text-sm animate-pulse">Connexion…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader className="shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <PageHeaderHeading>{textFormatting("Craft °Finder° - Daily")}</PageHeaderHeading>
            <PageHeaderDescription>{todayISO()} · Trouve tous les crafts du jour</PageHeaderDescription>
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
              {isFinished && <span className="text-xs text-green-400">Terminé !</span>}
              {leaderboard.length > 0 && (
                <span className="text-xs text-zinc-400">{leaderboard.length} {adaptPlurial("joueur", leaderboard.length)} ont réussi</span>
              )}
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
                  Tu as trouvé les {store.foundCrafts.length} crafts en {formatElapsed(completedAtMs ?? 0)}
                </p>
              </div>
            )}

            {alreadyCompleted && gameState !== "won" && (
              <div className="p-4 bg-zinc-800/60 border border-zinc-600 rounded-lg">
                <p className="text-zinc-300 font-semibold">Tu as déjà complété le Craft Finder d&apos;aujourd&apos;hui !</p>
                <p className="text-zinc-500 text-sm mt-1">Reviens demain pour une nouvelle liste d&apos;items.</p>
              </div>
            )}

            {leaderboard.length > 0 && (
              <div className="border-t border-secondary pt-3">
                <button
                  onClick={() => setShowLeaderboard(p => !p)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                >
                  <ChevronDown size={16} className={`transition-transform duration-300 ${showLeaderboard ? "rotate-0" : "-rotate-90"}`} />
                  Voir le classement du jour
                </button>
                {showLeaderboard && (
                  <div className="mt-3 flex flex-col gap-0.5 ml-4">
                    {!profileInfo && (
                      <div className="flex flex-col gap-1 mb-3">
                        <p className="text-xs text-gray-500">Connecte-toi pour associer ton temps à ton compte Discord.</p>
                        <LoginButton href={`${API_PALATRACKER}/v1/auth/login/discord`} redirectUrl="/craft-finder/daily" />
                      </div>
                    )}
                    {[...leaderboard]
                      .sort((a, b) => a.totalTimeMs - b.totalTimeMs)
                      .map((entry, i) => (
                        <div key={i} className={cn("flex items-center gap-2 py-0.5 px-1 rounded", entry.isMe && "bg-green-900/30")}>
                          <span className="text-xs text-gray-500 w-4 shrink-0">#{i + 1}</span>
                          {entry.avatar
                            ? <UnOptimizedImage src={entry.avatar} alt={entry.username ?? "?"} width={20} height={20} className="rounded-full w-5 h-5 shrink-0" />
                            : <div className="w-5 h-5 rounded-full bg-zinc-700 shrink-0" />
                          }
                          <span className={cn("text-sm truncate flex-1", entry.isMe ? "text-green-400 font-medium" : "text-gray-400")}>{entry.username ?? "Anonyme"}</span>
                          <span className={cn("font-mono text-sm tabular-nums shrink-0", i === 0 ? "text-yellow-400" : entry.isMe ? "text-green-400" : "text-gray-300")}>
                            {formatElapsed(entry.totalTimeMs)}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
            {yesterday && (
              <div className="border-t border-secondary pt-3">
                <button
                  onClick={() => setShowYesterday(p => !p)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                >
                  <ChevronDown size={16} className={`transition-transform duration-300 ${showYesterday ? "rotate-0" : "-rotate-90"}`} />
                  Réponse d&apos;hier
                </button>
                {showYesterday && (
                  <div className="mt-3 flex flex-col gap-3 ml-4">
                    <ItemsBadgeList items={yesterday.items} allItems={allItems} />
                    <div className="flex flex-wrap items-start">
                      {yesterday.crafts.map((craft, i) => {
                        const d = craftRecipeToDispatch(craft, allItems);
                        return (
                          <>
                            {i > 0 && <div key={`sep-${i}`} className="w-px bg-secondary self-stretch mx-3" />}
                            <div key={i} className="flex flex-col gap-1">
                              <span className="text-xs text-gray-500">{craft.item.fr_trad}</span>
                              <DispatchRecipePattern recipe={d.recipe} output={d.output} />
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden lg:block border-l border-secondary pl-6 ml-2">
            <CraftFinderHowToPlay mode="daily" />
          </div>
        </Card>

        {store.foundCrafts.length > 0 && (
          <Card>
            <p className="text-sm text-gray-400 mb-3">Crafts trouvés</p>
            <FoundCraftsHistory foundCrafts={store.foundCrafts} />
          </Card>
        )}
      </div>
    </div>
  );
}
