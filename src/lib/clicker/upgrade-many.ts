import { BuildingModelChanges } from "./building";
import { UpgradeBuilding, UpgradeBuildingConfig } from "./upgrade-building";
import { UpgradeProps } from "./upgrade";

export type UpgradeManyProps = UpgradeProps

/**
 * Represents an upgrade that is applied when a certain number of buildings are owned.
 */
export class UpgradeMany extends UpgradeBuilding {
  /**
   * Returns the upgrade itself.
   * @returns The upgrade.
   */
  getValue(): UpgradeMany {
    return this;
  }

  /**
   * Creates a new "many" upgrade.
   * @param props The properties of the upgrade.
   */
  constructor(readonly props: UpgradeManyProps) {
    super(props);
    this.setupBuildingSubscription();
  }

  protected getBuildingConfig(): UpgradeBuildingConfig {
    return {
      threshold: 2,
      label: "Upgrade Many",
      buildingChangeKey: BuildingModelChanges.UPGRADE_MANY,
      applyEffect: (e, own) => {
        e.upgrade_many = own;
      },
    };
  }
}
