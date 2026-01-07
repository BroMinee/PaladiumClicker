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
    }
    );
  }, [playerInfo, setLeaderboardFaction]);

  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    const emblem = playerInfo.faction.emblem;
    const bgColor = emblem.backgroundColor;
    const fgColor = emblem.foregroundColor;
    const color1 = intToHex(bgColor);
    const color2 = intToHex(fgColor);

    setGradientStyle(`linear-gradient(to right, ${color1}, ${color2}, ${color1})`);
  }, [playerInfo]);

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-row">
      <div className="flex-shrink-0 mr-8">
        <div className="flex flex-col gap-2 relative">
          <div
            className="max-w-40 relative p-1 rounded-xl w-fit mr-2 animate-pan-gradient duration-5000 overflow-hidden"
            style={{ backgroundSize: "200%", backgroundImage: gradientStyle }}
          >
            <FactionEmblemClient className="h-fit w-full rounded-xl object-cover bg-card p-2" />
          </div>
          <span className=" bg-clip-text px-5 py-2 rounded-full font-black text-xl text-center animate-pan-gradient duration-5000 rounded drop- text-transparent" style={{ backgroundImage: gradientStyle, backgroundSize: "200%" }}>
            TOP #{factionIndex}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wider mb-1">
            Faction
          </div>
          <h2 className="text-4xl mb-2">
            <PlayerFactionName />
            <div className="h-1 w-full rounded-full mt-2 animate-pan-gradient duration-5000" style={{ backgroundImage: gradientStyle, backgroundSize: "200%" }} />
          </h2>
        </div>

        <p className="text-lg leading-relaxed line-clamp-2">
          {playerInfo.faction.description}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm text-card-foreground mb-2">
              <span>Classement</span>
              <span className="font-bold text-yellow-400">#{factionIndex}/{leaderboardFaction.length}</span>
            </div>
            <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
              <div className="h-1 w-48 rounded-full animate-pan-gradient duration-5000" style={{
                backgroundImage: gradientStyle,
                backgroundSize: "200%",
                width: `${100 - (factionIndex - 1) * 100 / leaderboardFaction.length}%`
              }} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}