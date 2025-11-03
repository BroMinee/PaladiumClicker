import { safeJoinPaths } from "./navbar";
import { constants } from "@/lib/constants.ts";

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