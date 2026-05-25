"use client";

import { constants } from "@/lib/constants";
import { safeJoinPaths } from "@/lib/misc";
import { ToggleCardButton } from "@/components/shared/toggle-button.client";
import { UnOptimizedImage } from "@/components/ui/image-loading";

interface PotionSelectorProps {
  doubleActive: boolean;
  x10Active: boolean;
  setDoubleActive: (v: boolean) => void;
  setX10Active: (v: boolean) => void;
}

const POTION_OPTIONS = [
  { label: "Aucune", bonus: 0, imgPath: "placeholder.webp", bonusPercent: "0%" },
  { label: "Potion Double XP", bonus: constants.POTION_DOUBLE_BONUS, imgPath: "PotionDoubleXp.webp", bonusPercent: "+100%" },
  { label: "Potion x10 XP", bonus: constants.POTION_X10_BONUS, imgPath: "potion_job_x10.webp", bonusPercent: "x10" },
];

const PotionButton = ({ active, onToggle, imgPath, label, bonusPercent }: {
  active: boolean,
  onToggle: () => void,
  imgPath: string,
  label: string,
  bonusPercent: string
}) => {
  const fullPath = safeJoinPaths("AH_img", imgPath);

  return (
    <ToggleCardButton
      onToggle={onToggle}
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

/**
 * Potion XP selector
 */
export const PotionSelector = ({
  doubleActive,
  x10Active,
  setDoubleActive,
  setX10Active,
}: PotionSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium ">Potions d&apos;XP actives</label>
      <div className="flex space-x-4">
        <PotionButton
          active={doubleActive}
          onToggle={() => setDoubleActive(!doubleActive)}
          imgPath={POTION_OPTIONS[1].imgPath}
          label={POTION_OPTIONS[1].label}
          bonusPercent={POTION_OPTIONS[1].bonusPercent}
        />
        <PotionButton
          active={x10Active}
          onToggle={() => setX10Active(!x10Active)}
          imgPath={POTION_OPTIONS[2].imgPath}
          label={POTION_OPTIONS[2].label}
          bonusPercent={POTION_OPTIONS[2].bonusPercent}
        />
      </div>
    </div>
  );
};