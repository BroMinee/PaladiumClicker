"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import Image from "next/image";
import { LoadingSpinner } from "../ui/loading-spinner";
import { constants } from "@/lib/constants";
import { safeJoinPaths } from "@/lib/misc";

/**
 * Display the player banner
 */
export function Banner() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner/>;
  }

  return <Image
    src={playerInfo.currentBanner ? safeJoinPaths(constants.imgPathProfile, `${playerInfo.currentBanner}.png`) : safeJoinPaths(constants.imgPathProfile, "default.png")}
    alt="Bannière du joueur"
    width={0}
    height={0}
    className="w-full h-full"
    unoptimized={true}
  />;
}