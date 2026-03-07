import { ClickerModelChanges } from "./clicker";
import { Upgrade, UpgradeModelChanges, UpgradeProps } from "./upgrade";

export interface UpgradeGlobalProps extends UpgradeProps {
  coinCondition: number;
}

/**
 * Represents an upgrade that affects the global production.
 */
export class UpgradeGlobal extends Upgrade {
  /**
   * Returns the upgrade itself.
   * @returns The upgrade.
   */
  getValue(): UpgradeGlobal {
    return this;
  }

  /**
   * Creates a new global upgrade.
   * @param props The properties of the upgrade.
   */
  constructor(readonly props: UpgradeGlobalProps) {
    super(props);
    this.setupSubscription();
  }

  private setupSubscription(): void {
    // [CAN_BUY] subscribe to clicker total spent value to see if we can buy the upgrade
    this.props.clicker.subscribe(ClickerModelChanges.TOTAL_SPEND, `[Upgrade Global] ${this.props.name} can buy changes`, ({ newValue }) => {
      if(newValue.total_spend >= this.props.coinCondition && this.canBuy === false && this.hasDayCondition) {
        this.applyChanges(UpgradeModelChanges.CAN_BUY, `[Upgrade Global] ${this.props.name} can buy`, (e) => {
          e.canBuy = true;
        });
      } else if ((this.hasDayCondition === false || newValue.total_spend < this.props.coinCondition) && this.canBuy === true) {
        this.applyChanges(UpgradeModelChanges.CAN_BUY, `[Upgrade Global] ${this.props.name} cannot be buy`, (e) => {
          e.canBuy = false;
        });
      }
      if((this.hasDayCondition === false || newValue.total_spend < this.props.coinCondition) && this.own) {
        throw new Error(`[Upgrade Global] ${this.props.name} owned but not spent enough to own it`);
      }
    });

    this.setupDayConditionSubscription("Upgrade Global", () =>
      this.props.clicker.getValue().total_spend >= this.props.coinCondition
    );

    // [OWN] subscribe to own changes to apply the upgrade effects
    this.subscribe(UpgradeModelChanges.OWN, `[Upgrade Global] ${this.props.name} own changes`, ({ newValue }) => {
      if ((this.props.clicker.getValue().total_spend < this.props.coinCondition || this.hasDayCondition === false) && newValue.own) {
        throw new Error(`[Upgrade Global] ${this.props.name} owned but not spent enough to own it`);
      }

      if(newValue.own) {
        this.props.clicker.applyChanges(ClickerModelChanges.BONUS_POURCENTAGE, `[Upgrade Global] ${this.props.name} upgrade owned`, (e) => {
          e.global_bonus += 0.1;
        });
      } else {
        this.props.clicker.applyChanges(ClickerModelChanges.BONUS_POURCENTAGE, `[Upgrade Global] ${this.props.name} upgrade not owned`, (e) => {
          e.global_bonus -= 0.1;
        });
      }
    });
  }
}
