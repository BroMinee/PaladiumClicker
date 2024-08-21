export type Metier = {
  name: string,
  level: number,
  xp: number
}

export type Building = {
  name: string,
  index: number,
  price: number,
  base_production: string,
  own: number,
}

export type BuildingUpgrade = {
  name: string,
  own: boolean,
  active_index: number,
  price: number,
  condition: [{ day: number }, { index: number, own: number }],
}

export type CategoryUpgrade = {
  name: string,
  active_list_index: number[],
  pourcentage: number,
  own: boolean,
  price: number,
  condition: [{ index: number, own: number }],
}

export type CPS = {
  name: string,
  CPS: number
  own: boolean,
  index: number,
  price: number,
  condition: [{ coins: number }, { day: number } | undefined],
}

export type GlobalUpgrade = {
  name: string,
  pourcentage: number,
  own: boolean,
  price: number,
  condition: [{ coins: number }, { day: number }],
}

export type ManyUpgrade = {
  name: string,
  own: boolean,
  active_index: number,
  price: number,
  condition: [{ day: number }, { index: number, own: number }],
}

export type PosteriorUpgrade = {
  name: string,
  own: boolean,
  previous_index: number
  active_index: number,
  price: number,
  condition: [{ day: number }, { index: number, own: number }],
}

export type TerrainUpgrade = {
  name: string,
  active_list_index: number[],
  own: boolean,
  price: number,
  condition: [{ day: number }],
}

export type FriendInfo = {
  uuid: string,
  name: string,
}

export type PlayerInfo = {
  metier: Metier[],
  building: Building[],
  building_upgrade: BuildingUpgrade[],
  category_upgrade: CategoryUpgrade[],
  CPS: CPS[],
  global_upgrade: GlobalUpgrade[],
  many_upgrade: ManyUpgrade[],
  posterior_upgrade: PosteriorUpgrade[],
  terrain_upgrade: TerrainUpgrade[],
  production: number,
  faction: PaladiumFactionInfo,
  firstJoin: number,
  friends: PaladiumFriendInfo,
  money: number,
  timePlayed: number,
  username: string,
  uuid: string,
  rank: string,
  leaderboard: string,
  ah: AhType,
  last_fetch: number,
}

export type AhType = {
  data: AhItemType[],
  totalCount: number,
  dateUpdated: number,
}

export type AhItemType = {
  category: string,
  createdAt: number,
  durability: number,
  expireAt: number,
  item: { meta: number, name: string, quantity: number },
  name: string,
  price: number,
  pricePb: number,
  renamed: boolean,
  skin: number,
  slot: number,
  type: string,
}

export type UpgradeKey = keyof Pick<PlayerInfo,
  "global_upgrade" |
  "building_upgrade" |
  "category_upgrade" |
  "many_upgrade" |
  "posterior_upgrade" |
  "terrain_upgrade">;

export type ConditionWithCoins = CPS['condition'] | GlobalUpgrade['condition'];

export type ConditionWithIndex = ManyUpgrade['condition'] |
  PosteriorUpgrade['condition'] |
  CategoryUpgrade['condition'] |
  BuildingUpgrade['condition'] |
  TerrainUpgrade['condition'];

export type ConditionWithOwn = BuildingUpgrade['condition'] |
  ManyUpgrade['condition'] |
  PosteriorUpgrade['condition'] |
  CategoryUpgrade['condition'];

export type ConditionWithDay = ManyUpgrade['condition'] |
  PosteriorUpgrade['condition'] |
  TerrainUpgrade['condition'] |
  GlobalUpgrade['condition'] |
  CPS['condition'] |
  CategoryUpgrade['condition'];

export type AnyCondition = ConditionWithCoins | ConditionWithIndex | ConditionWithOwn | ConditionWithDay;

export type PaladiumPlayerInfo = {
  faction: string,
  firstJoin: number,
  jobs: PaladiumJobs,
  money: number,
  timePlayed: number,
  username: string,
  uuid: string,
  rank: string
}
export type PaladiumJobs = {
  alchemist: { level: number; xp: number; };
  farmer: { level: number; xp: number; };
  hunter: { level: number; xp: number; };
  miner: { level: number; xp: number; };
}

export type PaladiumRanking = {
  uuid: string,
  leaderboard: string,
  position: number,
  ranked: boolean
}

export type PaladiumClickerData = {
  uuid: string,
  buildings: Array<{
    name: string,
    production: number,
    quantity: number
  }>,
  upgrades: string[]
}

type PaladiumEmblem = {
  backgroundColor: number,
  backgroundId: number,
  borderColor: number,
  foregroundColor: number,
  foregroundId: number,
  iconBorderColor: number,
  iconColor: number,
  iconId: number
}

export type PaladiumFactionInfo = {
  name: string,
  access?: string,
  createdAt?: number,
  description?: string,
  emblem?: PaladiumEmblem,
  level?: { level: number, xp: number },
  players?: { group: string, joinedAt: number, username: string, uuid: string }[],
  uuid?: string
}

export type PaladiumFactionLeaderboard = {
  diff: number,
  elo: number
  emblem: PaladiumEmblem,
  name: string,
  position: number,
  trend: string
}[]

export type PaladiumFriendInfo = {
  data: FriendInfo[]
  totalCount: number;
}

export type New = {
  date: string,
  events: string[]
}


export type AhPaladium = {
  value: string,
  label: string,
}

export type AhItemHistory = {
  date: string,
  price: number,
  pricePb: number,
  quantity: number,
  sells: number,
  sellsPb: number,
}

export type PaladiumAhHistory = {
  data: AhItemHistory[],
  totalCount: number
}

export type PaladiumAhItemStat = {
  name: string,
  countListings: number,
  quantityAvailable: number,
  quantitySoldTotal: number,
  priceSum: number,
  priceAverage: number,
}

export type buildingPathType =
  "building_upgrade"
  | "category_upgrade"
  | "global_upgrade"
  | "many_upgrade"
  | "terrain_upgrade"
  | "posterior_upgrade";

export type bestUpgradeInfo =
  {
    bestRpsAfterUpgrade: number,
    bestUpgradeIndex: number,
    bestListName: buildingPathType
  };

export type bestBuildingInfo =
  {
    bestRpsAfterUpgrade: number,
    bestUpgradeIndex: number,
    bestListName: "building",
  };

export type bestPurchaseInfo =
  {
    path: buildingPathType | "building",
    index: number,
    own: number | boolean,
    pathImg: string,
  };

export type bestPurchaseInfoDetailed =
  bestPurchaseInfo &
  {
    timeToBuy: string,
    newRps: number,
    price: number
  }

export interface NetworkError extends Error {
  code?: string;
}

export type PalaAnimationLeaderboard = {
  data: {
    username: string,
    score: number
  }[],
  length: number
}

export type PalaAnimationScore = {
  position: number
  score: number
}

export type ProfilViewType =
  {
    uuid: string,
    count: number,
  }