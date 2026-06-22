"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { CraftingRecipeType, CraftingTableName } from "@/types";
import { cn } from "@/lib/utils";
import {
  SlotValue, Attempt, TileStatus,
  craftToSlots, formatElapsed, craftRecipeToDispatch,
  craftExists,
} from "@/components/wordle/wordle-utils";
import { AttemptsHistory } from "@/components/wordle/wordle-ui";
import { DispatchRecipePattern } from "@/components/craft/display/dispatch-recipe-pattern";
import { API_PALATRACKER_WS } from "@/lib/constants";
import { WordleGame } from "@/components/wordle/wordle-game";
import { useWordleStore } from "@/stores/use-wordle-store";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { adaptPlurial } from "@/lib/misc";
import { textFormatting } from "@/lib/misc/patchnote";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/ui/page";
import { ChevronDown } from "lucide-react";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";
import { useItemsStore } from "@/stores/use-items-store";
import { WordleHowToPlay } from "@/components/wordle/wordle-how-to-play";
import { useProfileStore } from "@/stores/use-profile-store";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { LoginButton } from "@/components/login/login-button.client";
import { API_PALATRACKER } from "@/lib/constants";

const PING_INTERVAL_MS = 30_000;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

interface WsHistoryItem {
  guess: string[];
  feedback: TileStatus[];
}

interface LeaderboardEntry {
  totalTimeMs: number;
  username: string | null;
  avatar: string | null;
  isMe?: boolean;
}

interface WsHelloData {
  totalTimeMs: number;
  completed: boolean;
  history: WsHistoryItem[];
  table: CraftingTableName;
  leaderboard: LeaderboardEntry[];
}

interface WsMessage {
  type: "hello" | "complete" | "wrong" | "pong" | "error";
  data?: WsHelloData & { success?: boolean; feedback?: TileStatus[] };
}

interface Props {
  yesterdayCraft: CraftingRecipeType | null;
}

/**
 * [Wordle daily page](https://palatracker.bromine.fr/wordle/daily)
 */
