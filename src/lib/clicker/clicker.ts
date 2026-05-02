import { MetierKey } from "@/types/profil";
import { Building, BuildingModelChanges, BuildingProps } from "./building";
import { Hashable } from "./hashable";
import { Model } from "./model";
import { Time } from "./time";
import { Upgrade, UpgradeModelChanges } from "./upgrade";
import { Upgrade100, Upgrade100Props } from "./upgrade100";
import { Upgrade200, Upgrade200Props } from "./upgrade200";
import { UpgradeCategory, UpgradeCategoryProps } from "./upgrade-category";
import { UpgradeGlobal, UpgradeGlobalProps } from "./upgrade-global";
import { UpgradeMany, UpgradeManyProps } from "./upgrade-many";
import { UpgradePosterior, UpgradePosteriorProps } from "./upgrade-posterior";
import { UpgradeTerrain, UpgradeTerrainProps } from "./upgrade-terrain";

export interface ClickerProps {
  buildings: Array<Omit<BuildingProps, "clicker">>;
  upgrade_100: Array<Omit<Upgrade100Props, "clicker">>;
  upgrade_200: Array<Omit<Upgrade200Props, "clicker">>;
  upgrade_many: Array<Omit<UpgradeManyProps, "clicker">>;
  upgrade_posterior: Array<Omit<UpgradePosteriorProps, "clicker">>;
  upgrade_category: Array<Omit<UpgradeCategoryProps, "clicker">>;
  upgrade_global: Array<Omit<UpgradeGlobalProps, "clicker">>;
  upgrade_terrain: Array<Omit<UpgradeTerrainProps, "clicker">>;
  starting_date: Date;
}

export enum ClickerModelChanges {
  RPS = "CLICKER_RPS",
  BONUS_POURCENTAGE = "CLICKER_BONUS_POURCENTAGE",
  TOTAL_SPEND = "CLICKER_TOTAL_SPENT",
  METIER_FARMER = "CLICKER_METIER_FARMER",
  METIER_HUNTER = "CLICKER_METIER_HUNTER",
  METIER_ALCHEMIST = "CLICKER_METIER_ALCHEMIST",
  METIER_MINER = "CLICKER_METIER_MINER",
}

export const METIER_EVENT_MAP: Record<MetierKey, ClickerModelChanges> = {
  farmer: ClickerModelChanges.METIER_FARMER,
  hunter: ClickerModelChanges.METIER_HUNTER,
  alchemist: ClickerModelChanges.METIER_ALCHEMIST,
  miner: ClickerModelChanges.METIER_MINER,
};

export type ClickerStepResult = {
  name: string;
  rps: number;
  time: number;
  path: "building" | "building_upgrade" | "many_upgrade" | "posterior_upgrade" | "category_upgrade" | "global_upgrade" | "terrain_upgrade";
  index: number;
  own: number | boolean;
  price: number;
};

/**
 * Represents the main clicker game state
 */
export class Clicker extends Model<Clicker, ClickerModelChanges> implements Hashable {
  private _buildings: Building[];
  private _upgrade_100: Upgrade100[];
  private _upgrade_200: Upgrade200[];
  private _upgrade_many: UpgradeMany[];
  private _upgrade_posterior: UpgradePosterior[];
  private _upgrade_category: UpgradeCategory[];
  private _upgrade_global: UpgradeGlobal[];
  private _upgrade_terrain: UpgradeTerrain[];
  private _metier: Record<MetierKey, number>;
  private _timeModel: Time;
  private _rps: number;
  private _global_bonus: number;
  private _total_spend: number;

  dict: { [key in ClickerModelChanges]: () => number } = {
    [ClickerModelChanges.RPS]: () => this.rps,
    [ClickerModelChanges.BONUS_POURCENTAGE]: () => this.global_bonus,
    [ClickerModelChanges.TOTAL_SPEND]: () => this.total_spend,
    [ClickerModelChanges.METIER_FARMER]: () => this.metier.farmer,
    [ClickerModelChanges.METIER_HUNTER]: () => this.metier.hunter,
    [ClickerModelChanges.METIER_ALCHEMIST]: () => this.metier.alchemist,
    [ClickerModelChanges.METIER_MINER]: () => this.metier.miner,
  };

