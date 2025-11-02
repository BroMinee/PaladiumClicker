import { PlayerInfo } from "./player-info";

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

export type ConditionWithCoins = CPS["condition"] | GlobalUpgrade["condition"];

export type ConditionWithIndex = ManyUpgrade["condition"] |
  PosteriorUpgrade["condition"] |
  CategoryUpgrade["condition"] |
  BuildingUpgrade["condition"] |
  TerrainUpgrade["condition"];

export type ConditionWithOwn = BuildingUpgrade["condition"] |
  ManyUpgrade["condition"] |
  PosteriorUpgrade["condition"] |
  CategoryUpgrade["condition"];

export type ConditionWithDay = ManyUpgrade["condition"] |
  PosteriorUpgrade["condition"] |
  TerrainUpgrade["condition"] |
  GlobalUpgrade["condition"] |
  CPS["condition"] |
  CategoryUpgrade["condition"];

export type AnyCondition = ConditionWithCoins | ConditionWithIndex | ConditionWithOwn | ConditionWithDay;

export type UpgradeKey = keyof Pick<PlayerInfo,
  "global_upgrade" |
  "building_upgrade" |
  "category_upgrade" |
  "many_upgrade" |
  "posterior_upgrade" |
  "terrain_upgrade">;

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

export type bestPurchaseInfoDetailedDebug =
  bestPurchaseInfo &
  {
    timeToBuy: number,
    newRps: number,
    price: number
  }

export type buildingPathType =
  "building_upgrade"
  | "category_upgrade"
  | "global_upgrade"
  | "many_upgrade"
  | "terrain_upgrade"
  | "posterior_upgrade";

export type PaladiumClickerData = {
    uuid: string,
    buildings: Array<{
      name: string,
      production: number,
      quantity: number
    }>,
    upgrades: string[]
  }