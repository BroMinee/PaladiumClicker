export type Achievement = {
  id: string,
  progress: number,
  completed: boolean,
  category: CategoryEnum,
  name: string,
  description: string,
  amount: number,
  icon: string,
  imgPath: string,
  subAchievements: Achievement[]
}

export enum CategoryEnum {
  "HOW_TO_START" = "HOW_TO_START",
  "JOBS" = "JOBS",
  "FACTION" = "FACTION",
  "ATTACK_DEFENSE" = "ATTACK_DEFENSE",
  "ECONOMY" = "ECONOMY",
  "ALLIANCE" = "ALLIANCE",
  "OTHERS" = "OTHERS",
}