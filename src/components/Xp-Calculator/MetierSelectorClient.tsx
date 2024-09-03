'use client';
import { formatPrice, generateXpCalculatorUrl, safeJoinPaths } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import { MetierKey, PlayerInfo } from "@/types";
import { useRouter } from "next/navigation";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import metierJson from "@/assets/metier.json";
import Image from "next/image";
import { MetierDecrease, MetierDisplayLvl, MetierIncrease, MetierOutline } from "@/components/MetierListClient.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { searchParamsXpBonusPage } from "@/components/Xp-Calculator/XpCalculator.tsx";
import constants from "@/lib/constants.ts";

export function SetLevelInUrl({ selected, params, searchParams }: {
  selected: MetierKey,
  params: { username: string },
  searchParams: searchParamsXpBonusPage
}) {
  const router = useRouter();
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo)
    return;
  let levelToReach = searchParams.level;
  if (levelToReach === undefined || levelToReach <= playerInfo.metier[selected].level)
    levelToReach = playerInfo.metier[selected].level + 1;

  levelToReach = Math.min(levelToReach, 100);

  router.push(generateXpCalculatorUrl(params.username, selected, levelToReach, searchParams.double, searchParams.dailyBonus), { scroll: false });
  return null;
}

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
    <img src={safeJoinPaths("/JobsIcon/", `${imgPath}.webp`)}
         alt={metier}
         className={cn("object-cover h-36 w-auto pixelated hover:scale-105 duration-300 cursor-pointer",
           !selected ? "grayscale" : "")}
         onClick={() => router.push(generateXpCalculatorUrl(username, metier, searchParams.level, searchParams.double, searchParams.dailyBonus), { scroll: false })}
    />
  )
}

type MetierProps = {
  minLevel?: number;
  metierKey: MetierKey;
  searchParams: searchParamsXpBonusPage;
};

export const MetierToReachWrapper = ({
                                       metierKey,
                                       searchParams,
                                     }: MetierProps) => {

  const metierName = metierJson[metierKey].name as MetierKey;

  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo || searchParams.level === undefined)
    return;

  const minLevel = Math.min(playerInfo.metier[metierKey].level + 1, 100);
  return (
    <>
      <div className="relative">
        <Image src={safeJoinPaths("/JobsIcon/", `${metierName}.webp`)} alt="image"
               style={{ position: "inherit", zIndex: 2 }} width={256} height={256}/>
        <div className="progress-bar">
          {/* BroMine.... Please, never touch this code again. It works !*/}
          {/* 30/08/2024 I have touched it o_O */}
          <svg className="progress blue noselect" x="0px" y="0px" viewBox="0 0 776 628">
            <path className="track"
                  d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"></path>
            <MetierOutline metierKey={metierKey} metierToReach={true}/>
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <MetierDecrease minLevel={minLevel} metierKey={metierKey} searchParams={searchParams}
                        username={playerInfo.username}/>
        <MetierDisplayLvl metierKey={metierKey} lvlToReach={searchParams.level}/>
        <MetierIncrease metierKey={metierKey} searchParams={searchParams} username={playerInfo.username}/>
      </div>
    </>
  );
}

export function ButtonTakeDoubleXp({ params, searchParams, doubleXp, children }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage,
  doubleXp: number,
  children: React.ReactNode
}) {
  const router = useRouter();

  return <Button className={doubleXp === 100 ? "bg-red-500" : "bg-green-500"}
                 onClick={() => {
                   if (doubleXp === 0)
                     router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, true, searchParams.dailyBonus), { scroll: false })
                   else
                     router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, false, searchParams.dailyBonus), { scroll: false })
                 }}
  >
    {children}
  </Button>
}

export function InputDailyBonus({ params, searchParams }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage,
}) {
  const router = useRouter();
  return <Input className="w-auto" type="number" min="0" step="0.1" max="99"
                value={Number(searchParams.dailyBonus || 0)}
                onChange={(e) => {
                  router.push(generateXpCalculatorUrl(params.username, searchParams.metier, searchParams.level, searchParams.double, Number(e.target.value)), { scroll: false });
                }
                }/>
}

function getBonusRank(playerInfo : PlayerInfo | null) {
  if(!playerInfo)
    return 0;

  let bonusXpRank = 0;
  if (playerInfo) {
    switch (playerInfo.rank) {
      case "titane":
        bonusXpRank = 5;
        break;
      case "paladin":
        bonusXpRank = 10;
        break;
      case "endium":
      case "trixium":
      case "trixium+":
        bonusXpRank = 15;
        break;
    }
  }
  return bonusXpRank;
}

export function DisplayDailyDoubleRank({ dailyBonus, doubleXp }: { dailyBonus: number, doubleXp: number }) {
  const { data: playerInfo } = usePlayerInfoStore();

  let bonusXpRank = getBonusRank(playerInfo);
  return <>{dailyBonus + doubleXp + bonusXpRank}%</>
}

export function DisplayXpBonus() {
  const { data: playerInfo } = usePlayerInfoStore();

  let bonusXpRank = getBonusRank(playerInfo);
  return <>{bonusXpRank}%</>
}

function getXpDiff(playerInfo : PlayerInfo | null, searchParams: searchParamsXpBonusPage) {
  if (!playerInfo || !playerInfo?.metier || searchParams.level === undefined || !searchParams.metier)
    return 0;
  const higherLevel = searchParams.level;
  const res = getTotalXPForLevel(higherLevel) - playerInfo.metier[searchParams.metier as MetierKey].xp;
  if (res < 0) {
    return playerInfo.metier[searchParams.metier as MetierKey].level === 100 ? 0 : -1;
  }
  return res;
}

function getTotalXPForLevel(level: number) {
  return constants.metier_palier[level - 1];

}

export function DisplayXpNeeded({ searchParams }: { searchParams: searchParamsXpBonusPage }) {
  const { data: playerInfo } = usePlayerInfoStore();
  const xpNeeded = getXpDiff(playerInfo, searchParams);
  return <>{formatPrice(Math.ceil(xpNeeded))} xp</>
}

export function DisplayXpNeededWithDouble({ searchParams, xp }: { searchParams: searchParamsXpBonusPage, xp: number }) {
  const { data: playerInfo } = usePlayerInfoStore();
  const xpNeeded = getXpDiff(playerInfo,searchParams);

  const bonusXpRank = getBonusRank(playerInfo);
  const bonusXpWithoutDouble = bonusXpRank + (searchParams.dailyBonus || 0);
  const bonusXpDouble = bonusXpWithoutDouble + (searchParams.double ? 100 : 0);
  const xpNeededWithDoubleXP = xpNeeded / ((100 + bonusXpDouble) / 100);
  return <>{formatPrice(Math.ceil(xpNeededWithDoubleXP / xp))} fois</>
}

export function DisplayXpNeededWithBottle({ searchParams }: { searchParams: searchParamsXpBonusPage }) {
  const { data: playerInfo } = usePlayerInfoStore();
  const xpNeeded = getXpDiff(playerInfo, searchParams);


  const bonusXpRank = getBonusRank(playerInfo);
  const bonusXpWithoutDouble = bonusXpRank + (searchParams.dailyBonus || 0);
  const xpNeededWithoutDoubleXP = xpNeeded / ((100 + bonusXpWithoutDouble) / 100);
  return <>{formatPrice(Math.ceil(xpNeededWithoutDoubleXP / 1000))} fois</>
}