import GradientText from "@/components/shared/GradientText.tsx";
import { CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import { safeJoinPaths } from "@/lib/misc.ts";
import Image from "next/image";

type SmallCardInfoProps = {
  className?: string;
  title: string;
  value: string;
  img: string;
  unoptimized?: boolean;
}

const SmallCardInfo = ({ className, title, value, img, unoptimized }: SmallCardInfoProps) => {
  return (
    <CardContent className={cn(className, "h-full pt-6 flex items-center gap-4")}>
      <Image src={safeJoinPaths(img)} alt={img}
             className="h-12 w-12 pixelated mr-2 rounded-md" width={48} height={48}
             unoptimized={unoptimized || img.includes(".gif") || img.includes(".webp")}
      />
      <div className="flex flex-col gap-2">
        <span className="font-semibold">{title}</span>
        <div className="flex gap-2 items-center">
          <GradientText className="font-bold">
            {value}
          </GradientText>
        </div>
      </div>
    </CardContent>
  )
}

export default SmallCardInfo;
