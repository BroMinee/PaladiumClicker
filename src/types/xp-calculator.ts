import { MetierKey } from "./profil";

export type LevelPreconditions = {
  [K in MetierKey]?: {
    [level: number]: string;
  }
}