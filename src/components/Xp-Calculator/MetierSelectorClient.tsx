"use client";
import { formatPrice, generateXpCalculatorUrl, getColorByMetierName, getXpDiff, safeJoinPaths } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import { MetierKey, PlayerRank } from "@/types";
import { useRouter } from "next/navigation";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import metierJson from "@/assets/metier.json";
import Image from "next/image";
import { MetierDecrease, MetierDisplayLvl, MetierIncrease, MetierOutline } from "@/components/MetierListClient.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { searchParamsXpBonusPage } from "@/components/Xp-Calculator/XpCalculator.tsx";
import { constants,  HowToXpElement } from "@/lib/constants.ts";
import { GradientText } from "@/components/shared/GradientText.tsx";
import { useEffect } from "react";

/**
 * Updates the URL to reflect the next level for a selected jobs.
 * TODO: This shouldn't be a component maybe
 *
 * @param selected The selected MetierKey
 * @param params Route params, must include username
 * @param searchParams Current search parameters
 */
export function SetLevelInUrl({ selected, params, searchParams }: {
  selected: MetierKey,
  params: { username: string },
  searchParams: searchParamsXpBonusPage
}) {
  const router = useRouter();
  const { data: playerInfo } = usePlayerInfoStore();
  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    let levelToReach = 0;
    if (searchParams?.level !== undefined) {
      levelToReach = Math.max(playerInfo.metier[selected].level + 1, searchParams.level);
    } else {
      levelToReach = playerInfo.metier[selected].level + 1;
    }

    if(searchParams.metier === selected && searchParams.level === levelToReach
      && ((searchParams.double === true) === (searchParams.double === true))
      && ((searchParams.f2 === true) === (searchParams.f2 === true))
      && ((searchParams.f3 === true) === (searchParams.f3 === true))
      && ((Number(searchParams.dailyBonus ?? 0)) === (Number(searchParams.dailyBonus ?? 0)))
    ) {
      return;
    }

    router.push(generateXpCalculatorUrl(params.username, selected, levelToReach, searchParams.double, searchParams.dailyBonus, searchParams.f2, searchParams.f3), { scroll: false });

  }, [playerInfo, searchParams, selected, params.username, router]);

  if (!playerInfo) {
    return;
  }

  return null;
}

/**
 * Renders an icon for a specific job and allows selecting it.
 * Clicking the icon navigates to the XP calculator page for the chosen job.
 *
 * @param username The username of the player
 * @param metier The job key (e.g., "miner", "farmer", etc.)
 * @param selected Whether this job is currently selected
 * @param searchParams Current search parameters for XP calculation (e.g., double, dailyBonus, f2, f3)
 */
export function MetierSelectorClient({ username, metier, selected, searchParams }: {
  username: string,
  metier: MetierKey,
  selected: boolean,
  searchParams: searchParamsXpBonusPage
}) {
  const router = useRouter();
  let imgPath = "";
  switch (metier) {
  case "miner":
    imgPath = "Mineur";
    break;
  case "farmer":
    imgPath = "Fermier";
    break;
  case "hunter":
    imgPath = "Chasseur";
    break;
  case "alchemist":
    imgPath = "Alchimiste";
    break;
  }
  return (
    <Image src={safeJoinPaths(constants.imgPathProfile, "/JobsIcon/", `${imgPath}.webp`)}
      width={144} height={144}
      alt={metier}
      className={cn("object-cover pixelated hover:scale-105 duration-300 cursor-pointer",
        !selected ? "grayscale" : "")}
      onClick={() => router.push(generateXpCalculatorUrl(username, metier, undefined, searchParams.double, searchParams.dailyBonus, searchParams.f2, searchParams.f3), { scroll: false })}
      unoptimized
    />
  );
}

type MetierProps = {
  minLevel?: number;
  metierKey: MetierKey;
  searchParams: searchParamsXpBonusPage;
};

/**
 * Displays a job image with a progress bar and level controls inside an SVG.
 * Includes buttons to increase or decrease the target level and shows the current level to reach.
 *
 * @param metierKey The key of the job
 * @param searchParams Current search parameters containing the target level
 */
export const MetierToReachWrapper = ({
  metierKey,
  searchParams,
}: MetierProps) => {

  const metierName = structuredClone(metierJson[metierKey].name as MetierKey);

  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo || searchParams.level === undefined) {
    return;
  }

  const minLevel = Math.min(playerInfo.metier[metierKey].level + 1, 100);
  return (
    <>
      <div className="relative">
        <Image src={safeJoinPaths(constants.imgPathProfile, "/JobsIcon/", `${metierName}.webp`)} alt="image"
          unoptimized
          style={{ position: "inherit", zIndex: 2 }} width={256} height={256} />
        <div className="progress-bar">
          {/* BroMine.... Please, never touch this code again. It works !*/}
          {/* 30/08/2024 I have touched it o_O */}
          <svg className="progress blue noselect" x="0px" y="0px" viewBox="0 0 776 628">
            <path className="track"
              d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"></path>
            <MetierOutline metierKey={metierKey} metierToReach={true} />
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <MetierDecrease minLevel={minLevel} metierKey={metierKey} searchParams={searchParams}
          username={playerInfo.username} />
        <MetierDisplayLvl metierKey={metierKey} lvlToReach={searchParams.level} searchParams={searchParams} />
        <MetierIncrease metierKey={metierKey} searchParams={searchParams} username={playerInfo.username} />
      </div>
    </>
  );
};

