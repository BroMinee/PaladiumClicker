"use client";

import { constants } from "@/lib/constants";
import { safeJoinPaths } from "@/lib/misc";
import { ToggleCardButton } from "@/components/shared/toggle-button.client";
import { UnOptimizedImage } from "@/components/ui/image-loading";

interface PotionSelectorProps {
  activePotionBonus: number;
  setActivePotionBonus: (bonus: number) => void;
}

const POTION_OPTIONS = [
  { label: "Aucune", bonus: 0, imgPath: "placeholder.webp", bonusPercent: "0%" },
  { label: "Potion Double XP", bonus: constants.POTION_DOUBLE_BONUS, imgPath: "PotionDoubleXp.webp", bonusPercent: "+100%" },
  { label: "Potion x10 XP", bonus: constants.POTION_X10_BONUS, imgPath: "potion_job_x10.webp", bonusPercent: "+900%" },
];

/**
 * Potion XP selector
 */
export const PotionSelector = ({
  activePotionBonus,
  setActivePotionBonus
}: PotionSelectorProps) => {
  const togglePotion = (bonus: number) => {
    const newBonus = activePotionBonus === bonus ? 0 : bonus;
    setActivePotionBonus(newBonus);
  };

  const PotionButton = ({ active, onClick, imgPath, label, bonusPercent }: {
    active: boolean,
    onClick: () => void,
    imgPath: string,
    label: string,
    bonusPercent: string
  }) => {
    const fullPath = safeJoinPaths("AH_img", imgPath);

    return (
      <ToggleCardButton
        onToggle={() => onClick()}
        className={"flex flex-col p-3 rounded-xl transition-all duration-200 w-1/2"} isToggled={active}>
        <UnOptimizedImage
          src={fullPath}
          alt={label}
          className="w-10 h-10 object-contain pixelated" width={0} height={0} />
        <span className="text-xs font-semibold mt-1 text-center ">{label}</span>
        <span className={`text-xs ${active ? "text-green-300" : "text-card-foreground"}`}>{bonusPercent}</span>
      </ToggleCardButton>
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium ">Potions d&apos;XP actives</label>
      <div className="flex space-x-4">
        {POTION_OPTIONS.filter(p => p.bonus !== 0).map((potion) => (
          <PotionButton
            key={potion.bonus}
            active={activePotionBonus === potion.bonus}
            onClick={() => togglePotion(potion.bonus)}
            imgPath={potion.imgPath}
            label={potion.label}
            bonusPercent={potion.bonusPercent}
          />
        ))}
      </div>
    </div>
  );
};