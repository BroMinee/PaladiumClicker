import { Clicker } from "./clicker";
import { ClickerModelChanges } from "./clicker";
import { Hashable } from "./hashable";
import { Model } from "./model";
import { TimeModelChanges } from "./time";

export interface UpgradeProps {
  name: string;
  index: number;
  active_index: number[];
  clicker: Model<Clicker, ClickerModelChanges>;
  price: number;
  dayCondition: number;
}

export enum UpgradeModelChanges {
  OWN = "UPGRADE_OWN",
  CAN_BUY = "UPGRADE_CAN_BUY",
  DAY_CONDITION = "UPGRADE_DAY_CONDITION",
}

/**
 * Represents a generic upgrade in the clicker game.
 */
export class Upgrade extends Model<Upgrade, UpgradeModelChanges> implements Hashable {
  private _own: boolean;
  private _canBuy: boolean;
  private previousDateStack: Date[];
  _hasDayCondition: boolean;

  dict: { [key in UpgradeModelChanges]: () => string | boolean | number } = {
    [UpgradeModelChanges.CAN_BUY]: () => this.canBuy,
    [UpgradeModelChanges.DAY_CONDITION]: () => this.hasDayCondition,
    [UpgradeModelChanges.OWN]: () => this.own,
  };

  /**
   * Creates a new upgrade.
   * @param props The properties of the upgrade.
   */
  constructor(readonly props: UpgradeProps) {
    super();
    this._own = false;
    this._canBuy = false;
    this.previousDateStack = [];
    this._hasDayCondition = this.props.dayCondition === 0;
    this.internalSetupSubscription();
  }

  /**
   * Returns the upgrade itself.
   * @returns The upgrade.
   */
  getValue(): Upgrade {
    return this;
  }

  /**
   * Creates a copy of the upgrade.
   * @returns A copy of the upgrade.
   */
  copy(): Upgrade {
    return {
      ...this,
      own: this.own,
      canBuy: this.canBuy,
      hasDayCondition: this.hasDayCondition,
    };
  }

  /**
   * Whether the upgrade is owned.
   */
  get own() {
    return this._own;
  }

  /**
   * Whether the upgrade can be bought.
   */
  get canBuy() {
    return this._canBuy;
  }

  /**
   * Whether the day condition for the upgrade is met.
   */
  get hasDayCondition() {
    return this._hasDayCondition;
  }

  /**
   * Sets whether the upgrade is owned.
   * @param own Whether the upgrade is owned.
   */
  set own(own: boolean) {
    if(own) {
      this.props.clicker.getValue().time.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, `[Upgrade] ${this.props.name} upgrade owned`, (e) => {
        this.previousDateStack.push(e.currentDate);
        e.currentDate = e.currentDate.getTime() + (this.props.price  * 1.33 / this.props.clicker.getValue().RPS()) * 1000;
      });
    } else {
      this.props.clicker.getValue().time.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, `[Upgrade] ${this.props.name} upgrade owned`, (e) => {
        if(this.previousDateStack.length === 0) {
          throw new Error("[Amélioration] impossible de récupérer la dernière date car la pile est vide");
        }
        e.currentDate = this.previousDateStack.pop()!;
      });
    }
    this._own = own;
  }

  /**
   * Sets whether the upgrade can be bought.
   * @param canBuy Whether the upgrade can be bought.
   */
  set canBuy(canBuy: boolean) {
    this._canBuy = canBuy;
  }

  protected setupDayConditionSubscription(label: string, getCondition: () => boolean): void {
    this.subscribe(UpgradeModelChanges.DAY_CONDITION, `[${label}] ${this.props.name} day changes`, ({ newValue }) => {
      if (newValue.hasDayCondition === false && newValue.own) {
        throw new Error(`[${label}] ${this.props.name} possédée mais pas assez de jours de connexion pour la posséder`);
      }
      this.applyChanges(UpgradeModelChanges.CAN_BUY, `[${label}] ${this.props.name} can/cannot buy`, (e) => {
        e.canBuy = getCondition() && newValue.hasDayCondition;
      });
    });
  }

  private internalSetupSubscription(): void {
    this.props.clicker.getValue().time.subscribe(TimeModelChanges.DAYCHANGE, "[Upgrade] day changes", ({ newValue }) => {
      this.applyChanges(UpgradeModelChanges.DAY_CONDITION, "[Upgrade] change day condition", (e) => {
        e._hasDayCondition = this.props.dayCondition <= newValue.daySinceBeggining;
      });
    });

    this.subscribe(UpgradeModelChanges.OWN, `[Upgrade] ${this.props.name} own changes`, ({ newValue }) => {
      if (newValue.own) {
        this.props.clicker.applyChanges(ClickerModelChanges.TOTAL_SPEND, `[Upgrade] ${this.props.name} upgrade owned`, (e) => {
          e.total_spend += this.props.price;
        });
      } else {
        this.props.clicker.applyChanges(ClickerModelChanges.TOTAL_SPEND, `[Upgrade] ${this.props.name} upgrade not owned`, (e) => {
          e.total_spend -= this.props.price;
        });
      }
    });
  }
}
