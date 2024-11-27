import { CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import Image from "next/image";
import { safeJoinPaths } from "@/lib/misc.ts";
import GradientText from "@/components/shared/GradientText.tsx";
import React from "react";

type AchievementInfoProps = {
  title: string;
  value?: string;
  img: string;
  unoptimized?: boolean;
  children?: React.ReactNode;
  arrowPath: string;
}
export const AchievementInfo = ({
                           title,
                           value,
                           img,
                           unoptimized,
                           children,
                           arrowPath
                                }: AchievementInfoProps) => {

  return (
    <CardContent className="h-full w-full p-2 flex items-center gap-4 justify-between">
      <div className="flex flex-row gap-2 items-center">
          <Image src={safeJoinPaths(img)} alt={img}
                 className="h-12 w-12 pixelated mr-2 rounded-md" width={48} height={48}
                 unoptimized={unoptimized || img.includes(".gif") || img.includes(".webp")}/>
        <div className="flex flex-col w-fit gap-2">
          <span className="font-semibold">{title}</span>
          <span className="font-bold">{value}</span>
        </div>
      </div>

      <div className={cn("flex gap-2 flex-grow max-w-full items-center justify-end", arrowPath === "" && "pr-[30px]")}>
        <GradientText className="font-bold w-full">
          {children}
        </GradientText>
        {arrowPath !== "" &&
          <Image src={arrowPath} alt="arrow" className="h-6 w-6 pixelated" width={24} height={24}
                 unoptimized={unoptimized || img.includes(".gif") || img.includes(".webp")}/>
        }
      </div>
    </CardContent>);
}


type DisplayCategoryCardProps = {
  title: string;
  value?: string;
  img: string;
  unoptimized?: boolean;
  children?: React.ReactNode;
}

export const DisplayCategoryCard = ({ title, value, img, unoptimized, children }: DisplayCategoryCardProps) => {
  return (
    <CardContent className="h-full p-2 flex items-center gap-4">
      <Image src={safeJoinPaths(img)} alt={img}
             className="h-12 w-12 pixelated mr-2 rounded-md" width={48} height={48}
             unoptimized={unoptimized || img.includes(".gif") || img.includes(".webp")}/>
      <div className="flex flex-col gap-2 w-52 items-start justify-center">
        <span className="font-semibold">{title.toUpperCase()}</span>
        <GradientText className="font-bold w-full">
          {value}
          {children}
        </GradientText>
      </div>
    </CardContent>);
}