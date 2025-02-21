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
  alchemist?: Metier,
  farmer?: Metier,
  hunter?: Metier,
  miner?: Metier,
}

export type PlayerRank = "default" | "titan" | "paladin" | "endium" | "trixium" | "trixium+"|  "youtuber" | "heros" | "divinity" | "legend"| "premium";

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
  rank: PlayerRank,
  leaderboard: string,
  ah: AhType,
  last_fetch: number,
  view_count: ProfilViewType,
  achievements: Achievement[],
  alliance: string,
  currentBanner: string,
  description: string,
  mount: MountInfo | null,
  pet: PetInfo | null,
  version?: number,
  edited?: boolean,
}

export type MountInfo = {
  name: string,
  damage: number,
  food: number,
  xp: number,
  mountType: number,
  sharedXpPercent: number,
}

export type PetInfo = {
  currentSkin: string,
  experience: number,
  happiness: number,
  skills: PetSkillInfo[],
}

type PetSkillInfo = {
  id: string,
  lastChange: number,
  nextUse: number,
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
  rank: string,
  alliance: string,
  currentBanner: string,
  description: string,
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
  level?: { level: number, xp: number },
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

export type MarketListedItem = MarketItemOffer[]


export type MarketItemOffer = {
  seller: string, // uuid of the seller
  name: string, // Display name of the item
  renamed: boolean,
  quantity: number, // The remaining quantity of the item currenlty listed
  price: number, // The price of the item in ($)
  pricePb: number, // The price of the item in pb
  durability: number, // Durability of the item
  skin: number, // Skin ID of the item
  slot: number, // Slot of the item in the market
  createdAt: number, // Date of the listing
  expireAt: number, // Date of the expiration of the listing
}

export type PaladiumAhItemStat = {
  name: string,
  countListings: number,
  listing: MarketListedItem,
  quantityAvailable: number,
  quantitySoldTotal: number,
  priceSum: number,
  priceAverage: number,
}

export type PaladiumAhItemStatResponse = {
  data: PaladiumAhItemStat[]
  totalCount: number
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
    bestCoef: number,
    bestUpgradeIndex: number,
    bestListName: buildingPathType
  };

export type bestBuildingInfo =
  {
    bestCoef: number,
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
  global_name: string,
  avg_completion_time: number,
  rank_completion_time: number,
}[]

export type PalaAnimationScore = {
  global_name: string,
  completion_time: number,
  rank_completion_time: number,
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
  // "end" = "end",
  // "chorus" = "chorus",
  "koth" = "koth",
  "clicker" = "clicker",
  "alignement" = "alignement",
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

export type AdminShopPeriode = 'day' | 'week' | 'month' | 'season';
export type StatusPeriode = 'day' | 'week' | 'month' | 'season';

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
  sellPrice: number,
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
    data: { player: { id: string, username: string } }
  }

export type OptionType = {
  value: string
  label: string
  label2: string
  img: string
}

export type Item = {
  item_name: string,
  us_trad: string,
  fr_trad: string,
  img: string
}

export type CraftingRecipeType =
  {
    item: Item,
    table: 'crafting table' | 'furnace' | 'grinder' | 'palamachine' | 'cauldron' | 'alchemy creator',
    slot1: Item | null,
    slot2: Item | null,
    slot3: Item | null,
    slot4: Item | null,
    slot5: Item | null,
    slot6: Item | null,
    slot7: Item | null,
    slot8: Item | null,
    slot9: Item | null,
    count: number
  }

export type CraftingRecipeKey = keyof Pick<CraftingRecipeType,
  "slot1" |
  "slot2" |
  "slot3" |
  "slot4" |
  "slot5" |
  "slot6" |
  "slot7" |
  "slot8" |
  "slot9"
>;

export type NodeType = OptionType & { count: number } & { checked: boolean }

export type Tree<T> = {
  value: T;
  children: Tree<T>[];
}

export enum ProfilSectionEnum {
  "Home" = "Home",
  "Classement" = "Classement",
  "Market" = "Market",
  "Pet/Monture" = "Pet/Monture",
  "Achievements" = "Achievements",
}

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

export type ModelName =
  "arty"
  | "cat"
  | "dog"
  | "dragon"
  | "feng_uang"
  | "kapio_koi"
  | "pet_blobfish"
  | "pet_mini_golem"
  | "pet_penguin"
  | "pet_ufo"
  | "pet_zombie_hand"
  | "rabbit"
  | "pet_ender_dragon"
  | "dancarok"
  | "ravirok"
  | "tedarok"
  | "pet_reindeer"
  | "mohiras"; // BOSS DRAGON

export type NotificationWebSiteResponse =
  {
    title: string,
    content: string,
    url: string,
  }

export enum WebHookType {
  "QDF" = "QDF",
  "EventPvp" = "EventPvp",
  "statusServer" = "statusServer",
  "adminShop" = "adminShop",
  "market" = "market",
}

export type EventType =
  'BOSS' | 'A VOS MARQUES' | 'TOTEM' | 'EGGHUNT' | 'KOTH' | 'BLACKMARKET'

export type WebHookThresholdCondition =
  'increasing'
  | 'decreasing'
  | 'aboveThreshold'
  | 'underThreshold'
  | 'increasingAboveThreshold'
  | 'decreaseAboveThreshold'
  | 'aboveQuantity'

export type DiscordUser =
  {
    id: string,
    username: string,
    discriminator: string,
    public_flags: number,
    flags?: number,
    banner?: string,
    accent_color?: number | null,
    global_name: string | null,
    avatar_decoration_data: string,
    banner_color: string,
    avatar: string | null,
    clan: string,
    primary_guild: string,
    mfa_enabled?: boolean,
    locale?: string,
    premium_type?: number,
  }

export type WebhookDiscord = {
  url: string,
  guild_id: string,
  channel_id: string,
  failedConsecutive: number,
  server_name: string,
  channel_name: string,
}

export type WebHookAlert = {
  id: number;
  webhook: WebhookDiscord;
  content: string | null;
  embed: string | null;
  title: string | null;
  type: WebHookType;
  alreadySatisfied: boolean | null;
  endDate: number | null;
  enumEvent: EventType | null;
  item: Item | null;
  threshold: number | null;
  thresholdCondition:
    WebHookThresholdCondition
    | null;
}

export type WebHookCreate = {
  id: number | null;
  url: string,
  content: string | null;
  embed: string | null;
  title: string | null;
  type: WebHookType;
  enumEvent: EventType | null;
  itemName: string | null;
  threshold: number | null;
  thresholdCondition:
    WebHookThresholdCondition
    | null;
}

export type NavBarCategory = "Statistiques et données" | "Outils" | "Informations et gestion";

export const getItemFromName = (itemName: string) => {
  switch (itemName) {
    case 'amethyst-ingot':
      return 'amethyst-ingot';
    case 'apple':
      return 'apple';
    case 'beefCooked':
      return 'cooked-beef';
    case 'blazeRod':
      return 'blaze-rod';
    case 'bone':
      return 'bone';
    case 'carrots':
      return 'carrot';
    case 'coal':
      return 'coal';
    case 'diamond':
      return 'diamond';
    case 'dyePowder-black':
      return 'dye';
    case 'egg':
      return 'egg';
    case 'emerald':
      return 'emerald';
    case 'enderPearl':
      return 'ender-pearl';
    case 'feather':
      return 'feather';
    case 'fermentedSpiderEye':
      return 'fermented-spider-eye';
    case 'findium':
      return 'findium';
    case 'flint':
      return 'flint';
    case 'ghastTear':
      return 'ghast-tear';
    case 'ingotGold':
      return 'gold-ingot';
    case 'ingotIron':
      return 'iron-ingot';
    case 'leather':
      return 'leather';
    case 'melon':
      return 'melon';
    case 'netherquartz':
      return 'quartz';
    case 'netherStalkSeeds':
      return 'nether-wart';
    case 'paladium-ingot':
      return 'paladium-ingot';
    case 'potato':
      return 'potato';
    case 'redstone':
      return 'redstone';
    case 'reeds':
      return 'reeds';
    case 'seeds':
      return 'wheat-seeds';
    case 'skull-wither':
      return 'skull-1';
    case 'slimeball':
      return 'slime-ball';
    case 'spiderEye':
      return 'spider-eye';
    case 'string':
      return 'string';
    case 'sulphur':
      return 'gunpowder';
    case 'tile-cactus':
      return 'cactus';
    case 'tile-cloth-white':
      return 'wool';
    case 'tile-dirt-default':
      return 'dirt';
    case 'tile-hellsand':
      return 'soul-sand';
    case 'tile-log-oak':
      return 'log';
    case 'tile-mushroom':
      return 'red-mushroom'; // Assumes red-mushroom by default
    case 'tile-obsidian':
      return 'obsidian';
    case 'tile-sand-default':
      return 'sand';
    case 'tile-stonebrick':
      return 'cobblestone';
    case 'titane-ingot':
      return 'titane-ingot';
    case 'yellowDust':
      return 'glowstone-dust';
    case 'tile-passifwither-head':
      return 'tile-passifwither-head';
    default:
      return 'paladium-ingot';
  }
};
