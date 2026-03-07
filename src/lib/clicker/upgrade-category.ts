import { BuildingModelChanges } from "./building";
import { Upgrade, UpgradeModelChanges, UpgradeProps } from "./upgrade";

export interface UpgradeCategoryProps extends UpgradeProps {
  pourcentage: number;
}

/**
 * Represents an upgrade that affects a whole category of buildings.
 */
export class UpgradeCategory extends Upgrade {
  /**
   * Returns the upgrade itself.
   * @returns The upgrade.
   */
  getValue(): UpgradeCategory {
    return this;
  }

  /**
   * Creates a new category upgrade.
   * @param props The properties of the upgrade.
   */
  constructor(readonly props: UpgradeCategoryProps) {
    super(props);
    this.setupSubscription();
  }

  private getOwnCondition(): number {
    return this.props.pourcentage === 0.1 ? 1 : 3;
  }

  private setupSubscription(): void {
    // [CAN_BUY] subscribe to building count changes to see if we can buy the upgrade
    this.props.clicker.getValue().buildings[this.props.index].subscribe(BuildingModelChanges.COUNT, `[Upgrade Category] ${this.props.name} can buy changes`, ({ newValue }) => {
      const condition = this.getOwnCondition();
      if(newValue.count >= condition && this.canBuy === false && this.hasDayCondition) {
        this.applyChanges(UpgradeModelChanges.CAN_BUY, `[Upgrade Category] ${this.props.name} can buy`, (e) => {
          e.canBuy = true;
        });
      } else if ((this.hasDayCondition === false || newValue.count < condition) && this.canBuy === true) {
        this.applyChanges(UpgradeModelChanges.CAN_BUY, `[Upgrade Category] ${this.props.name} cannot be buy`, (e) => {
          e.canBuy = false;
        });
      }
      if((this.hasDayCondition === false || newValue.count < condition) && this.own) {
        throw new Error(`[Upgrade Category] ${this.props.name} owned but not enough buildings to own it`);
      }
    });

    this.setupDayConditionSubscription("Upgrade Category", () => {
      const condition = this.getOwnCondition();
      return this.props.clicker.getValue().buildings[this.props.index].count >= condition;
    });

    // [OWN] subscribe to own changes to apply the upgrade effects
    this.subscribe(UpgradeModelChanges.OWN, `[Upgrade Category] ${this.props.name} own changes`, ({ newValue }) => {
      const condition = this.getOwnCondition();
      if ((this.props.clicker.getValue().buildings[this.props.index].count < condition || this.hasDayCondition === false) && newValue.own) {
        throw new Error(`[Upgrade Category] ${this.props.name} owned but not enough buildings to own it`);
      }
      this.props.active_index.forEach(active_index => {
        if(newValue.own) {
          this.props.clicker.getValue().buildings[active_index].applyChanges(BuildingModelChanges.UPGRADE_CATEGORY, `[Upgrade Category] ${this.props.name} upgrade owned`, (e) => {
            e.upgrade_category += this.props.pourcentage;
          });
        } else {
          this.props.clicker.getValue().buildings[active_index].applyChanges(BuildingModelChanges.UPGRADE_CATEGORY, `[Upgrade Category] ${this.props.name} upgrade not owned`, (e) => {
            e.upgrade_category -= this.props.pourcentage;
          });
        }
      });

    });
  }
}