  /**
   * Creates a new Clicker game
   * @param props The properties of the clicker game
   */
  constructor(readonly props: ClickerProps) {
    super();
    this._timeModel = new Time({ startingSeason: props.starting_date });
    this._buildings = this.props.buildings.map(buildingProps => new Building({ ...buildingProps, clicker: this }));
    this._upgrade_100 = this.props.upgrade_100.map(upgradeProps => new Upgrade100({ ...upgradeProps, clicker: this }));
    this._upgrade_200 = this.props.upgrade_200.map(upgradeProps => new Upgrade200({ ...upgradeProps, clicker: this }));
    this._upgrade_many = this.props.upgrade_many.map(upgradeProps => new UpgradeMany({ ...upgradeProps, clicker: this }));
    this._upgrade_posterior = this.props.upgrade_posterior.map(upgradeProps => new UpgradePosterior({ ...upgradeProps, clicker: this }));
    this._upgrade_category = this.props.upgrade_category.map(upgradeProps => new UpgradeCategory({ ...upgradeProps, clicker: this }));
    this._upgrade_global = this.props.upgrade_global.map(upgradeProps => new UpgradeGlobal({ ...upgradeProps, clicker: this }));
    this._upgrade_terrain = this.props.upgrade_terrain.map(upgradeProps => new UpgradeTerrain({ ...upgradeProps, clicker: this }));
    this._rps = 0.5;
    this._global_bonus = 0;
    this._total_spend = 0;
    this._metier = {
      farmer: 1,
      hunter: 1,
      alchemist: 1,
      miner: 1,
    };
    this.setupSubscription();
  }

  /**
   * Returns the clicker game state
   * @returns The clicker game state
   */
  getValue(): Clicker {
    return this;
  }

  /**
   * Creates a copy of the clicker game state
   * @returns A copy of the clicker game state
   */
  copy(): Clicker {
    return {
      ...this,
      buildings: this.buildings,
      upgrade_100: this.upgrade_100,
      rps: this.rps,
      global_bonus: this.global_bonus,
      total_spend: this.total_spend,
      metier: { ...this.metier },
    };
  }

  /**
   * The buildings in the game
   */
  get buildings() {
    return this._buildings;
  }

  /**
   * The 100 upgrades in the game
   */
  get upgrade_100() {
    return this._upgrade_100;
  }

  /**
   * The 200 upgrades in the game
   */
  get upgrade_200() {
    return this._upgrade_200;
  }

  /**
   * The resources per second
   */
  get rps() {
    return this._rps;
  }

  /**
   * The global bonus percentage
   */
  get global_bonus() {
    return this._global_bonus;
  }

  /**
   * The many upgrades in the game
   */
  get upgrade_many() {
    return this._upgrade_many;
  }

  /**
   * The posterior upgrades in the game
   */
  get upgrade_posterior() {
    return this._upgrade_posterior;
  }

  /**
   * The category upgrades in the game
   */
  get upgrade_category() {
    return this._upgrade_category;
  }

  /**
   * The global upgrades in the game
   */
  get upgrade_global() {
    return this._upgrade_global;
  }

  /**
   * The terrain upgrades in the game
   */
  get upgrade_terrain() {
    return this._upgrade_terrain;
  }

  /**
   * The total amount of resources spent
   */
  get total_spend() {
    return this._total_spend;
  }

  /**
   * The metier levels
   */
  get metier() {
    return this._metier;
  }

  /**
   * The time model
   */
  get time() {
    return this._timeModel;
  }

  /**
   * Sets the resources per second
   * @param rps The new resources per second
   */
  set rps(rps: number) {
    this._rps = rps;
  }

  /**
   * Sets the global bonus percentage
   * @param global_bonus The new global bonus percentage
   */
  set global_bonus(global_bonus: number) {
    this._global_bonus = global_bonus;
  }

  /**
   * Sets the total amount of resources spent
   * @param total_spend The new total amount of resources spent
   */
  set total_spend(total_spend: number) {
    this._total_spend = total_spend;
  }

  private setupSubscription(): void {
    // sub production
    this.buildings.forEach(building => {
      building.subscribe(BuildingModelChanges.PRODUCTION, `[clicker] building production changes ${building.props.name}`, ({ oldValue, newValue }) => {
        if (oldValue.production !== newValue.production) {
          this.applyChanges(ClickerModelChanges.RPS, `[Building] ${newValue.props.name} production change`, (e) => {
            e.rps += newValue.production - oldValue.production;
          });
        }
      });
    });

    this.upgrade_posterior.forEach(upgrade => {
      this.buildings[upgrade.props.index].subscribePreviousBuilding();
    });
  }

  /**
   * Returns the resources per second
   * @returns The resources per second
   */
  public RPS(): number {
    return this.getValue().rps;
  }

  /**
   * Returns the total amount of resources spent
   * @returns The total amount of resources spent
   */
  public TotalSpend(): number {
    return this.getValue().total_spend + 0;
  }

  /**
   * Sets the level of a metier
   * @param metier The metier to set the level of
   * @param level The new level
   */
  public setMetierLevel(metier: MetierKey, level: number): void {
    if (level <= 0) {
      throw new Error(`[Métier] impossible de définir ${metier} au niveau ${level}. Le niveau doit être supérieur à 0`);
    }
    this.applyChanges(METIER_EVENT_MAP[metier], `[Clicker] set metier ${metier} to level ${level}`, (e) => {
      e.metier[metier] = level;
    });
  }

