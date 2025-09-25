"use client";

import { generateXpCalculatorUrl, getColorByMetierName, getXpCoef } from "@/lib/misc.ts";
import { MetierKey } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Button } from "@/components/ui/button.tsx";
import { useRouter } from "next/navigation";
import { searchParamsXpBonusPage } from "@/components/Xp-Calculator/XpCalculator.tsx";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import debounce from "debounce";

export function MetierOutline({ metierKey, metierToReach = false }: { metierKey: MetierKey, metierToReach?: boolean }) {

  const { data: playerInfo } = usePlayerInfoStore();

  const colors = getColorByMetierName(metierKey);

  let coefXp = 0;
  if (metierToReach) {
    coefXp = 1;
  } else if (playerInfo) {
    const metier = playerInfo.metier[metierKey];
    coefXp = getXpCoef(metier.level, metier?.xp ?? 0);
  }

  return <path className="fill" d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
    style={{
      strokeDashoffset: 2160 * (1 - (coefXp)),
      stroke: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`,
    }} />;
}

export function MetierDisplayLvl({ metierKey, lvlToReach, searchParams }:
  {
    metierKey: MetierKey,
    lvlToReach?: number,
    searchParams?: searchParamsXpBonusPage | undefined
  }) {
  const colors = getColorByMetierName(metierKey);
  const { data: playerInfo, decreaseMetierLevel, increaseMetierLevel } = usePlayerInfoStore();
  const router = useRouter();
  const [inputValue, setInputValue] = useState(
    lvlToReach ? lvlToReach : playerInfo?.metier[metierKey].level
  );

  useEffect(() => {
    setInputValue(lvlToReach ? lvlToReach : playerInfo?.metier[metierKey].level);
  }, [lvlToReach, playerInfo, metierKey]);

  const debouncedRedirect = useMemo(
    () => {
      return debounce((value: number) => {
        if (lvlToReach === undefined) {
          if (!playerInfo) {
            return;
          }
          value = Math.floor(value);
          value = Math.max(1, value);
          if (value <= playerInfo.metier[metierKey].level) {
            decreaseMetierLevel(metierKey, playerInfo.metier[metierKey].level - value);
          } else if (value > playerInfo.metier[metierKey].level) {
            increaseMetierLevel(metierKey, value - playerInfo.metier[metierKey].level);
          }
        } else {
          if (!playerInfo) {
            return;
          }
          const newLevel = value;
          router.push(
            generateXpCalculatorUrl(
              playerInfo.username ?? "undefined",
              metierKey,
              newLevel,
              searchParams?.double,
              searchParams?.dailyBonus,
              searchParams?.f2,
              searchParams?.f3
            ),
            { scroll: false }
          );
        }
      }, 1000);
    },
    [metierKey, lvlToReach, playerInfo, searchParams, router, decreaseMetierLevel, increaseMetierLevel]
  );

  useEffect(() => {
    return () => {
      debouncedRedirect.clear();
    };
  }, [debouncedRedirect]);

  function onChangeLevel(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    if ((!isNaN(value) && value >= 1) || event.target.value === "") {
      setInputValue(value);
      debouncedRedirect(value);
    }
  }

  return (
    <input
      type="number"
      min="0"
      step="1"
      max="100"
      className="text-white text-center rounded-sm font-bold text-sm flex items-center justify-center h-9 w-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      style={{ backgroundColor: `rgb(${colors.bgColor[0]},${colors.bgColor[1]},${colors.bgColor[2]})` }}
      onChange={onChangeLevel}
      value={Number(inputValue)}
    />
  );
}

export function MetierDecrease({ minLevel, metierKey, searchParams, username }: {
  minLevel: number,
  metierKey: MetierKey,
  searchParams?: searchParamsXpBonusPage | undefined,
  username?: string | undefined
}) {
  const { data: playerInfo, decreaseMetierLevel } = usePlayerInfoStore();

  const router = useRouter();
  if ((searchParams?.level !== undefined && username === undefined) ?? (username !== undefined && searchParams?.level === undefined)) {
    router.push("/error?message=MetierDecrease: searchParams.level and username must be both defined or both undefined but not only one of them.");
  }
  if (searchParams?.level !== undefined && username !== undefined) {
    return <Button variant="outline" size="icon"
      onClick={() => router.push(generateXpCalculatorUrl(username ?? "undefined", metierKey, Math.max((searchParams?.level ?? 1) - 1, (playerInfo?.metier[metierKey].level ?? 1) + 1), searchParams?.double, searchParams?.dailyBonus, searchParams?.f2, searchParams?.f3), { scroll: false })
      }>
      <FaArrowDown className="h-4 w-4" />
    </Button>;
  }

  return <Button variant="outline" size="icon"
    onClick={() => decreaseMetierLevel(metierKey, 1, minLevel)}>
    <FaArrowDown className="h-4 w-4" />
  </Button>;
}

export function MetierIncrease({ metierKey, searchParams, username }: {
  metierKey: MetierKey,
  searchParams?: searchParamsXpBonusPage | undefined,
  username?: string | undefined
}) {

  const { increaseMetierLevel } = usePlayerInfoStore();

  const router = useRouter();
  if ((searchParams?.level !== undefined && username === undefined) ?? (username !== undefined && searchParams?.level === undefined)) {
    router.push("/error?message=MetierIncrease: searchParams.level and username must be both defined or both undefined but not only one of them.");
  }
  if (searchParams?.level !== undefined && username !== undefined) {
    return <Button variant="outline" size="icon"
      onClick={() => router.push(generateXpCalculatorUrl(username ?? "undefined", metierKey, (searchParams?.level ?? 0) + 1, searchParams?.double, searchParams?.dailyBonus, searchParams?.f2, searchParams?.f3), { scroll: false })}>
      <FaArrowUp className="h-4 w-4" />
    </Button>;
  }

  return <Button variant="outline" size="icon" onClick={() => increaseMetierLevel(metierKey, 1)}>
    <FaArrowUp className="h-4 w-4" />
  </Button>;
}
