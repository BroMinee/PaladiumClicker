export type Metier = {
  name: 'Alchimiste' | 'Fermier' | 'Mineur' | 'Chasseur',
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

export type MetierKey = keyof Pick<Metiers,
  "alchemist" |
  "farmer" |
  "hunter" |
  "miner">;

export type Metiers = {
  alchemist: Metier,
  farmer: Metier,
  hunter: Metier,
  miner: Metier,
}

export type MetiersPossiblyUndefined = {
  alchemist: Metier,
  farmer: Metier,
  hunter: Metier,
  miner: Metier,
}


export type PlayerInfo = {
  metier: Metiers
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
  view_count: ProfilViewType
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
  money: number,
  timePlayed: number,
  username: string,
  uuid: string,
  rank: string
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
  forcedTexture: string,
  foregroundColor: number,
  foregroundId: number,
  iconBorderColor: number,
  iconColor: number,
  iconId: number
}

export type PaladiumFactionInfo = {
  name: string,
  access: string,
  createdAt: number,
  description: string,
  emblem: PaladiumEmblem,
  level: { level: number, xp: number },
  players: { group: string, joinedAt: number, username: string, uuid: string }[],
  uuid: string
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

export type PalaAnimationLeaderboard = PalaAnimationScore[]

export type PalaAnimationLeaderboardGlobal = {
  username: string,
  avg_completion_time: number,
  avg_user_completion_time: number,
  rank_completion_time: number,
  rank_user_completion_time: number,
}[]

export type PalaAnimationScore = {
  username: string,
  completion_time: number,
  user_completion_time: number,
  rank_completion_time: number,
  rank_user_completion_time: number,
}

export type ProfilViewType =
  {
    uuid: string,
    count: number,
  }

export type KeyDownTimestampType =
  {
    key: string,
    timestamp: number
  }

export type userAnswerType =
  {
    c: string,
    color: string
  }


export type checkAnswerPalaAnimationType =
  {
    valid: boolean,
    message: string,
    time: number,
    text: userAnswerType[]
  }

export enum RankingType {
  "money" = "money",
  "job.alchemist" = "job.alchemist",
  "job.hunter" = "job.hunter",
  "job.miner" = "job.miner",
  "job.farmer" = "job.farmer",
  "boss" = "boss",
  "egghunt" = "egghunt",
  "end" = "end",
  "chorus" = "chorus",
  "koth" = "koth",
  "clicker" = "clicker",
}

export type RankingResponse =
  rankingResponseSubType[]

type rankingResponseSubType = {
  uuid: string,
  username: string,
  date: Date,
  value: number,
  position: number
}

export type AdminShopItem =
  'feather'
  | 'wool'
  | 'paladium-ingot'
  | 'ender-pearl'
  | 'egg'
  | 'string'
  | 'log'
  | 'red-mushroom'
  | 'soul-sand'
  | 'glowstone-dust'
  | 'findium'
  | 'titane-ingot'
  | 'apple'
  | 'cobblestone'
  | 'reeds'
  | 'ghast-tear'
  | 'potato'
  | 'tile-passifwither-head'
  | 'cactus'
  | 'melon'
  | 'obsidian'
  | 'slime-ball'
  | 'skull-1'
  | 'spider-eye'
  | 'dirt'
  | 'quartz'
  | 'bone'
  | 'nether-wart'
  | 'wheat-seeds'
  | 'gunpowder'
  | 'iron-ingot'
  | 'fermented-spider-eye'
  | 'leather'
  | 'sand'
  | 'dye'
  | 'diamond'
  | 'gold-ingot'
  | 'flint'
  | 'coal'
  | 'redstone'
  | 'emerald'
  | 'brown-mushroom'
  | 'blaze-rod'
  | 'amethyst-ingot'
  | 'carrot'
  | 'cooked-beef';

export const adminShopItemsAvailable: AdminShopItem[] = [
  'feather', 'wool', 'paladium-ingot', 'ender-pearl', 'egg', 'string', 'log', 'red-mushroom', 'soul-sand',
  'glowstone-dust', 'findium', 'titane-ingot', 'apple', 'cobblestone', 'reeds', 'ghast-tear', 'potato',
  'tile-passifwither-head', 'cactus', 'melon', 'obsidian', 'slime-ball', 'skull-1', 'spider-eye', 'dirt',
  'quartz', 'bone', 'nether-wart', 'wheat-seeds', 'gunpowder', 'iron-ingot', 'fermented-spider-eye', 'leather',
  'sand', 'dye', 'diamond', 'gold-ingot', 'flint', 'coal', 'redstone', 'emerald', 'brown-mushroom', 'blaze-rod',
  'amethyst-ingot', 'carrot', 'cooked-beef'
];

export function isShopItem(item: string): item is AdminShopItem {
  return adminShopItemsAvailable.includes(item as AdminShopItem);
}

export type AdminShopItemDetail = {
  date: number
  name: AdminShopItem,
  canBuy: boolean,
  buyPrice: number,
  sellPrice: number,
  canSell: boolean,
}

export type StatusType =
  'online' | 'offline' | 'maintenance' | 'unknown' | 'starting' | 'running' | 'restart' | 'stopping' | 'whitelist'

export type ServerName =
  'Soleratl'
  | 'Muzdan'
  | 'Manashino'
  | 'Event'
  | 'Luccento'
  | 'Imbali'
  | 'Keltis'
  | 'Neolith'
  | 'Untaa'
  | 'Launcher'
  | 'Paladium';

export type ServerStatusResponse =
  {
    date: number,
    faction_name: ServerName,
    status: StatusType,
  }

export type ServerPaladiumStatusResponse = ServerStatusResponse & {
  players: number
}

export type PlayerDBApiReponse =
  {
    data: { player: { id: string } }
  }

export type OptionType = {
  value: string
  label: string
  label2: string
  img: string
}