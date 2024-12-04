'use client'

import { ProfilSectionEnum, RankingType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import {
  generateProfilUrl,
  generateRankingUrl,
  getImagePathFromRankingType,
  rankingTypeToUserFriendlyText
} from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import Image from "next/image";
import React, { ReactNode } from "react";
import HoverText from "@/components/ui/hovertext.tsx";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";

export function RankingSelectorClient({ rankingType, rankingPage }: {
  rankingType: RankingType,
  rankingPage: boolean
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  let imgPath = getImagePathFromRankingType(rankingType);
  const { data: playerInfo } = usePlayerInfoStore();


  const selected = rankingType === (searchParams.get("category") || RankingType.money);

  const hoverElement: ReactNode = (
    <div className="bg-primary rounded-md p-2 font-bold">{rankingTypeToUserFriendlyText(rankingType)}</div>
  );

  return (
    <>
      <HoverText text={hoverElement}>
        <button
          className={cn("w-16 h-16 hover:scale-125 duration-300 cursor-pointer hover:bg-secondary-foreground p-4 rounded-2xl hover:grayscale-0", !selected ? "grayscale" : "")}
          onClick={() => router.push(rankingPage ? generateRankingUrl(rankingType) : generateProfilUrl(playerInfo?.username || "undefined", ProfilSectionEnum.Classement, rankingType), { scroll: false })}
        >
          <Image src={imgPath}
                 alt={searchParams.get("category") || "unknown"}
                 width={64}
                 height={64}
                 unoptimized={true}
                 className="object-cover pixelated w-64"
          />
        </button>
      </HoverText>
    </>
  )
}