/**
 * Button to toggle double XP.
 * Updates the URL with double XP enabled or disabled depending on the current state.
 *
 * @param params Object containing the username
 * @param searchParams Current search parameters of the page
 * @param doubleXp Current double XP state (0 or 100)
 * @param children Children inside the button
 */
export function ButtonTakeDoubleXp({ params, searchParams, doubleXp, children }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage,
  doubleXp: number,
  children: React.ReactNode
}) {
  const router = useRouter();

  return <Button className={doubleXp === 100 ? "bg-red-500" : "bg-green-500"}
    onClick={() => {
      if (doubleXp === 0) {
        router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, true, searchParams.dailyBonus, searchParams.f2, searchParams.f3), { scroll: false });
      } else {
        router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, false, searchParams.dailyBonus, searchParams.f2, searchParams.f3), { scroll: false });
      }
    }}
  >
    {children}
  </Button>;
}

/**
 * Button to toggle Fortune 2 usage.
 * Updates the URL with F2 enabled or disabled depending on the current state.
 *
 * @param params Object containing the username
 * @param searchParams Current search parameters of the page
 * @param F2 Boolean. Current Fortune 2 state
 * @param children Children inside the button
 */
export function ButtonUseF2({ params, searchParams, F2, children }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage,
  F2: boolean,
  children: React.ReactNode
}) {
  const router = useRouter();

  return <Button className={F2 ? "bg-red-500" : "bg-green-500"}
    onClick={() => {
      if (F2 === false) {
        router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, searchParams.double, searchParams.dailyBonus, true, undefined), { scroll: false });
      } else {
        router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, searchParams.double, searchParams.dailyBonus, false, undefined), { scroll: false });
      }
    }}
  >
    {children}
  </Button>;
}

/**
 * Button to toggle Fortune 3 usage.
 * Updates the URL with F3 enabled or disabled depending on the current state.
 *
 * @param params Object containing the username
 * @param searchParams Current search parameters of the page
 * @param F3 Boolean. Current Fortune 3 state
 * @param children Children inside the button
 */
export function ButtonUseF3({ params, searchParams, F3, children }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage,
  F3: boolean,
  children: React.ReactNode
}) {
  const router = useRouter();

  return <Button className={F3 ? "bg-red-500" : "bg-green-500"}
    onClick={() => {
      if (F3 === false) {
        router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, searchParams.double, searchParams.dailyBonus, searchParams.f2, true), { scroll: false });
      } else {
        router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, searchParams.double, searchParams.dailyBonus, searchParams.f2, false), { scroll: false });
      }
    }}
  >
    {children}
  </Button>;
}

/**
 * Input field to set the daily bonus percentage for a specific job.
 * Updates the URL when the value changes.
 *
 * @param params Object containing the username
 * @param searchParams Current search parameters of the page
 */
export function InputDailyBonus({ params, searchParams }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage,
}) {
  const router = useRouter();
  return <Input className="w-auto" type="number" min="0" step="0.1" max="99"
    value={Number(searchParams.dailyBonus ?? 0)}
    onChange={(e) => {
      router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, searchParams.double, Number(e.target.value), searchParams.f2, searchParams.f3), { scroll: false });
    }
    } />;
}

function getBonusRank(playerRank: PlayerRank | undefined) {
  if (!playerRank) {
    return 0;
  }

  switch (playerRank) {
  case "titan":
  case "heros":
    return 5;
  case "paladin":
  case "legend":
    return 10;
  case "endium":
  case "trixium":
  case "trixium+":
  case "divinity":
  case "rusher":
    return 15;
  case "premium": // premium add 5% (don't know how it's represented in the API) always place the condition at the end
    return 5;
  default:
    return 0;
  }

}

/**
 * Displays the total XP bonus percentage for the player.
 * It sums daily bonus, double XP, rank bonus, and seasonal bonus.
 *
 * @param dailyBonus The daily bonus percentage
 * @param doubleXp The double XP bonus percentage
 */
export function DisplayDailyDoubleRank({ dailyBonus, doubleXp }: { dailyBonus: number, doubleXp: number }) {
  const { data: playerInfo } = usePlayerInfoStore();

  const bonusXpRank = getBonusRank(playerInfo?.rank);
  const bonusSummerRush = 300;
  return <>{dailyBonus + doubleXp + bonusXpRank + bonusSummerRush}%</>;
}

