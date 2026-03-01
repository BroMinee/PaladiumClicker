import { constants } from "@/lib/constants";
import { MetierKey, PlayerRank } from "@/types";

export type PlatformVersion = "java" | "bedrock";

const cumulativeXpJava = constants.metier_xp_java.reduce<number[]>((acc, xp) => {
  acc.push(acc[acc.length - 1] + xp);
  return acc;
}, [0]);

const cumulativeXpBedrock = constants.metier_xp_bedrock.reduce<number[]>((acc, xp) => {
  acc.push(acc[acc.length - 1] + xp);
  return acc;
}, [0]);

function _xpPerStep(level: number, version: PlatformVersion): number {
  if (version === "java") {
    return constants.metier_xp_java[Math.min(level - 1, constants.metier_xp_java.length - 1)];
  } else {
    // Level 18's step covers the 18->20 transition (index 19 = 284041), not the phantom 18->19 (index 18 = 0).
    const idx = level === 18 ? 19 : Math.min(level, constants.metier_xp_bedrock.length - 1);
    return constants.metier_xp_bedrock[idx];
  }
}

/**
 * Java and Bedrock metier XP calculations.
 *
 * - Java  : levels start at 1.
 * - Bedrock: levels start at 0. Level 19 does not exist:
 *   totalXp(19, "bedrock") === totalXp(20, "bedrock").
 */
export const JobXp = {
  /**
   * Returns the total cumulative XP required to reach a given level.
   * @param level The target level (Java: > 1 | Bedrock: > 0).
   * @param version "java" or "bedrock".
   */
  totalXp(level: number, version: PlatformVersion): number {
    if (version === "java") {
      if (level <= 1) {
        return 0;
      }
      if (level - 1 < cumulativeXpJava.length) {
        return cumulativeXpJava[level - 1];
      }
      return cumulativeXpJava.at(-1)! + (level - cumulativeXpJava.length) * constants.metier_xp_java.at(-1)!;
    } else {
      {
        if (level <= 0) {
          // Bedrock: starts at level 0.
          return 0;
        }
        // Level 19 doesn't exist — redirect to 20 so totalXp(19) === totalXp(20).
        const bedrockLevel = level === 19 ? 20 : level;
        if (bedrockLevel < cumulativeXpBedrock.length) {
          return cumulativeXpBedrock[bedrockLevel];
        }
        return cumulativeXpBedrock.at(-1)! + (bedrockLevel +1 - cumulativeXpBedrock.length) * constants.metier_xp_bedrock.at(-1)!;
      }
    }
  },

  /**
   * Return the level from the xp amount
   * @param xp the current xp
   */
  levelFromXp(xp: number): number {
    for (let i = 1; i < cumulativeXpJava.length; i++) {
      if (xp < cumulativeXpJava[i]) {
        return i;
      }
    }
    return cumulativeXpJava.length + Math.floor((xp - cumulativeXpJava.at(-1)!) / constants.metier_xp_java.at(-1)!);
  },

  /**
   * Calculates the experience coefficient for a given level and current XP.
   * Used for svg.
   *
   * @param level The current level of the player/job.
   * @param currentXp The total experience points the player currently has.
   * @param version "java" (default) or "bedrock".
   */
  xpCoef(level: number, currentXp: number, version: PlatformVersion): number {
    if (currentXp === 0) {
      return 0;
    }
    return (currentXp - JobXp.totalXp(level, version)) / _xpPerStep(level, version);
  },

  /**
   * Get the xp needed to reach the requested level base minus the currentXp
   * @param higherLevel the level the player want to reach
   * @param currentXP the current xp of the player
   * @param version "java" (default) or "bedrock".
   * @returns the xp needed to reach the requested level base minus the currentXp
   */
  calculateXpNeeded(higherLevel: number, currentXP: number, version: PlatformVersion = "java"): number {
    return Math.ceil(JobXp.totalXp(higherLevel, version) - currentXP);
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
