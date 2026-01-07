"use client";
import { Emblem } from "@/components/faction/emblem";
import { LoadingData } from "@/components/loading-data";
import { cn } from "@/lib/utils";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { Suspense } from "react";

/**
 * Display the player's faction emblem
 * @param className - optional className
 */
export function FactionEmblemClient({ className }: { className?: string }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <Suspense fallback={<LoadingData username={undefined} />} />;
  }
  return <Emblem emblem={playerInfo?.faction.emblem} className={cn("h-16 w-16 rounded-xl object-cover ", className)} />;
}