"use client";
import { PlayerFactionName } from "../player-faction.client";
import { useEffect, useState } from "react";
import { PaladiumFactionLeaderboard } from "@/types";
import { getFactionLeaderboardAction } from "@/lib/api/api-server-action.server";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { intToHex } from "@/lib/misc";
import { FactionMembersList } from "./faction-members-lists.client";
import { FactionEmblemClient } from "./faction-emblem.client";

/**
 * Display the player's faction info
 */
export function FactionSection() {
  return (
    <div>
      <FactionMainInformation />
      <FactionMembersList />
    </div>
  );

}

function FactionMainInformation() {
  const { data: playerInfo } = usePlayerInfoStore();

  const [leaderboardFaction, setLeaderboardFaction] = useState<PaladiumFactionLeaderboard>([]);
  const [factionIndex, setFactionIndex] = useState<number>(-1);
  const [gradientStyle, setGradientStyle] = useState<string>("linear-gradient(to right, white, white, white)");

  useEffect(() => {
    getFactionLeaderboardAction().then(e => {
      setLeaderboardFaction(e);
      if (playerInfo && e.length > 0) {
        setFactionIndex(e.findIndex((faction) => faction.name === playerInfo.faction.name) + 1);
      }
    });
  }, [playerInfo]);

  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    const emblem = playerInfo.faction.emblem;
    const color1 = intToHex(emblem.backgroundColor);
    const color2 = intToHex(emblem.foregroundColor);

    setGradientStyle(`linear-gradient(to right, ${color1}, ${color2}, ${color1})`);
  }, [playerInfo]);

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 p-4">
      <div className="flex-shrink-0">
        <div className="flex flex-col gap-2 items-center">
          <div
            className="w-32 h-32 md:w-40 md:h-40 relative p-1 rounded-2xl animate-pan-gradient duration-5000 overflow-hidden"
            style={{ backgroundSize: "200%", backgroundImage: gradientStyle }}
          >
            <FactionEmblemClient className="h-full w-full rounded-xl object-cover bg-card p-2" />
          </div>

          <span
            className="bg-clip-text px-6 py-1 rounded-full font-black text-xl text-center animate-pan-gradient duration-5000 text-transparent border border-white/10"
            style={{ backgroundImage: gradientStyle, backgroundSize: "200%" }}
          >
            TOP #{factionIndex}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col text-center md:text-left w-full">
        <div className="mb-4">
          <div className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Faction
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-2">
            <PlayerFactionName />
            <div
              className="h-1.5 w-full max-w-[200px] md:max-w-none mx-auto md:mx-0 rounded-full mt-3 animate-pan-gradient duration-5000"
              style={{ backgroundImage: gradientStyle, backgroundSize: "200%" }}
            />
          </h2>
        </div>

        <p className="text-base md:text-lg leading-relaxed line-clamp-3 mb-6 px-2 md:px-0">
          {playerInfo.faction.description}
        </p>

        <div className="w-full  mx-auto md:mx-0">
          <div className="flex items-center justify-between text-sm mb-2 px-1">
            <span className="font-medium">Classement</span>
            <span className="font-bold text-yellow-400">#{factionIndex}/{leaderboardFaction.length}</span>
          </div>
          <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden p-[2px]">
            <div
              className="h-full rounded-full animate-pan-gradient duration-5000 transition-all"
              style={{
                backgroundImage: gradientStyle,
                backgroundSize: "200%",
                width: `${Math.max(5, 100 - (factionIndex - 1) * 100 / leaderboardFaction.length)}%`
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}