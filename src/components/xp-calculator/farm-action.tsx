import { constants, HowToXpElement } from "@/lib/constants";
import { getActionXp, getColorByMetierName, safeJoinPaths } from "@/lib/misc";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { InputDebounce } from "@/components/shared/input-debounce.client";
import { MetierKey } from "@/types";
import { PlatformVersion } from "@/lib/misc/xp-calculator";
import { TrendingDown, TrendingUp } from "lucide-react";

interface FarmActionItemProps {
  item: HowToXpElement;
  metier: MetierKey;
  baseBonusMultiplier: number;
  finalRequiredXp: number;
  totalBonusMultiplier: number;
  fortuneBonus: number;
  platform: PlatformVersion;
  reverseMode?: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

/**
 * Display the number of item, the usage method, the number of XP it gives and the number of item to farm
 */
export const FarmActionItem = ({ item, metier, finalRequiredXp, baseBonusMultiplier, totalBonusMultiplier, fortuneBonus, platform, reverseMode, quantity = 0, onQuantityChange }: FarmActionItemProps) => {
  const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 });
  const xpFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

  const effectiveMultiplier = item.ignorePotionBonus ? baseBonusMultiplier : totalBonusMultiplier;

  const baseXp = getActionXp(item, platform);
  const isFortunable = item.action === constants.SMELT && fortuneBonus !== 0;
  const xpItem = isFortunable ? baseXp * (1 + fortuneBonus) : baseXp;

  const imagePath = safeJoinPaths("AH_img", item.imgPath);

  const displayXpItem = isFinite(xpItem)
    ? formatter.format(xpItem * effectiveMultiplier)
    : "Variable";

  const requiredLevel = item[platform]?.level ?? 1;
  const countInRequirement = item.java?.excludeRequirement !== true;
  const colors = getColorByMetierName(metier);

  const col3 = reverseMode ? (
    <div className="flex flex-col items-center md:items-start justify-center md:pr-10 gap-1">
      <InputDebounce
        label=""
        value={quantity}
        onChange={(qty) => onQuantityChange?.(qty)}
        min={0}
        debounceTimeInMs={300}
        decreaseButton={false}
        increaseButton={false}
        inputClassName="h-9 rounded-lg text-sm"
      />
      {quantity > 0 && isFinite(xpItem) && (
        <span className="text-xs text-green-400">
          +{xpFormatter.format(Math.round(quantity * xpItem * effectiveMultiplier))} XP
        </span>
      )}
      <span className="text-xs text-gray-500 md:hidden">Quantité</span>
    </div>
  ) : (
    <div className="flex flex-col items-center md:items-start justify-center md:pr-10">
      <span className="text-lg font-bold text-yellow-300">
        {item.action === constants.SMELT && fortuneBonus !== 0 && "~ "}{isFinite(xpItem) ? formatter.format(Math.ceil(finalRequiredXp / (xpItem * effectiveMultiplier))) : "Variable"}
      </span>
      <span className="text-xs text-gray-500 md:hidden">Unités à farm</span>
    </div>
  );

  return (
    <div className="relative overflow-hidden grid grid-cols-2 md:grid-cols-[3.5fr_2fr_2fr] gap-4 p-3 bg-background rounded-lg hover:bg-secondary transition-colors border border-gray-800 group">
      <div className={"absolute top-0 right-0 z-10 px-3 py-1.5 rounded-bl-2xl  border-b border-l border-white/10"}
        style={{ backgroundColor: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})` }}
      >
        <span className="text-[10px] font-black uppercase tracking-wider block leading-none text-center">
          Niv {requiredLevel}
        </span>
      </div>

      {platform === "java" && (
        <div className={`absolute bottom-0 right-0 z-10 px-2 py-1 rounded-tl-xl border-t border-l border-white/10 flex items-center gap-1 ${countInRequirement ? "bg-emerald-900/70" : "bg-red-900/70"}`}>
          {countInRequirement
            ? <TrendingUp className="w-3 h-3 text-emerald-400" />
            : <TrendingDown className="w-3 h-3 text-red-400" />
          }
          <span className={`text-[9px] font-bold uppercase tracking-wider leading-none ${countInRequirement ? "text-emerald-400" : "text-red-400"}`}>
            Prérequis
          </span>
        </div>
      )}

      <div className="flex items-center space-x-3 col-span-2 md:col-span-1">
        <UnOptimizedImage
          src={imagePath}
          alt={item.type}
          className="w-10 h-10 rounded-md bg-secondary p-1 object-contain pixelated ring-1 ring-gray-600 group-hover:ring-gray-500 transition-all"
          width={0}
          height={0}
        />
        <div>
          <span className="font-semibold block">{item.type}</span>
          <span className="text-xs text-card-foreground block uppercase tracking-wide opacity-75">{item.action}</span>
        </div>
      </div>

      <div className="flex flex-col items-center md:items-start justify-center">
        <span className="text-lg font-medium ">{isFortunable && "~ "}{displayXpItem}</span>
        <span className="text-xs text-gray-500 md:hidden">XP/unité</span>
      </div>

      {col3}

    </div>
  );
};
