'use client';
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import GradientText from "@/components/shared/GradientText.tsx";
import { convertEpochToDateUTC2, formatPrice, safeJoinPaths } from "@/lib/misc.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import { FaPercentage } from "react-icons/fa";
import { PaladiumFactionLeaderboard } from "@/types";
import LoadingData from "@/components/LoadingData.tsx";
import { Suspense } from "react";
import constants from "@/lib/constants.ts";

import Image from "next/image";

export function FactionNameInfo() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (playerInfo === null) {
    return null;
  }

  return <>{playerInfo.faction.name}</>;
}

export function FactionInfoDescription() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (playerInfo === null) {
    return null;
  }

  return <>{playerInfo.faction.name}</>;
}

export function FactionInfoMembersInfo() {
  const { data: playerInfo } = usePlayerInfoStore();
  let playerList = playerInfo ? playerInfo.faction.players : [];

  return (
    <>
      <GradientText className="font-bold">
        {formatPrice(playerList?.length)}
      </GradientText>
      Membre{playerList?.length !== undefined && playerList?.length > 1 ? "s" : ""}
    </>);
}

export function FactionDetails() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return <Suspense fallback={<LoadingData username={undefined}/>}/>;
  }

  const createdAt = playerInfo.faction.createdAt;
  const level = playerInfo.faction.level?.level || -1;
  const xp = playerInfo.faction.level?.xp || -1;
  const playerList = playerInfo.faction.players;

  return (
    <>
      <Card>
        <SmallCardInfo title="Niveau - [xp]" value={`${level} - [${formatPrice(xp)}]`}
                       img={safeJoinPaths(constants.imgPathProfile, "ExperienceOrb.webp")} unoptimized/>
      </Card>
      <Card>
        <SmallCardInfo title="Date de création" value={convertEpochToDateUTC2(createdAt)} img={safeJoinPaths(constants.imgPathProfile, "clock.gif")} unoptimized/>
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
                      <Image src={`https://crafatar.com/avatars/${player.uuid}?size=8&overlay`}
                             alt="Icône"
                             width={48} height={48}
                             unoptimized={true}
                             className="object-cover pixelated rounded-md"/>
                      <div className="text-primary font-bold text-center w-36">{player.username}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <FaPercentage className="h-4 w-4 mr-2 inline-block"/>
                        Rôle: {player.group}
                      </div>
                      <div className="text-sm">
                        <Image src={safeJoinPaths(constants.imgPathProfile,"clock.gif")} alt="Icône"
                               width={16} height={16}
                               className="object-cover inline-block pixelated mr-2" unoptimized/>
                        Rejoint le: {convertEpochToDateUTC2(player.joinedAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))
          }
        </div>
        <ScrollBar orientation="horizontal"/>
      </ScrollArea>
    </>);
}

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