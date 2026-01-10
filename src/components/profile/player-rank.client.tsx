"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { constants } from "@/lib/constants";
import { getRankImg, safeJoinPaths } from "@/lib/misc";
import { useState } from "react";

/**
 * Display the player's rank
 */
export function PlayerRank() {
  const { data: playerInfo } = usePlayerInfoStore();
  const rank = playerInfo ? playerInfo.rank[0].toUpperCase() + playerInfo.rank.slice(1) : "Default";
  const [imgSrc, setImgSrc] = useState(getRankImg(rank));

  const fallbackSrc = getRankImg("Default");

  const handleImageError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  if (playerInfo.uuid === "b6e136eb-75cb-48bd-9ff5-dd9bfb64b869") {
    return <Image src={safeJoinPaths(constants.imgPathProfile, "blackhole.png")} alt={"blackhole.png"}
      width={0}
      height={0}
      className="h-12 w-fit rounded-md pixelated" unoptimized />;
  }

  return <Image src={imgSrc} alt={rank}
    width={0}
    height={0}
    className="h-12 w-fit rounded-md pixelated" unoptimized onError={handleImageError} />;
}