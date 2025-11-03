"use client";
import Image from "next/image";
import { safeJoinPaths } from "@/lib/misc.ts";
import { constants } from "@/lib/constants.ts";
import React, { useState } from "react";
import { OptionType } from "@/types";
import { CardContent } from "@/components/ui/card.tsx";
import { GradientText } from "@/components/shared/GradientText\.tsx";

/**
 * Display an item in his crafing slot, clickable element that redirect to the item crafting recipe.
 * @param item - the item to display
 * @param className - Extra className on the <a>
 */
export function DisplayItem({ item, className }: { item: OptionType, className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a href={constants.craftPath + `?item=${item.value}`} className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="flex relative min-w-16 w-16 h-16 items-center justify-center">
        <Image src={safeJoinPaths(constants.imgPathCraft, isHovered ? "selected.png" : "texture.png")} width={0}
          height={0} alt={"selected"}
          unoptimized
          className="h-full w-full pixelated absolute rounded-sm"/>
        <div className="absolute grid justify-center items-center w-16 h-16">
          {
            item.value !== "air" && <Image src={`/AH_img/${item.img}`} alt={item.value}
              className="h-12 w-12 pixelated m-2 rounded-sm hover:scale-125 duration-300"
              width={48} height={48}
              unoptimized={true}/>
          }
        </div>
      </div>

    </a>
  );
}

/**
 * Display and item as well as extract information such as the amount of it required to make a craft.
 * @param item - The item which information will be displayed.
 * @param count - The number of that item required.
 * @param title - A title above
 * @param value - A title display next to the item
 */
export function DisplayItemProduce({ item, title, value, count }: {
  item: OptionType,
  count: number,
  title: string,
  value: string
}) {
  return (
    <CardContent className="h-full p-2 flex items-center gap-4">
      <div className="relative inline-block">
        <DisplayItem item={item}/>
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