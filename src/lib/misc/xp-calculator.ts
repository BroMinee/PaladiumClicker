import { constants } from "@/lib/constants";
import { MetierKey, PlayerRank } from "@/types";

const cumulativeXp = constants.metier_xp_java.reduce<number[]>((acc, xp) => {
  acc.push(acc[acc.length - 1] + xp);
  return acc;
}, [0]);

function _xpPerStep(level: number): number {
  return constants.metier_xp_java[Math.min(level - 1, constants.metier_xp_java.length - 1)];
}

/**
 * Java métier XP calculations derived entirely from `metier_xp`.
 */
export const JobXp = {
  /**
   * Returns the total cumulative XP required to reach a given level.
   * @param level The target level.
   */
  totalXp(level: number): number {
    if (level <= 1) {
      return 0;
    }
    if (level - 1 < cumulativeXp.length) {
      return cumulativeXp[level - 1];
    }
    return cumulativeXp.at(-1)! + (level - cumulativeXp.length) * constants.metier_xp_java.at(-1)!;
  },

  /**
   * Return the level from the xp amount
   * @param xp the current xp
   */
  levelFromXp(xp: number): number {
    for (let i = 1; i < cumulativeXp.length; i++) {
      if (xp < cumulativeXp[i]) {
        return i;
      }
    }
    return cumulativeXp.length + Math.floor((xp - cumulativeXp.at(-1)!) / constants.metier_xp_java.at(-1)!);
  },

  /**
   * Calculates the experience coefficient for a given level and current XP.
   * Used for svg.
   *
   * @param level The current level of the player/job.
   * @param currentXp The total experience points the player currently has.
   */
  xpCoef(level: number, currentXp: number): number {
    if (currentXp === 0) {
      return 0;
    }
    return (currentXp - JobXp.totalXp(level)) / _xpPerStep(level);
  },

  /**
   * Get the xp needed to reach the requested level base minus the currentXp
   * @param higherLevel the level the player want to reach
   * @param currentXP the current xp of the player
   * @returns the xp needed to reach the requested level base minus the currentXp
   */
  calculateXpNeeded(higherLevel: number, currentXP: number): number {
    return Math.ceil(JobXp.totalXp(higherLevel) - currentXP);
  },
};

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
    return 0.05;
  case "paladin":
  case "legend":
    return 0.1;
  case "endium":
  case "trixium":
  case "trixium+":
  case "divinity":
  case "rusher":
    return 0.15;
  case "premium": // premium add 5% (don't know how it's represented in the API) always place the condition at the end
    return 0.5;
  default:
    return 0;
  }

}
