import { Achievement } from "@/types";
import { orderBy } from "./internal";

// TODO replace CategoryEnum by the real one
export enum CategoryEnum {
  "HOW_TO_START" = "HOW_TO_START",
  "JOBS" = "JOBS",
  "FACTION" = "FACTION",
  "ATTACK_DEFENSE" = "ATTACK_DEFENSE",
  "ECONOMY" = "ECONOMY",
  "OTHERS" = "OTHERS",
}

/**
 * Return the image and the display text associated to a CategoryEnum
 */
export function getCategoryInfo(category: CategoryEnum) {
  let imgPath ="";
  let displayText ="";
  switch (category) {
  case CategoryEnum.HOW_TO_START:
    imgPath = "AH_img/wood_pickaxe.webp";
    displayText = "Premier pas";
    break;
  case CategoryEnum.JOBS:
    imgPath = "AH_img/stone_pickaxe.webp";
    displayText = "Métiers";
    break;
  case CategoryEnum.FACTION:
    imgPath = "AH_img/diamond_sword.webp";
    displayText = "Faction";
    break;
  case CategoryEnum.ATTACK_DEFENSE:
    imgPath = "AH_img/tnt.webp";
    displayText = "Pillage & Défense";
    break;
  case CategoryEnum.ECONOMY:
    imgPath = "AH_img/gold_ingot.webp";
    displayText = "Economie";
    break;
  case CategoryEnum.OTHERS:
    imgPath = "AH_img/ender_pearl.webp";
    displayText = "Divers";
    break;
  default:
    imgPath = "unknown.webp";
    displayText = "Inconnu";
    break;
  }
  return {
    imgPath,
    displayText,
  };
}

/**
 * tautological
 */
export function isCompleted(achievement: Achievement): boolean {
  return achievement.completed && achievement.subAchievements.every(isCompleted);
}

/**
 * Find a roman number anywhere inside the string and return it's conversion in base 10.
 * @param roman string containing a roman number
 */
export function romanToInt(roman: string): number {
  const map: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
  };

  let total = 0;
  let prev = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const current = map[roman[i]];
    if (!current) {
      return 0;
    }

    if (current < prev) {
      total -= current;
    } else {
      total += current;
    }

    prev = current;
  }

  return total;
}

/**
 * Sort achievements by category
 * @param achievements List of achievements
 */
export const groupAndSortAchievements = (achievements: Achievement[]) => {
  const grouped: Record<CategoryEnum, Achievement[]> = {
    [CategoryEnum.HOW_TO_START]: [],
    [CategoryEnum.JOBS]: [],
    [CategoryEnum.FACTION]: [],
    [CategoryEnum.ATTACK_DEFENSE]: [],
    [CategoryEnum.ECONOMY]: [],
    [CategoryEnum.OTHERS]: [],
  };

  achievements.forEach((ach) => {
    const category = ach.category as CategoryEnum;
    if (category && grouped[category]) {
      grouped[category].push(ach);
    }
  });

  for (const category in grouped) {
    grouped[category as CategoryEnum] = orderBy(grouped[category as CategoryEnum], (ach) => (isCompleted(ach) ? 0 : 1));
  }

  return grouped;
};