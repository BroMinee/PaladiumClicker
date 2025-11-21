
export enum RankingType {
  "money" = "money",
  "job.alchemist" = "job.alchemist",
  "job.hunter" = "job.hunter",
  "job.miner" = "job.miner",
  "job.farmer" = "job.farmer",
  "boss" = "boss",
  "egghunt" = "egghunt",
  // "end" = "end",
  // "chorus" = "chorus",
  "koth" = "koth",
  "clicker" = "clicker",
  // "alliance" = "alliance",
  "vote" = "vote",
}

export type RankingResponse =
  rankingResponseSubType[]

export type rankingResponseSubType = {
  uuid: string,
  username: string,
  date: string,
  value: number,
  position: number
}

export type RankingPositionResponse = {
  [K in Exclude<RankingType, "vote">]: number;
};

export type PaladiumRanking = {
  uuid: string,
  leaderboard: string,
  position: number,
  ranked: boolean
}

export type searchParamsProfilPage = { section?: string, category?: string, usernames?: string }