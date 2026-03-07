import { Clicker } from "./clicker";
import { ClickerModelChanges } from "./clicker";
import { Hashable } from "./hashable";
import { Model } from "./model";
import { TimeModelChanges } from "./time";

export interface BuildingProps {
  name: string;
  clicker: Model<Clicker, ClickerModelChanges>;
  price: number;
  index: number;
}

export enum BuildingModelChanges {
  COUNT = "BUILDING_COUNT",
  PRODUCTION = "BUILDING_PRODUCTION",
  UPGRADE_100 = "BUILDING_UPGRADE_100",
  UPGRADE_200 = "BUILDING_UPGRADE_200",
  UPGRADE_MANY = "BUILDING_UPGRADE_MANY",
  UPGRADE_POSTERIOR = "BUILDING_UPGRADE_POSTERIOR",
  UPGRADE_CATEGORY = "BUILDING_UPGRADE_CATEGORY",
  UPGRADE_TERRAIN = "BUILDING_UPGRADE_TERRAIN",
}

/**
 * Get the base production of a building at a given index
 * @param index The index of the building
 * @returns The base production
 */
export function getBaseProduction(index: number): number {
  return 0.10000000149011612 * Math.pow(1.7999999523162842, index);
}

/**
 * Represents a building in the clicker
 */
export class Building extends Model<Building, BuildingModelChanges> implements Hashable {
  private _count: number;
  private _production: number;
  private _upgrade_100: boolean;
  private _upgrade_200: boolean;
  private _upgrade_many: boolean;
  private _upgrade_posterior: boolean;
  private _upgrade_category: number;
  private _upgrade_terrain: number;
  private previousDateStack: Date[];
  private prices: number[];
  base_production: number;

  dict: { [key in BuildingModelChanges]: () => string | boolean | number } = {
    [BuildingModelChanges.COUNT]: () => this.count,
    [BuildingModelChanges.PRODUCTION]: () => this.production,
    [BuildingModelChanges.UPGRADE_100]: () => this.upgrade_100,
    [BuildingModelChanges.UPGRADE_200]: () => this.upgrade_200,
    [BuildingModelChanges.UPGRADE_CATEGORY]: () => this.upgrade_category,
    [BuildingModelChanges.UPGRADE_MANY]: () => this.upgrade_many,
    [BuildingModelChanges.UPGRADE_POSTERIOR]: () => this.upgrade_posterior,
    [BuildingModelChanges.UPGRADE_TERRAIN]: () => this.upgrade_terrain,
  };

  /**
   * Creates a new building
   * @param props The properties of the building
   */
  constructor(readonly props: BuildingProps) {
    super();
    this._count = 0;
    this._production = 0;
    this._upgrade_100 = false;
    this._upgrade_200 = false;
    this._upgrade_many = false;
    this._upgrade_posterior = false;
    this._upgrade_category = 0;
    this._upgrade_terrain = 0;
    this.previousDateStack = [];
    this.prices = [];
    for(let i = 0; i < 100; i++) {
      this.prices.push(Math.round(this.props.price * Math.pow(1.100000023841858, i)));
    }
    this.base_production = getBaseProduction(this.props.index);
    this.setupSubscription();
  }

  /**
   * Returns the building itself
   * @returns The building
   */
  getValue(): Building {
    return this;
  }

  /**
   * Creates a copy of the building
   * @returns A copy of the building
   */
  copy(): Building {
    return {
      ...this,
      count: this.count,
      production: this.production,
    };
  }

  /**
   * The number of buildings of this type
   */
  get count() {
    return this._count;
  }

  /**
   * The production of the building
   */
  get production() {
    return this._production;
  }

  /**
   * Whether the building has the 100 upgrade
   */
  get upgrade_100() {
    return this._upgrade_100;
  }

  /**
   * Whether the building has the 200 upgrade
   */
  get upgrade_200() {
    return this._upgrade_200;
  }

  /**
   * Whether the building has the many upgrade
   */
  get upgrade_many() {
    return this._upgrade_many;
  }

