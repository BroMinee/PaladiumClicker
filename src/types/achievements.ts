export type Achievement = {
  id: string,
  progress: number,
  completed: boolean,
  category: AchievementCategory,
  name: string,
  description: string,
  amount: number,
  icon: string,
  imgPath: string,
  subAchievements: Achievement[]
}

export type AchievementCategory = "HOW_TO_START" |
  "JOBS" |
  "FACTION" |
  "ATTACK_DEFENSE" |
  "ECONOMY" |
  "ALLIANCE" |
  "OTHERS";
