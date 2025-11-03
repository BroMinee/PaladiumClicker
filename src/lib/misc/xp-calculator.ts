import { searchParamsXpBonusPage } from "@/components/Xp-Calculator/XpCalculator";
import { constants } from "@/lib/constants.ts";
import { MetierKey, PlayerInfo } from "@/types";

export function getXpCoef(level: number, currentXp: number) {
  // if (level === 100)
  //   return 1;
  if (currentXp === 0) {
    return 0;
  }
  if(level >= 100) {
    return (currentXp - constants.metier_palier[99] - constants.metier_xp[99] * (level - 100)) / constants.metier_xp[99];
  }
  return (currentXp - constants.metier_palier[level - 1]) / constants.metier_xp[level];
}

export const getColorByMetierName = (name: MetierKey) => {
  let color = [0, 150, 0];
  let bgColor = [0, 0, 0];

  switch (name) {
  case "miner":
    color = [255, 47, 47];
    bgColor = [255, 47, 47];
    break;
  case "farmer":
    color = [199, 169, 33];
    bgColor = [255, 209, 1];
    break;
  case "hunter":
    color = [47, 103, 255];
    bgColor = [47, 103, 255];
    break;
  case "alchemist":
    color = [255, 100, 201];
    bgColor = [255, 100, 201];
  }

  return { color, bgColor };
};

export function getXpDiff(playerInfo: PlayerInfo | null, searchParams: searchParamsXpBonusPage) {
  if (!playerInfo || !playerInfo?.metier || searchParams.level === undefined || !searchParams.metier) {
    return 0;
  }
  const higherLevel = searchParams.level;
  const res = getTotalXPForLevel(higherLevel) - playerInfo.metier[searchParams.metier as MetierKey].xp;
  if (res < 0) {
    return playerInfo.metier[searchParams.metier as MetierKey].level === 100 ? 0 : 0;
  }
  return res;
}

export function getTotalXPForLevel(level: number) {

  if (level - 1 >= constants.metier_palier.length) {
    return constants.metier_palier[99] + (level - constants.metier_palier.length) * constants.metier_xp[constants.metier_xp.length - 1];
  }

  return constants.metier_palier[level - 1];
}