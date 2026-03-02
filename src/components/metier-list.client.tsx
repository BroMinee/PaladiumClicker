"use client";

import { generateXpCalculatorUrl, getColorByMetierName, JobXp } from "@/lib/misc";
import { MetierKey, searchParamsXpBonusPage } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";
import { useXpCalcStore } from "@/stores/use-xp-calc-store";

/**
 * Display an svg outline representing the player current level progression.
 * @param metierKey - The job key used to to display corresponding data
 * @param metierToReach - boolean, if true then the SVG outline is fully filled
 * @deprecated shouldn't be used elsewhere from twitch layout and xp-calculator
 */
export function MetierOutline({ metierKey, metierToReach = false, metierData }: {
  metierKey: MetierKey,
  metierToReach?: boolean,
  metierData?: { level: number; xp: number },
}) {
  const { data: playerInfo } = usePlayerInfoStore();
  const { platform } = useXpCalcStore();

  const colors = getColorByMetierName(metierKey);

  let coefXp = 0;
  if (metierToReach) {
    coefXp = 1;
  } else if (metierData) {
    coefXp = JobXp.xpCoef(metierData.level, metierData.xp, platform);
  } else if (playerInfo) {
    const metier = playerInfo.metier[metierKey];
    coefXp = JobXp.xpCoef(metier.level, metier?.xp ?? 0, platform);
  }

  return <path className="fill" d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
    style={{
      strokeDashoffset: 2160 * (1 - (coefXp)),
      stroke: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`,
    }} />;
}

/**
 * Component that display the current level using an input.
 * @param metierKey- The job key used to to display corresponding data
 * @param lvlToReach - I don't remember that that does but it seem important :)
 * @param searchParams - SearchParams
 * @param twitch - Whether to display the UI in Twitch mode (affects level display styling or behavior).
 * @deprecated shouldn't be used elsewhere from twitch layout
 */
export function MetierDisplayLvl({ metierKey, lvlToReach, searchParams, twitch = false, overrideLevel }:
{
  metierKey: MetierKey,
  lvlToReach?: number,
  searchParams?: searchParamsXpBonusPage | undefined
  twitch?: boolean
  /** When provided, renders a read-only level badge using this value (XP calc store context). */
  overrideLevel?: number,
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

  function onChangeLevel(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    if ((!isNaN(value) && value >= 1) || event.target.value === "") {
      setInputValue(value);
      debouncedRedirect(value);
    }
  }

  const bgStyle = {
    backgroundColor: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`,
    boxShadow: twitch ? `0 0 15px 5px rgba(${colors.color[0]},${colors.color[1]},${colors.color[2]},0.75)` : undefined,
  };

  if (overrideLevel !== undefined) {
    return (
      <span
        className={cn("text-center rounded-sm font-bold text-sm flex items-center justify-center -translate-y-5 z-[3] h-4 w-4", twitch && "w-16 h-16 text-5xl rounded-xl -translate-y-16 z-[3] text-black")}
        style={bgStyle}
      >
        {overrideLevel}
      </span>
    );
  }

  return (
    <input
      type="number"
      min="0"
      step="1"
      max="100"
      className={cn(" text-center rounded-sm font-bold text-sm flex items-center justify-center -translate-y-5 z-[3]  h-4 w-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", twitch && "w-16 h-16 text-5xl rounded-xl -translate-y-16 z-[3] text-black")}
      style={bgStyle}
      onChange={onChangeLevel}
      value={Number(inputValue)}
    />
  );
}
