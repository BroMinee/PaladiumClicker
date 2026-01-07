import { constants } from "@/lib/constants";
import { MetierKey, PlayerRank } from "@/types";

/**
 * Calculates the experience coefficient for a given level and current XP.
 * Used for svg.
 *
 * @param level The current level of the player/job.
 * @param currentXp The total experience points the player currently has.
 */
export function getXpCoef(level: number, currentXp: number) {
  if (currentXp === 0) {
    return 0;
  }
  if(level >= 20) {
    return (currentXp - constants.metier_palier[19] - constants.metier_xp[19] * (level - 20)) / constants.metier_xp[19];
  }
  return (currentXp - constants.metier_palier[level - 1]) / constants.metier_xp[level - 1];
}

/**
 * Returns the primary and background RGB colors associated with a given job name.
 *
 * @param name The job key.
 */
export const getColorByMetierName = (name: MetierKey) => {
  let color = [0, 150, 0];
  let bgColor = [0, 0, 0];

  switch (name) {
  case "miner":
    color = [255, 47, 47];
    bgColor = [156, 29, 29];
    break;
  case "farmer":
    color = [199, 169, 33];
    bgColor = [117, 100, 19];
    break;
  case "hunter":
    color = [47, 103, 255];
    bgColor = [21, 46, 115];
    break;
  case "alchemist":
    color = [255, 100, 201];
    bgColor = [181, 71, 143];
  }

  return { color, bgColor };
};

/**
 * Returns the total cumulative XP required to reach a given level.
 * @param level The target level.
 */
export function getTotalXPForLevel(level: number) {

  if (level - 1 >= constants.metier_palier.length) {
    return constants.metier_palier[19] + (level - constants.metier_palier.length) * constants.metier_xp[constants.metier_xp.length - 1];
  }

  return constants.metier_palier[level - 1];
}

/**
 * Return the level from the xp amount
 * @param xp the current xp
 */
export function getLevelFromXp(xp: number) {
  let i = 0;
  for (i = 0; i < constants.metier_palier.length; i++) {
    if (xp < constants.metier_palier[i]) {
      return i;
    }
  }
  const xpAfterLast = xp - constants.metier_palier[constants.metier_palier.length - 1];

  const extraLevels = Math.floor(xpAfterLast / constants.metier_xp[constants.metier_xp.length-1]);

  return i + extraLevels;
}

/**
 * Return the bonus rank percentage
 * @param playerRank the player rank
 */
export function getBonusRank(playerRank: PlayerRank | undefined) {
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
 * Get the xp needed to reach the requested level base minus the currentXp
 * @param higherLevel
 * @param currentXP
 * @returns
 */
export const calculateXpNeeded = (higherLevel: number, currentXP: number): number => {
  const res = getTotalXPForLevel(higherLevel) - currentXP;
  return Math.ceil(res);
};
