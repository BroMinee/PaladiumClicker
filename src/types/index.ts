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
  own: number | boolean,
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
  faction: string,
  firstJoin: number,
  money: number,
  timePlayed: number,
  username: string,
  uuid: string,
  rank: string
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
  friends: Array<{ name: string }>,
  jobs: {
    alchemist: {
      level: number,
      xp: number
    },
    farmer: {
      level: number,
      xp: number
    },
    hunter: {
      level: number,
      xp: number
    },
    miner: {
      level: number,
      xp: number
    }
  },
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

export type New = {
  date: string,
  events: string[]
}