  /**
   * Whether the building has the posterior upgrade
   */
  get upgrade_posterior() {
    return this._upgrade_posterior;
  }

  /**
   * The category of the building
   */
  get upgrade_category() {
    return this._upgrade_category;
  }

  /**
   * The terrain of the building
   */
  get upgrade_terrain() {
    return this._upgrade_terrain;
  }

  /**
   * Sets the number of buildings
   * @param count The new number of buildings
   */
  set count(count: number) {
    if (count < 0 || count > 99) {
      throw new Error(`[Building] ${this.props.name} count cannot be ${count}. Must be between [0, 99]`);
    }

    if(count > this._count) {
      this.props.clicker.getValue().time.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, `[Building] ${this.props.name} upgrade owned`, (e) => {
        this.previousDateStack.push(e.currentDate);
        e.currentDate = e.currentDate.getTime() + (this.computePrice(count -1) * 1.33 / this.props.clicker.getValue().RPS()) * 1000;
      });
    } else {
      this.props.clicker.getValue().time.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, `[Building] ${this.props.name} upgrade owned`, (e) => {
        if(this.previousDateStack.length === 0) {
          throw new Error("[Building] cannot get last time since array is empty");
        }
        e.currentDate = this.previousDateStack.pop()!;
      });
    }
    this._count = count;
  }

  /**
   * Sets the production of the building
   * @param production The new production
   */
  set production(production: number) {
    this._production = production;
  }

  /**
   * Sets whether the building has the 100 upgrade
   * @param upgrade_100 Whether the building has the 100 upgrade
   */
  set upgrade_100(upgrade_100: boolean) {
    this._upgrade_100 = upgrade_100;
  }

  /**
   * Sets whether the building has the 200 upgrade
   * @param upgrade_200 Whether the building has the 200 upgrade
   */
  set upgrade_200(upgrade_200: boolean) {
    this._upgrade_200 = upgrade_200;
  }

  /**
   * Sets whether the building has the many upgrade
   * @param upgrade_many Whether the building has the many upgrade
   */
  set upgrade_many(upgrade_many: boolean) {
    this._upgrade_many = upgrade_many;
  }

  /**
   * Sets whether the building has the posterior upgrade
   * @param upgrade_posterior Whether the building has the posterior upgrade
   */
  set upgrade_posterior(upgrade_posterior: boolean) {
    this._upgrade_posterior = upgrade_posterior;
  }

  /**
   * Sets the category of the building
   * @param upgrade_category The new category
   */
  set upgrade_category(upgrade_category: number) {
    this._upgrade_category = upgrade_category;
  }

  /**
   * Sets the terrain of the building
   * @param upgrade_terrain The new terrain
   */
  set upgrade_terrain(upgrade_terrain: number) {
    this._upgrade_terrain = upgrade_terrain;
  }

  /**
   * Computes the price of the building at a given count
   * @param count The number of buildings
   * @returns The price of the building
   */
  public computePrice(count: number): number {
    return this.prices[count];
  }

  private updateProduction(): void {
    this.applyChanges(BuildingModelChanges.PRODUCTION, "updateProduction", (e) => {
      if (this.count <= 0) {
        e.production = 0;
        return;
      }

      const baseProduction = this.base_production;
      const posteriorBonus = this.upgrade_posterior ? this.props.clicker.getValue().buildings[this.props.index - 1].count * 0.01 : 0;
      const upgrade100Bonus = this.upgrade_100 ? 1 : 0;
      const upgrade200Bonus = this.upgrade_200 ? 1 : 0;
      const upgradeManyBonus = this.upgrade_many ? 0.01 * this.count : 0;
      const categoryBonus = this.upgrade_category;
      const terrainBonus = this.upgrade_terrain;
      const pourcentageBonus = 1 + this.props.clicker.getValue().global_bonus + posteriorBonus + upgrade100Bonus + upgrade200Bonus + upgradeManyBonus + categoryBonus + terrainBonus;
      e.production = baseProduction * pourcentageBonus * this.count;
    });
  }

  private setupSubscription() {
    // subscribe count
    this.subscribe(BuildingModelChanges.COUNT, `[Building] ${this.props.name} count changes`, ({ newValue }) => {
      if(newValue.count === 0) {
        // test that all the following building have count 0
        this.props.clicker.getValue().buildings.slice(this.props.index +1).forEach(building => {
          if(building.count > 0) {
            throw new Error(`Cannot sell building ${this.props.name} because a following building ${building.props.name} is still bought`);
          }
        });
      } else if(newValue.count > 0 && this.props.index !== 0) {
        const building = this.props.clicker.getValue().buildings[this.props.index - 1];
        if(this.props.index > 0 && building.count === 0) {
          throw new Error(`Cannot buy building ${this.props.name} because the previous building ${building.props.name} has not been bought`);
        }
      }
      this.updateProduction();
    });

    // subscribe upgrade 100
    this.subscribe(BuildingModelChanges.UPGRADE_100, `[Building] ${this.props.name} upgrade 100 changes`, () => {
      this.updateProduction();
    });

    // subscribe upgrade 200
    this.subscribe(BuildingModelChanges.UPGRADE_200, `[Building] ${this.props.name} upgrade 200 changes`, () => {
      this.updateProduction();
    });

    // subscribe upgrade many
    this.subscribe(BuildingModelChanges.UPGRADE_MANY, `[Building] ${this.props.name} upgrade many changes`, () => {
      this.updateProduction();
    });

    // subscribe upgrade posterior
    // NOTE: the previous building subscription is called in the Clicker class due to circular dependency
    this.subscribe(BuildingModelChanges.UPGRADE_POSTERIOR, `[Building] ${this.props.name} upgrade posterior changes`, () => {
      this.updateProduction();
    });

    // subscribe category
    this.subscribe(BuildingModelChanges.UPGRADE_CATEGORY, `[Building] ${this.props.name} category 1 changes`, () => {
      this.updateProduction();
    });

    // subscribe terrain
    this.subscribe(BuildingModelChanges.UPGRADE_TERRAIN, `[Building] ${this.props.name} terrain changes`, () => {
      this.updateProduction();
    });

    // subscribe to global_bonus changes
    this.props.clicker.subscribe(ClickerModelChanges.BONUS_POURCENTAGE, `[Building] ${this.props.name} global bonus changes`, () => {
      this.updateProduction();
    });

    this.subscribe(BuildingModelChanges.COUNT, `[Building] ${this.props.name} own changes`, ({ oldValue, newValue }) => {
      if (oldValue.count < newValue.count) {
        this.props.clicker.applyChanges(ClickerModelChanges.TOTAL_SPEND, `[Building] ${this.props.name} upgrade owned`, (e) => {
          let differencePrice = 0;
          for(let i = oldValue.count; i < newValue.count; i++) {
            differencePrice += this.computePrice(i);
          }
          e.total_spend += differencePrice;
        });
      } else {
        this.props.clicker.applyChanges(ClickerModelChanges.TOTAL_SPEND, `[Building] ${this.props.name} upgrade not owned`, (e) => {
          let differencePrice = 0;
          for(let i = newValue.count; i < oldValue.count; i++) {
            differencePrice += this.computePrice(i);
          }
          e.total_spend -= differencePrice;
        });
      }
    });
  }

  /**
   * Subscribes to the previous building's count changes
   * This is used to update the production when the posterior upgrade is active
   */
  public subscribePreviousBuilding(){
    this.props.clicker.getValue().upgrade_posterior.forEach(upgrade => {
      upgrade.props.active_index.forEach(active_index => {
        if (active_index === this.props.index) {
          this.props.clicker.getValue().buildings[active_index-1].subscribe(BuildingModelChanges.COUNT, `[Building] ${this.props.name} upgrade posterior previous building_count has changed`, () => {
            this.updateProduction();
          });
        }
      });
    });
  }
}
