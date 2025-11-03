import constants from "@/lib/constants.ts";
import { MetierKey } from "@/types";

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