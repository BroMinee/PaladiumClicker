import { MetierKey } from "./profil";

export type LevelPreconditions = {
  [K in MetierKey]?: {
    [level: number]: string;
  }
}

export type searchParamsXpBonusPage = {
  metier: string | undefined,
  level: number | undefined,
  double: boolean | undefined
  dailyBonus: number | undefined
  f2: boolean | undefined
  f3: boolean | undefined
}