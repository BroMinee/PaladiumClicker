import { GradientText } from "@/components/shared/gradient-text";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { safeJoinPaths } from "@/lib/misc";
import Image from "next/image";
import React from "react";

type SmallCardInfoProps = {
  className?: string;
  title: string;
  value?: string;
  img: string;
  unoptimized?: boolean;
  imgClassName?: string;
  count?: number;
  children?: React.ReactNode;
}

/**
 * Displays a compact information card featuring an image, title, and highlighted value.
 * Optionally shows a count badge and supports nested child elements for extra details.
 *
 * @param className - Additional class names for the card layout.
 * @param title - The main label or title displayed beside the image.
 * @param value - The primary numeric or textual value to highlight.
 * @param img - Path or URL of the image to display.
 * @param unoptimized - Whether to disable Next.js image optimization.
 * @param count - Optional badge number displayed on the image.
 * @param children - Optional additional JSX content rendered next to the value.
 * @param imgClassName - Additional class names for customizing the image.
 */
export const SmallCardInfo = ({ className, title, value, img, unoptimized, count, children, imgClassName }: SmallCardInfoProps) => {
  return (
    <CardContent className={cn("h-full pt-6 flex items-center gap-4", className)}>
      <div className="relative inline-block">
        <Image src={safeJoinPaths(img)} alt={img}
          className={cn("h-12 w-12 pixelated mr-2 rounded-md",imgClassName)} width={48} height={48}
          unoptimized={unoptimized ?? img.includes(".webp")}/>
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
};
