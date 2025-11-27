import { MetierKey } from "@/types";
import { safeJoinPaths } from "./navbar";
import { constants } from "@/lib/constants";

/**
 * Returns the image path corresponding to a given rank.
 * @param rank The rank name.
 */
export function getRankImg(rank: string) {
  if (rank === "Default") {
    return safeJoinPaths(constants.imgPathProfile,"dirt.png");
  } else if (rank === "Titan") {
    return safeJoinPaths(constants.imgPathProfile,"titan.png");
  } else if (rank === "Paladin") {
    return safeJoinPaths(constants.imgPathProfile,"paladin.png");
  } else if (rank === "Endium") {
    return safeJoinPaths(constants.imgPathProfile,"endium.png");
  } else if (rank === "Trixium") {
    return safeJoinPaths(constants.imgPathProfile,"trixium.png");
  } else if (rank === "Trixium+") {
    return safeJoinPaths(constants.imgPathProfile,"trixium+.png");
  } else if (rank === "Youtuber") {
    return safeJoinPaths(constants.imgPathProfile,"youtuber.png");
  } else if(rank === "Streamer") {
    return safeJoinPaths(constants.imgPathProfile,"streamer.png");
  } else if (rank === "Heros") {
    return safeJoinPaths(constants.imgPathProfile,"heros.png");
  }else if (rank === "Divinity") {
    return safeJoinPaths(constants.imgPathProfile,"divinity.png");
  }else if (rank === "Legend") {
    return safeJoinPaths(constants.imgPathProfile,"legend.png");
  }else if (rank === "Premium") {
    return safeJoinPaths(constants.imgPathProfile,"premium.png");
  } else if(rank === "Rusher") {
    return safeJoinPaths(constants.imgPathProfile,"rusher.png");
  } else {
    return "unknown.png";
  }
}

/**
 * Converts a total time in minutes into a human-readable string with days, hours, and minutes.
 * @param timeInMinutes The total time played in minutes.
 */
export function computeTimePlayed(timeInMinutes: number) {
  if (timeInMinutes === -1) {
    return "Indisponible";
  }

  const minute = timeInMinutes % 60;
  const hour = Math.floor(timeInMinutes / 60) % 24;
  const day = Math.floor(timeInMinutes / 60 / 24);
  let res = "";
  if (day > 0) {
    res += day + "j ";
  }
  if (hour > 0) {
    res += hour + "h ";
  }
  res += minute + "m";

  return res;
}

/**
 * Converts an epoch timestamp (in milliseconds) to a UTC date string.
 * @param epoch The epoch time in milliseconds.
 */
export function convertEpochToDateUTC2(epoch: number | undefined) {
  if (!epoch) {
    return "Error";
  }
  const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
  date.setUTCSeconds(epoch / 1000);
  return date.toLocaleString();
}

/**
 * Calculates the total XP needed for a mount to reach a specific level.
 * @param level The target level.
 */
export function mountureGetNeededXpForLevel(level: number) {
  let sum = 0;
  for (let i = 2; i <= level; i++) {
    sum += Math.pow(i, 2.5);
  }
  return sum;
}

/**
 * Returns the mount's level based on the given XP.
 * @param xp The current XP of the mount.
 */
export function montureGetLevelFromXp(xp: number) {
  for (let lvl = 0; lvl <= 100; lvl++) {
    const needed = mountureGetNeededXpForLevel(lvl);
    if (xp < needed) {
      return lvl;
    }
  }
  return 100;
}

/**
 * Computes the pourcentage/100 of XP progress relative to the current level for a mount.
 * @param xp The current XP.
 * @param curLevel The current level.
 */
export function montureGetCoef(xp: number, curLevel: number) {
  const needed = mountureGetNeededXpForLevel(curLevel);
  return xp / needed;
}

/**
 * Calculates the total XP needed for a pet to reach a specific level.
 * @param level The target level.
 */
export function petGetNeededXpForLevel(level: number): number {
  if (level === 0) {
    return 0;
  }
  return (level * level - 1) * (90 / level) + 300 + petGetNeededXpForLevel(level - 1);
}

/**
 * Returns the pet's level based on the given XP.
 * @param xp The current XP of the pet.
 */
export function petGetLevelFromXp(xp: number) {
  for (let lvl = 0; lvl <= 100; lvl++) {
    const needed = petGetNeededXpForLevel(lvl);
    if (xp < needed) {
      return lvl;
    }
  }
  return 100;
}

/**
 * Computes the pourcentage/100 of XP progress relative to the required XP for a pet.
 * @param xp The current XP.
 * @param xpNeeded The XP required for the target level.
 */
export function petGetCoef(xp: number, xpNeeded: number) {
  return xp / xpNeeded;
}

/**
 * Converts a signed 32-bit integer color value into a 6-digit hex color string.
 *
 * @param color - The integer color value to convert.
 * @returns A standard 6-digit hex color string (e.g. "#1a2b3c").
 */
export function intToHex(color: number): string {
  if (color === -1) {
    return "#FFFFFF";
  }

  const unsigned = color >>> 0;
  const hex = unsigned.toString(16).padStart(8, "0");

  return `#${hex.slice(2)}`;
}

/**
 * Returns a pretty (human-readable) name for a given job key.
 */
export function prettyJobName(jobName: MetierKey) {
  switch (jobName) {
  case "alchemist":
    return "Alchimiste";
  case "farmer":
    return "Farmeur";
  case "hunter":
    return "Hunter";
  case "miner":
    return "Mineur";
  default:
    return "Inconnu";
  }
}

/**
 * Compute the levenshteinDistance between 2 strings
 * @param a - string 1
 * @param b - string 2
 */
export const levenshteinDistance = (a: string, b: string): number => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
};