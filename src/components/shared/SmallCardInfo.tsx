import GradientText from "@/components/shared/GradientText.tsx";
import { CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import { safeJoinPaths } from "@/lib/misc.ts";
import Image from "next/image";
import React from "react";

type SmallCardInfoProps = {
  className?: string;
  title: string;
  value?: string;
  img: string;
  unoptimized?: boolean;
  count?: number;
  children?: React.ReactNode;
}

const SmallCardInfo = ({ className, title, value, img, unoptimized, count, children }: SmallCardInfoProps) => {
  return (
    <CardContent className={cn("h-full pt-6 flex items-center gap-4", className)}>
      <div className="relative inline-block">
        <Image src={safeJoinPaths(img)} alt={img}
               className="h-12 w-12 pixelated mr-2 rounded-md" width={48} height={48}
               unoptimized={unoptimized || img.includes(".gif") || img.includes(".webp")}/>
        {count &&
          <span className="bottom-0 right-0 pr-2 pb-0 absolute text-xl" style={{ bottom: "-10px" }}>{count}</span>}
      </div>
      <div className={cn("flex flex-col gap-2 w-52", className)}>
        <span className="font-semibold">{title}</span>
        <div className="flex gap-2 items-center">
          <GradientText className="font-bold w-full">
            {value}
            {children}
          </GradientText>
        </div>
      </div>
    </CardContent>);
}
export default SmallCardInfo;
