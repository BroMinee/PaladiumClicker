"use client";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { GradientText } from "@/components/shared/GradientText";
import { convertEpochToDateUTC2, formatPrice, safeJoinPaths } from "@/lib/misc";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SmallCardInfo } from "@/components/shared/SmallCardInfo";
import { FaPercentage } from "react-icons/fa";
import { PaladiumFactionLeaderboard } from "@/types";
import { LoadingData } from "@/components/LoadingData";
import { Suspense } from "react";
import { constants } from "@/lib/constants";

import Image from "next/image";
import { Emblem } from "../Faction/Emblem";
import { cn } from "@/lib/utils";

/**
 * Display the player's faction name
 */
export function FactionNameInfo() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (playerInfo === null) {
    return null;
  }

  return <>{playerInfo.faction.name}</>;
}

/**
 * Display the player's faction description
 */
export function FactionInfoDescription() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (playerInfo === null) {
    return null;
  }

  return <>{playerInfo.faction.description}</>;
}

/**
 * Display the player's faction members
 */
export function FactionInfoMembersInfo() {
  const { data: playerInfo } = usePlayerInfoStore();
  const playerList = playerInfo ? playerInfo.faction.players : [];

  return (
    <>
      <GradientText className="font-bold">
        {formatPrice(playerList?.length)}
      </GradientText>
      Membre{playerList?.length !== undefined && playerList?.length > 1 ? "s" : ""}
    </>);
}

/**
 *
 */
export function FactionDetails() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return <Suspense fallback={<LoadingData username={undefined} />} />;
  }

  const createdAt = playerInfo.faction.createdAt;
  const level = playerInfo.faction.level?.level ?? -1;
  const xp = playerInfo.faction.level?.xp ?? -1;
  const playerList = playerInfo.faction.players;

  return (
    <>
      <Card>
        <SmallCardInfo title="Niveau - [xp]" value={`${level} - [${formatPrice(xp)}]`}
          img={safeJoinPaths(constants.imgPathProfile, "ExperienceOrb.webp")} unoptimized />
      </Card>
      <Card>
        <SmallCardInfo title="Date de création" value={convertEpochToDateUTC2(createdAt)} img={safeJoinPaths(constants.imgPathProfile, "clock.gif")} unoptimized />
      </Card>
      <ScrollArea className="md:col-span-3">
        <div className="flex gap-4 pb-3">
          {
            playerList?.map((player) => (
              <a href={`${constants.profilPath}/${player.username}`} key={player.uuid}>
                <Card
                  className="hover:scale-105 duration-300 mt-4 ml-1.5 mr-1.5 cursor-pointer">
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Image src={`https://mineskin.eu/helm/${player.uuid}`}
                        alt="Icône"
                        width={48} height={48}
                        unoptimized={true}
                        className="object-cover pixelated rounded-md"/>
                      <div className="text-primary font-bold text-center w-36">{player.username}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <FaPercentage className="h-4 w-4 mr-2 inline-block" />
                        Rôle: {player.group}
                      </div>
                      <div className="text-sm">
                        <Image src={safeJoinPaths(constants.imgPathProfile, "clock.gif")} alt="Icône"
                          width={16} height={16}
                          className="object-cover inline-block pixelated mr-2" unoptimized />
                        Rejoint le: {convertEpochToDateUTC2(player.joinedAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))
          }
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>);
}

/**
 * Display the player's faction rank
 * @param factionLeaderboard - The faction leaderboard
 */
export function FactionClassementClient({ factionLeaderboard }: { factionLeaderboard: PaladiumFactionLeaderboard }) {
  const { data: playerInfo } = usePlayerInfoStore();
  let factionIndex = -1;
  if (playerInfo && factionLeaderboard.length > 0) {
    factionIndex = factionLeaderboard.findIndex((faction) => faction["name"] === playerInfo.faction.name) + 1;
  }

  return (
    <>
      {factionIndex}
    </>
  );
}

/**
 * Display the player's faction emblem
 * @param className - optional className
 */
export function FactionEmblemClient({ className }: { className?: string }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <Suspense fallback={<LoadingData username={undefined} />} />;
  }
  return <Emblem emblem={playerInfo?.faction.emblem} className={cn("h-16 w-16 rounded-xl object-cover shadow-lg", className)} />;
}