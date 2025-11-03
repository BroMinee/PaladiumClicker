import { Role } from "@/types";

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

export function adaptPlurial(word: string, count: number) {
  return count >= 2 ? word + "s" : word;
}