export function WordleDailyGame({ yesterdayCraft }: Props) {
  const { allCrafts } = useAllCraftsStore();
  const { allItems } = useItemsStore();
  const { profileInfo } = useProfileStore();

  const { gameState, totalTimeMs, alreadyCompleted, initDay, attempts, currentSlots, addAttempt, setWon, completedAtMs, setIsWaiting, table } = useWordleStore();

  const isFinished = gameState === "won" || alreadyCompleted;

  const [elapsedMs, setElapsedMs] = useState(0);
  const [showYesterday, setShowYesterday] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const connectionStartRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAttemptRef = useRef<SlotValue[] | null>(null);

  const yesterdayDispatch = useMemo(
    () => yesterdayCraft ? craftRecipeToDispatch(yesterdayCraft, allItems) : null,
    [yesterdayCraft, allItems],
  );

  const openWs = useCallback(() => {
    const today = todayISO();
    const ws = new WebSocket(`${API_PALATRACKER_WS}/v1/ws/wordle`);
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
        const { totalTimeMs, completed, history, table, leaderboard } = msg.data;
        const attempts: Attempt[] = (history ?? []).map(h => ({
          slots: h.guess.map(s => (s === "air" ? null : s)),
          result: h.feedback,
        }));
        initDay(table, today, totalTimeMs, completed, attempts);
        const me = useProfileStore.getState().profileInfo;
        setLeaderboard((leaderboard ?? []).map(e => ({
          ...e,
          isMe: me !== null && (e.username === me.global_name || e.username === me.username),
        })));
        setHydrated(true);
      }

      if (msg.type === "complete" || msg.type === "wrong") {
        const slots = pendingAttemptRef.current;
        if (!slots) {
          return;
        }
        pendingAttemptRef.current = null;
        const result: TileStatus[] = msg.data?.feedback ?? Array(9).fill("absent");
        addAttempt({ slots, result });
        if (msg.type === "complete") {
          const s = useWordleStore.getState();
          const sessionMs = connectionStartRef.current > 0 ? Date.now() - connectionStartRef.current : 0;
          const finalMs = s.totalTimeMs + sessionMs;
          setWon(finalMs);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          const p = useProfileStore.getState().profileInfo;
          setLeaderboard(prev => {
            const next = [...prev, { totalTimeMs: finalMs, username: p?.username ?? null, avatar: p?.avatar ?? null, isMe: true }];
            return next.sort((a, b) => a.totalTimeMs - b.totalTimeMs);
          });
          setShowLeaderboard(true);
        }
        setIsWaiting(false);
      }

      if (msg.type === "error") {
        pendingAttemptRef.current = null;
        setIsWaiting(false);
        toast.error("Erreur serveur. Réessaie.");
      }
    };

    ws.onerror = (e) => console.error("[wordle/ws] error", e);
    ws.onclose = (e) => {
      console.log(`[wordle/ws] disconnected - code: ${e.code}`);
      if (pingRef.current) {
        clearInterval(pingRef.current);
      }
      connectionStartRef.current = 0;
    };
  }, [initDay, addAttempt, setWon, setIsWaiting]);

  useEffect(() => {
    openWs();
    return () => {
      if (pingRef.current) {
        clearInterval(pingRef.current);
      }
      wsRef.current?.close();
    };
  }, [openWs]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (gameState === "won" || alreadyCompleted) {
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

  const displayedElapsed = gameState === "won" ? (completedAtMs ?? 0) : elapsedMs;
  const yesterdaySlots = yesterdayCraft ? craftToSlots(yesterdayCraft) : null;

  const preCheckSubmitCheck = (): [boolean, string] => {
    if (!craftExists(currentSlots, allCrafts)) {
      return [false, "Ce craft n'existe pas dans notre base de donnée, retente avec une recette valide."];
    }
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      return [false, "Connexion au serveur perdue. Rechargez la page."];
    }
    return [true, ""];
  };

  const handleSubmitCallback = () => {
    wsRef.current!.send(JSON.stringify({ type: "guess", data: currentSlots.map(s => s ?? "air") }));
  };

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
            <PageHeaderHeading>{textFormatting("Craft °Wordle° - Daily")}</PageHeaderHeading>
            <PageHeaderDescription>{todayISO()} · Mode difficile · Tentatives illimitées</PageHeaderDescription>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-1 shrink-0">
            <span className={cn("font-mono text-lg font-semibold tabular-nums", isFinished ? "text-green-400" : "text-white")}>
              {formatElapsed(displayedElapsed)}
            </span>
            {isFinished && <span className="text-xs text-green-400">Terminé !</span>}
            {leaderboard.length > 0 && (
              <span className="text-xs text-zinc-400">{leaderboard.length} {adaptPlurial("joueur", leaderboard.length)} ont réussi</span>
            )}
          </div>
        </div>
      </PageHeader>

      <div className="flex gap-6 flex-col">

        <Card className="shrink-0 flex flex-col lg:flex-row gap-6 items-start">

          <div className="flex-1 flex flex-col gap-3 min-w-0 w-full">
            <div className="flex lg:hidden items-center gap-2">
              <span className={cn("font-mono text-lg font-semibold tabular-nums", isFinished ? "text-green-400" : "text-white")}>
                {formatElapsed(displayedElapsed)}
              </span>
              {isFinished && <span className="text-xs text-green-400">Terminé !</span>}
              {leaderboard.length > 0 && (
                <span className="text-xs text-zinc-400">{leaderboard.length} {adaptPlurial("joueur", leaderboard.length)} ont réussi</span>
              )}
            </div>
            {!isFinished && (
              <WordleGame handleSubmitPreCheck={preCheckSubmitCheck} pendingAttemptRef={pendingAttemptRef} handleSubmitCallback={handleSubmitCallback}/>
            )}

            {gameState === "won" && (
              <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-400 font-bold text-xl">Bravo !</p>
                <p className="text-gray-400 mt-1">
                  Tu as trouvé en {attempts.length} {adaptPlurial("tentative", attempts.length)} - {formatElapsed(completedAtMs ?? 0)}
                </p>
              </div>
            )}

            {alreadyCompleted && gameState !== "won" && (
              <div className="p-4 bg-zinc-800/60 border border-zinc-600 rounded-lg">
                <p className="text-zinc-300 font-semibold">Tu as déjà complété le Wordle d&apos;aujourd&apos;hui !</p>
                <p className="text-zinc-500 text-sm mt-1">Reviens demain pour un nouveau craft.</p>
              </div>
            )}

            {leaderboard.length > 0 && (
              <div className="border-t border-secondary pt-3">
                <button
                  onClick={() => setShowLeaderboard(p => !p)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                >
                  <ChevronDown size={16} className={`transition-transform duration-300 ${showLeaderboard ? "rotate-0" : "-rotate-90"}`}/>
                  Voir le classement du jour
                </button>
                {showLeaderboard && (
                  <div className="mt-3 flex flex-col gap-0.5 ml-4">
                    {!profileInfo && (
                      <div className="flex flex-col gap-1 mb-3">
                        <p className="text-xs text-gray-500">Connecte-toi pour associer ton temps à ton compte Discord.</p>
                        <LoginButton href={`${API_PALATRACKER}/v1/auth/login/discord`} redirectUrl="/wordle/daily" />
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

            {yesterdaySlots && yesterdayDispatch && (
              <div className="border-t border-secondary pt-3">
                <button
                  onClick={() => setShowYesterday(p => !p)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                >
                  <ChevronDown size={16} className={`transition-transform duration-300 ${showYesterday ? "rotate-0" : "-rotate-90"}`}/>
                  Réponse d&apos;hier
                </button>
                {showYesterday && (
                  <div className="mt-3 flex flex-col items-start gap-1">
                    {yesterdayCraft && (
                      <p className="text-xs text-gray-500 ml-4">{yesterdayCraft.item.fr_trad}</p>
                    )}
                    <DispatchRecipePattern recipe={yesterdayDispatch.recipe} output={yesterdayDispatch.output} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden lg:block border-l border-secondary pl-6 ml-2">
            <WordleHowToPlay mode="daily" />
          </div>
        </Card>

        {attempts.length !== 0 &&
          <Card>
            <AttemptsHistory attempts={attempts} table={table}/>
          </Card>
        }
      </div>

    </div>
  );
}
