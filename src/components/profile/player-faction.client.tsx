"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "../ui/loading-spinner";
import { intToHex } from "@/lib/misc";

/**
 * Display the player's rank
 */
export function PlayerFactionName() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  const emblem = playerInfo.faction.emblem;
  const bgColor = emblem.backgroundColor;
  const fgColor = emblem.foregroundColor;

  const color1 = intToHex(bgColor);
  const color2 = intToHex(fgColor);

  const gradientStyle = `linear-gradient(to right, ${color1}, ${color2}, ${color1})`;

  return <span className="font-extrabold tracking-tight animate-pan-gradient bg-clip-text text-transparent" style={{
    backgroundImage: gradientStyle,
    backgroundSize: "200% auto",
  }}>{playerInfo.faction.name}</span>;
}