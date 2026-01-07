"use client";

import { constants } from "@/lib/constants";
import { Button } from "@/components/ui/button-v2";

interface FortuneSelectorProps {
  fortuneBonus: number;
  setFortuneBonus: (bonus: number) => void;
}

const FORTUNE_OPTIONS = [
  { label: "Pas de Fortune", multiplier: 0, percent: "" },
  { label: "Fortune II", multiplier: constants.FORTUNE_II_BONUS, percent: "+50%" },
  { label: "Fortune III", multiplier: constants.FORTUNE_III_BONUS, percent: "+65%" },
];

/**
 * Fortune selector
 */
export const FortuneSelector = ({ fortuneBonus, setFortuneBonus }: FortuneSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium ">Bonus de Minage (Fortune)</label>
      <div className="flex space-x-2">
        {FORTUNE_OPTIONS.map(({ label, multiplier, percent }) => (
          <Button
            key={multiplier}
            onClick={() => setFortuneBonus(multiplier)}
            className={`inline flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-normal
                ${fortuneBonus === multiplier
              ? "   bg-green-400/50 hover:bg-green-500/50 border border-[#26E251]"
              : "bg-secondary hover:bg-gray-600"
          }`}
            title={label}
          >
            {label} <span className="text-xs font-normal opacity-80">{percent}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};