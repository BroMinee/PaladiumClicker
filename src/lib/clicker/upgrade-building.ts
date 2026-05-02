import { Building, BuildingModelChanges } from "./building";
import { Upgrade, UpgradeModelChanges, UpgradeProps } from "./upgrade";

export interface UpgradeBuildingConfig {
  threshold: number;
  label: string;
  buildingChangeKey: BuildingModelChanges;
  applyEffect: (e: Building, own: boolean) => void;
}

/**
 * An upgrade that affects one or more buildings.
 */
export abstract class UpgradeBuilding extends Upgrade {
  protected abstract getBuildingConfig(): UpgradeBuildingConfig;

  /**
   * Creates a new building upgrade.
   * @param props The properties of the upgrade.
   */
  constructor(readonly props: UpgradeProps) {
    super(props);
  }

  protected setupBuildingSubscription(): void {
    const { threshold, label, buildingChangeKey, applyEffect } = this.getBuildingConfig();

    // [CAN_BUY] subscribe COUNT on each active building
    this.props.active_index.forEach(active_index => {
      this.props.clicker.getValue().buildings[active_index].subscribe(
        BuildingModelChanges.COUNT,
                `[${label}] ${this.props.name} can buy changes`,
                ({ newValue }) => {
                  if (newValue.count >= threshold && this.canBuy === false && this.hasDayCondition) {
                    this.applyChanges(UpgradeModelChanges.CAN_BUY, `[${label}] ${this.props.name} can buy`, (e) => {
                      e.canBuy = true;
                    });
                  } else if ((this.hasDayCondition === false || newValue.count < threshold) && this.canBuy === true) {
                    this.applyChanges(UpgradeModelChanges.CAN_BUY, `[${label}] ${this.props.name} cannot be buy`, (e) => {
                      e.canBuy = false;
                    });
                  }
                  if ((newValue.count < threshold || this.hasDayCondition === false) && this.own) {
                    throw new Error(`[${label}] ${this.props.name} possédée mais pas assez de bâtiments pour la posséder`);
                  }
                }
      );
    });

    // [DAY_CONDITION] delegate to the helper of the Upgrade class
    this.setupDayConditionSubscription(label, () =>
      this.props.active_index.every(idx =>
        this.props.clicker.getValue().buildings[idx].count >= threshold
      )
    );

    // [OWN] apply the effect on the buildings
    this.subscribe(UpgradeModelChanges.OWN, `[${label}] ${this.props.name} own changes`, ({ newValue }) => {
      if ((this.props.clicker.getValue().buildings[this.props.index].count < threshold || this.hasDayCondition === false) && newValue.own) {
        throw new Error(`[${label}] ${this.props.name} possédée mais pas assez de bâtiments pour la posséder`);
      }
      this.props.active_index.forEach(active_index => {
        this.props.clicker.getValue().buildings[active_index].applyChanges(
          buildingChangeKey,
                    `[${label}] ${this.props.name} upgrade ${newValue.own ? "owned" : "not owned"}`,
                    (e) => applyEffect(e, newValue.own)
        );
      });
    });
  }
}
