'use client';

import { generateXpCalculatorUrl, getColorByMetierName, getXpCoef } from "@/lib/misc.ts";
import { MetierKey } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Button } from "@/components/ui/button.tsx";
import { useRouter } from "next/navigation";
import { searchParamsXpBonusPage } from "@/components/Xp-Calculator/XpCalculator.tsx";

export function MetierOutline({ metierKey, metierToReach = false }: { metierKey: MetierKey, metierToReach?: boolean }) {

  const { data: playerInfo } = usePlayerInfoStore();

  const colors = getColorByMetierName(metierKey);

  let coefXp = 0;
  if (metierToReach) {
    coefXp = 1;
  } else if (playerInfo) {
    const metier = playerInfo.metier[metierKey];
    coefXp = getXpCoef(metier.level, metier?.xp || 0);
  }


  return <path className="fill" d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
               style={{
                 strokeDashoffset: 2160 * (1 - (coefXp)),
                 stroke: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`,
               }}/>
}

export function MetierDisplayLvl({ metierKey, lvlToReach }: { metierKey: MetierKey, lvlToReach?: number }) {
  const colors = getColorByMetierName(metierKey);
  const { data: playerInfo } = usePlayerInfoStore();

  return (
    <span
      className="text-white rounded-sm font-bold text-sm flex items-center justify-center h-9 w-9"
      style={{ backgroundColor: `rgb(${colors.bgColor[0]},${colors.bgColor[1]},${colors.bgColor[2]})` }}
    >
      {lvlToReach ? lvlToReach : playerInfo?.metier[metierKey].level}
    </span>)

}

export function MetierDecrease({ minLevel, metierKey, searchParams, username }: {
  minLevel: number,
  metierKey: MetierKey,
  searchParams?: searchParamsXpBonusPage | undefined,
  username?: string | undefined
}) {
  const { data: playerInfo, decreaseMetierLevel } = usePlayerInfoStore();

  const router = useRouter();
  if ((searchParams?.level !== undefined && username === undefined) || (username !== undefined && searchParams?.level === undefined))
    router.push(`/error?message=MetierDecrease: searchParams.level and username must be both defined or both undefined but not only one of them.`)
  if (searchParams?.level !== undefined && username !== undefined)
    return <Button variant="outline" size="icon"
                   onClick={() => router.push(generateXpCalculatorUrl(username || "undefined", metierKey, Math.max((searchParams?.level || 1) - 1, (playerInfo?.metier[metierKey].level || 1) + 1), searchParams?.double, searchParams?.dailyBonus), { scroll: false })
                   }>
      <FaArrowDown className="h-4 w-4"/>
    </Button>

  return <Button variant="outline" size="icon"
                 onClick={() => decreaseMetierLevel(metierKey, 1, minLevel)}>
    <FaArrowDown className="h-4 w-4"/>
  </Button>
}

export function MetierIncrease({ metierKey, searchParams, username }: {
  metierKey: MetierKey,
  searchParams?: searchParamsXpBonusPage | undefined,
  username?: string | undefined
}) {

  const { increaseMetierLevel } = usePlayerInfoStore();

  const router = useRouter();
  if ((searchParams?.level !== undefined && username === undefined) || (username !== undefined && searchParams?.level === undefined))
    router.push(`/error?message=MetierIncrease: searchParams.level and username must be both defined or both undefined but not only one of them.`)
  if (searchParams?.level !== undefined && username !== undefined)
    return <Button variant="outline" size="icon"
                   onClick={() => router.push(generateXpCalculatorUrl(username || "undefined", metierKey, Math.min((searchParams?.level || 0) + 1, 100), searchParams?.double, searchParams?.dailyBonus), { scroll: false })}>
      <FaArrowUp className="h-4 w-4"/>
    </Button>

  return <Button variant="outline" size="icon" onClick={() => increaseMetierLevel(metierKey, 1)}>
    <FaArrowUp className="h-4 w-4"/>
  </Button>
}
