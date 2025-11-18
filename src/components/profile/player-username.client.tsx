"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "../ui/loading-spinner";

/**
 * Display the player username
 */
export function PlayerUsername() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return <>{playerInfo.username}</>;
}