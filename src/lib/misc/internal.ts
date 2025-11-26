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

type Key = string | number | symbol;

/**
 * groupBy using the lambda.
 */
export function groupBy<T, K extends Key>(
  data: T[],
  fn: (item: T) => K
): Record<K, T[]> {
  return data.reduce((acc, item) => {
    const key = fn(item);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

type Order = "asc" | "desc";

/**
 * orderB using the lambda
 */
export function orderBy<T>(
  data: T[],
  selector: (item: T) => any,
  order: Order = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aValue = selector(a);
    const bValue = selector(b);

    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });
}