  /**
   * Computes the best building to buy `achatCount` times
   * @param achatCount The number of buildings to buy
   * @returns An array of objects containing purchase details
   */
  public computeXBuildingAhead(achatCount: number): ClickerStepResult[] {
    const result: ClickerStepResult[] = [];
    for (let i = 0; i < achatCount; i++) {
      const RPSBefore = this.RPS();
      let bestRPSPerDollar = 0;
      let bestPurchase: Building | Upgrade | undefined;

      this.buildings.every((building) => {
        if (building.count >= 99) {
          return true;
        }

        if (building.count < 99) {
          building.applyChanges(BuildingModelChanges.COUNT, "purchase 1 building", e => {
            e.count += 1;
          });
        }

        const newRPSPerDollar = (this.RPS() - RPSBefore) / building.computePrice(building.count -1);
        if (bestRPSPerDollar < newRPSPerDollar) {
          bestRPSPerDollar = newRPSPerDollar;
          bestPurchase = building;
        }

        building.applyChanges(BuildingModelChanges.COUNT, "unpurchase 1 building", e => {
          e.count -= 1;
        });

        return building.count !== 0;
      });

      const upgrade_list = ["upgrade_100", "upgrade_200", "upgrade_many", "upgrade_posterior", "upgrade_category", "upgrade_global", "upgrade_terrain"] as const;

      upgrade_list.forEach(upgrade_type => {
        this[upgrade_type].forEach((upgrade) => {
          if (upgrade.canBuy && upgrade.own === false) {
            upgrade.applyChanges(UpgradeModelChanges.OWN, "purchase the upgrade", e => {
              e.own = true;
            });

            const newRPSPerDollar = (this.RPS() - RPSBefore) / upgrade.props.price;
            if (bestRPSPerDollar < newRPSPerDollar) {
              bestRPSPerDollar = newRPSPerDollar;
              bestPurchase = upgrade;
            }

            if (upgrade.canBuy) {
              upgrade.applyChanges(UpgradeModelChanges.OWN, "unpurchase the upgrade", e => {
                e.own = false;
              });
            }
          }
        });
      });

      if (bestPurchase === undefined) {
        break;
      }
      if(bestPurchase instanceof Building) {
        bestPurchase.applyChanges(BuildingModelChanges.COUNT, "finally upgrade", e => {
          e.count +=1;
        });
      } else {
        bestPurchase.applyChanges(UpgradeModelChanges.OWN, "finally upgrade", e => {
          e.own = true;
        });
      }

      let path: "building" | "building_upgrade" | "many_upgrade" | "posterior_upgrade" | "category_upgrade" | "global_upgrade" | "terrain_upgrade";
      let index: number;
      let own: number | boolean;
      let price: number;

      if (bestPurchase instanceof Building) {
        path = "building";
        index = this.buildings.indexOf(bestPurchase);
        own = bestPurchase.count;
        price = bestPurchase.computePrice(bestPurchase.count - 1);
      } else if (bestPurchase instanceof Upgrade100) {
        path = "building_upgrade";
        index = this.upgrade_100.indexOf(bestPurchase);
        own = true;
        price = bestPurchase.props.price;
      } else if (bestPurchase instanceof Upgrade200) {
        path = "building_upgrade";
        index = this.upgrade_200.indexOf(bestPurchase) + 16;
        own = true;
        price = bestPurchase.props.price;
      } else if (bestPurchase instanceof UpgradeMany) {
        path = "many_upgrade";
        index = this.upgrade_many.indexOf(bestPurchase);
        own = true;
        price = bestPurchase.props.price;
      } else if (bestPurchase instanceof UpgradePosterior) {
        path = "posterior_upgrade";
        index = this.upgrade_posterior.indexOf(bestPurchase);
        own = true;
        price = bestPurchase.props.price;
      } else if (bestPurchase instanceof UpgradeCategory) {
        path = "category_upgrade";
        index = this.upgrade_category.indexOf(bestPurchase);
        own = true;
        price = (bestPurchase as UpgradeCategory).props.price;
      } else if (bestPurchase instanceof UpgradeGlobal) {
        path = "global_upgrade";
        index = this.upgrade_global.indexOf(bestPurchase);
        own = true;
        price = (bestPurchase as UpgradeGlobal).props.price;
      } else {
        path = "terrain_upgrade";
        index = this.upgrade_terrain.indexOf(bestPurchase as UpgradeTerrain);
        own = true;
        price = (bestPurchase as UpgradeTerrain).props.price;
      }

      result.push({
        name: bestPurchase.props.name,
        rps: this.RPS(),
        time: this.time.currentDate.getTime(),
        path,
        index,
        own,
        price,
      });
    }
    return result;
  }
}
