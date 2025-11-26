"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import Image from "next/image";
import { LoadingSpinner } from "../ui/loading-spinner";

/**
 * Display the player head skin
 */
export function PlayerSkin() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return <Image
    src={`https://mineskin.eu/helm/${playerInfo.uuid}/16`}
    alt="Skin du joueur"
    className="w-full h-full object-cover pixelated"
    width={0}
    height={0}
    unoptimized={true}
  />;
}