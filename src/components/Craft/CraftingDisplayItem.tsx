'use client';
import Image from "next/image";
import { safeJoinPaths } from "@/lib/misc.ts";
import constants from "@/lib/constants.ts";
import React, { useState } from "react";
import { OptionType } from "@/types";
import { CardContent } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";

export function DisplayItem({ slot, className }: { slot: OptionType, className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a href={constants.craftPath + `?item=${slot.value}`} className={className}
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}>
      <div className="flex relative min-w-16 w-16 h-16 items-center justify-center">
        <Image src={safeJoinPaths(constants.imgPathCraft, isHovered ? "selected.png" : "texture.png")} width={0}
               height={0} alt={"selected"}
               unoptimized
               className="h-full w-full pixelated absolute rounded-sm"/>
        <div className="absolute grid justify-center items-center w-16 h-16">
          {
            slot.value !== 'air' && <Image src={`/AH_img/${slot.img}`} alt={slot.value}
                                           className="h-12 w-12 pixelated m-2 rounded-sm hover:scale-125 duration-300"
                                           width={48} height={48}
                                           unoptimized={true}/>
          }
        </div>
      </div>

    </a>
  );
}

export function DisplayItemProduce({ slot, title, value, count }: {
  slot: OptionType,
  count: number,
  title: string,
  value: string
}) {
  return (
    <CardContent className="h-full p-2 flex items-center gap-4">
      <div className="relative inline-block">
        <DisplayItem slot={slot}/>
        <span className="bottom-0 right-0 pr-2 pb-0 absolute text-xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{count}</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-semibold">{title}</span>
        <div className="flex gap-2 items-center">
          <GradientText className="font-bold w-full">
            {value}
          </GradientText>
        </div>
      </div>
    </CardContent>);
}