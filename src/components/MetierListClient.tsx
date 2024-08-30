'use client';

import { getColorByMetierName, getXpCoef } from "@/lib/misc.ts";
import { MetierKey } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Button } from "@/components/ui/button.tsx";


export function MetierOutline({ metierKey }: { metierKey: MetierKey }) {

  const { data: playerInfo } = usePlayerInfoStore();

  const colors = getColorByMetierName(metierKey);

  let coefXp = 0;
  if (playerInfo) {
    const metier = playerInfo.metier[metierKey];
    coefXp = getXpCoef(metier.level, metier?.xp || 0);
  }


  return <path className="fill" d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
               style={{
                 strokeDashoffset: 2160 * (1 - (coefXp)),
                 stroke: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`,
               }}/>
}

export function MetierDisplayLvl({ metierKey }: { metierKey: MetierKey }) {
  const colors = getColorByMetierName(metierKey);
  const { data: playerInfo } = usePlayerInfoStore();

  return (
    <span
      className="text-white rounded-sm font-bold text-sm flex items-center justify-center h-9 w-9"
      style={{ backgroundColor: `rgb(${colors.bgColor[0]},${colors.bgColor[1]},${colors.bgColor[2]})` }}
    >
      {playerInfo?.metier[metierKey].level}
    </span>)

}

export function MetierDecrease({ minLevel, metierKey }: { minLevel: number, metierKey: MetierKey }) {
  const { decreaseMetierLevel } = usePlayerInfoStore();

  return <Button variant="outline" size="icon"
                 onClick={() => decreaseMetierLevel(metierKey, 1, minLevel)}>
    <FaArrowDown className="h-4 w-4"/>
  </Button>
}

export function MetierIncrease({ metierKey }: { metierKey: MetierKey }) {

  const { increaseMetierLevel } = usePlayerInfoStore();

  return <Button variant="outline" size="icon" onClick={() => increaseMetierLevel(metierKey, 1)}>
    <FaArrowUp className="h-4 w-4"/>
  </Button>
}
