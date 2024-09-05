'use client'

import { RankingType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { generateRankingUrl, getImagePathFromRankingType } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import Image from "next/image";

export function RankingSelectorClient({ rankingType }: {
  rankingType: RankingType,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  let imgPath = getImagePathFromRankingType(rankingType);


  const selected = rankingType === searchParams.get("category");

  return (
    <button
      className={cn("w-16 h-16 hover:scale-125 duration-300 cursor-pointer hover:bg-secondary-foreground p-4 rounded-2xl hover:grayscale-0", !selected ? "grayscale" : "")}
      onClick={() => router.push(generateRankingUrl(rankingType), { scroll: false })}>


      <Image src={imgPath}
             alt={searchParams.get("category") || "unknown"}
             width={64}
             height={64}
             className="object-cover pixelated w-64"
      />
    </button>
  )
}