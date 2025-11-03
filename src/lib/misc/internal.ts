import { Role } from "@/types";

/**
 * Returns the hex color associated with a given user role.
 * @param role The role to get the color for.
 */
export function getRoleColor(role: Role) {
  switch (role) {
  case "Admin":
    return "#EF4444";
  case "Moderator":
    return "#10B981";
  case "Bug Hunter":
    return "#06B6D4";
  case "Beta Tester":
    return "#EC4899";
  case "Palatime":
    return "#F59E0B";
  case "Classic":
    return "#ff5c00";
  default:
    return "#8B5CF6";
  }
}

/**
 * Returns the plural form of a word if the count is 2 or more.
 * @param word The word to potentially pluralize.
 * @param count The number determining pluralization.
 */
export function adaptPlurial(word: string, count: number) {
  return count >= 2 ? word + "s" : word;
}
