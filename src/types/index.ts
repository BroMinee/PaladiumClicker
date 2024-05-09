export type Metier = {
  name: string,
  level: number,
  xp: number
}

export type Building = {
  name: string,
  own: number,
  price?: number,
}

export type BuildingUpgrade = {
  name: string,
  own: boolean,
  price?: number,
  condition?: string,
}

export type CategoryUpgrade = {
  name: string,
  own: boolean,
  price?: number,
  condition?: string,
}

export type CPS = {
  name: string,
  own: boolean,
  index?: number,
  condition?: string,
  price?: number,
}

export type GlobalUpgrade = {
  name: string,
  own: boolean,
  price?: number,
  condition?: string,
}

export type ManyUpgrade = {
  name: string,
  own: boolean,
  price?: number,
  condition?: string,
}

export type PosteriorUpgrade = {
  name: string,
  own: boolean,
  price?: number,
  condition?: string,
}

export type TerrainUpgrade = {
  name: string,
  own: boolean,
  price?: number,
  condition?: string,
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