import { CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import Image from "next/image";
import { safeJoinPaths } from "@/lib/misc.ts";
import GradientText from "@/components/shared/GradientText.tsx";
import React from "react";

type SmallCardInfoProps = {
  className?: string;
  title: string;
  value?: string;
  img: string;
  unoptimized?: boolean;
  count?: number;
  children?: React.ReactNode;
  arrowPath: string;
}
const AchievementInfo = ({
                           className,
                           title,
                           value,
                           img,
                           unoptimized,
                           count,
                           children,
                           arrowPath
                         }: SmallCardInfoProps) => {

  return (
    <CardContent className={cn(className, "h-full w-full pt-6 flex items-center gap-4 justify-between")}>
      <div className="flex flex-row gap-2">
        <div className="relative inline-block">
          <Image src={safeJoinPaths(img)} alt={img}
                 className="h-12 w-12 pixelated mr-2 rounded-md" width={48} height={48}
                 unoptimized={unoptimized || img.includes(".gif") || img.includes(".webp")}/>
          {count &&
            <span className="bottom-0 right-0 pr-2 pb-0 absolute text-xl" style={{ bottom: "-10px" }}>{count}</span>}
        </div>
        <div className="flex flex-col w-fit gap-2">
          <span className="font-semibold">{title}</span>
          <span className="font-bold">{value}</span>
        </div>
      </div>

      <div className={cn("flex gap-2 max-w-64 flex-grow items-center justify-end", arrowPath === "" && "pr-[30px]")}>
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

export default AchievementInfo;
