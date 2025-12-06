import { constants, HowToXpElement } from "@/lib/constants";
import { getColorByMetierName, safeJoinPaths } from "@/lib/misc";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { MetierKey } from "@/types";

interface FarmActionItemProps {
  item: HowToXpElement;
  metier: MetierKey;
  gradeBonus: number;
  finalRequiredXp: number;
  totalBonusMultiplier: number;
  fortuneBonus: number;
  dailyBonusDecimal: number;
}

/**
 * Display the number of item, the usage method, the number of XP it gives and the number of item to farm
 */
export const FarmActionItem = ({ item,metier, finalRequiredXp, gradeBonus, totalBonusMultiplier, fortuneBonus, dailyBonusDecimal }: FarmActionItemProps) => {
  const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 });

  let effectiveMultiplier: number;

  if (item.ignorePotionBonus) {
    effectiveMultiplier = 1 + gradeBonus + dailyBonusDecimal;
  } else {
    effectiveMultiplier = totalBonusMultiplier;
  }

  const isFortunable = item.action === constants.SMELT && fortuneBonus !== 0;
  const xpItem = isFortunable ? item.xp * (1 + fortuneBonus) : item.xp;
  const unitsToFarm = finalRequiredXp / (xpItem * effectiveMultiplier);

  const imagePath = safeJoinPaths("AH_img", item.imgPath);

  const displayXpItem = isFinite(xpItem)
    ? formatter.format(xpItem)
    : "Variable";

  const displayUnits = isFinite(xpItem)
    ? formatter.format(Math.ceil(unitsToFarm))
    : "Variable";

  const requiredLevel = item.level ?? 1;

  const colors = getColorByMetierName(metier);

  return (
    <div className="relative overflow-hidden grid grid-cols-2 md:grid-cols-[3.5fr_2fr_2fr] gap-4 p-3 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors border border-gray-800 group">
      <div className={"absolute top-0 right-0 z-10 px-3 py-1.5 rounded-bl-2xl text-white shadow-lg border-b border-l border-white/10"}
        style={{ backgroundColor: `rgb(${colors.bgColor[0]},${colors.bgColor[1]},${colors.bgColor[2]})` }}
      >
        <span className="text-[10px] font-black uppercase tracking-wider block leading-none text-center">
          Niv {requiredLevel}
        </span>
      </div>

      <div className="flex items-center space-x-3 col-span-2 md:col-span-1">
        <UnOptimizedImage
          src={imagePath}
          alt={item.type}
          className="w-10 h-10 rounded-md bg-gray-700 p-1 object-contain pixalated ring-1 ring-gray-600 group-hover:ring-gray-500 transition-all"
          width={0}
          height={0}
        />
        <div>
          <span className="font-semibold text-gray-200 block">{item.type}</span>
          <span className="text-xs text-gray-400 block uppercase tracking-wide opacity-75">{item.action}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <span className="text-lg font-medium text-white">{isFortunable && "~ "}{displayXpItem}</span>
        <span className="text-xs text-gray-500 md:hidden">XP/unité</span>
      </div>

      <div className="flex flex-col justify-center md:pr-10">
        <span className="text-lg font-bold text-yellow-300">
          {item.action === constants.SMELT && fortuneBonus !== 0 && "~ "}{displayUnits}
        </span>
        <span className="text-xs text-gray-500 md:hidden">Unités à farm</span>
      </div>

    </div>
  );
};