/**
 * Display the bonus xp given by the rank
 */
export function DisplayXpBonus() {
  const { data: playerInfo } = usePlayerInfoStore();

  const bonusXpRank = getBonusRank(playerInfo?.rank);
  return <>{bonusXpRank}%</>;
}

/**
 * Display the total xp needed to reach the targeted level
 * @param searchParams Current search parameters of the page
 */
export function DisplayXpNeeded({ searchParams }: { searchParams: searchParamsXpBonusPage }) {
  const { data: playerInfo } = usePlayerInfoStore();
  const xpNeeded = getXpDiff(playerInfo, searchParams);
  return <>{formatPrice(Math.ceil(xpNeeded))} xp</>;
}

/**
 * Displays a single item with its image, action, XP needed, type, and level if higher than the player's current level.
 *
 * @param searchParams Current search parameters of the page
 * @param item The item data to display, including image, action, XP, type, and level
 * @param index The index of the item in the list (used as key)
 */
export function DisplayItem({ searchParams, item, index }: { searchParams: searchParamsXpBonusPage, item: HowToXpElement, index: number }) {

  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo || !playerInfo?.metier || searchParams.level === undefined || !searchParams.metier) {
    return null;
  }

  const colors = getColorByMetierName(searchParams.metier as MetierKey);

  return (
    <div key={index} className="relative flex flex-row items-center gap-4">
      {item.level !== undefined && item.level > playerInfo.metier[searchParams.metier as MetierKey].level && (
        <div className={cn("absolute top-0 right-0 text-xs font-bold bg-white bg-opacity-80 px-2 py-0.5 rounded-bl", searchParams.metier === "farmer" ? "text-black" : "")}
          style={{ backgroundColor: `rgb(${colors.bgColor[0]},${colors.bgColor[1]},${colors.bgColor[2]})` }}>
          niv {item.level}
        </div>
      )}
      <Image src={safeJoinPaths(`/AH_img/${item.imgPath}`)}
        alt={item.imgPath}
        width={64} height={64}
        unoptimized={true}
        className="object-cover pixelated" />
      <div className="flex flex-col">
        <span className="font-semibold">
          {item.action}
        </span>
        <GradientText className="font-bold">
          <DisplayXpNeededWithDouble searchParams={searchParams} xp={item.xp} element={item} />
        </GradientText>
        <span className="font-semibold">{item.type}</span>
      </div>
    </div>);
}

function DisplayXpNeededWithDouble({ searchParams, xp, element }: {
  searchParams: searchParamsXpBonusPage,
  xp: number,
  element: HowToXpElement
}) {
  const { data: playerInfo } = usePlayerInfoStore();
  const xpNeeded = getXpDiff(playerInfo, searchParams);

  let fortuneBonus = searchParams.f2 ? 1.5 : 1;
  fortuneBonus = searchParams.f3 ? 1.65 : fortuneBonus;
  if (searchParams.metier !== "miner" || element.action !== constants.SMELT) {
    fortuneBonus = 1;
  }

  const bonusXpRank = getBonusRank(playerInfo?.rank);
  const bonusSummerRush = 300;
  const bonusXpWithoutDouble = bonusSummerRush + bonusXpRank + (searchParams.dailyBonus ?? 0);
  const bonusXpDouble = bonusXpWithoutDouble + (searchParams.double ? 100 : 0);
  const xpNeededWithDoubleXP = (xpNeeded / fortuneBonus) / ((100 + bonusXpDouble) / 100);

  return <>{fortuneBonus !== 1 && "~ "}{formatPrice(Math.ceil(xpNeededWithDoubleXP / xp))} fois</>;
}

/**
 * Calculates and displays the number of 1000 xp bottle needed to reach the target XP,
 * taking into account the player's rank bonus, summer rush bonus, and daily bonus, but excluding double XP,
 * since job bottle are not affected by double XP potion.
 *
 * @param searchParams Current search parameters of the page
 */
export function DisplayXpNeededWithBottle({ searchParams }: { searchParams: searchParamsXpBonusPage }) {
  const { data: playerInfo } = usePlayerInfoStore();
  const xpNeeded = getXpDiff(playerInfo, searchParams);

  const bonusXpRank = getBonusRank(playerInfo?.rank);
  const bonusSummerRush = 300;
  const bonusXpWithoutDouble = bonusSummerRush + bonusXpRank + (searchParams.dailyBonus ?? 0);
  const xpNeededWithoutDoubleXP = xpNeeded / ((100 + bonusXpWithoutDouble) / 100);
  return <>{formatPrice(Math.ceil(xpNeededWithoutDoubleXP / 1000))} fois</>;
}