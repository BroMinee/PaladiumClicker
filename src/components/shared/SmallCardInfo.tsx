import GradientText from "@/components/shared/GradientText.tsx";
import { CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";

type SmallCardInfoProps = {
  className?: string;
  title: string;
  value: string;
  img: string;
}

const SmallCardInfo = ({ className, title, value, img }: SmallCardInfoProps) => {
  return (
    <CardContent className={cn(className, "h-full pt-6 flex items-center gap-4")}>
      <img src={`${import.meta.env.BASE_URL}/${img}`} alt={img}
           className="h-12 w-12 pixelated mr-2 rounded-md"/>
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
