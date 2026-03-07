import { BuildingModelChanges } from "./building";
import { UpgradeBuilding, UpgradeBuildingConfig } from "./upgrade-building";
import { UpgradeProps } from "./upgrade";

export type Upgrade100Props = UpgradeProps

/**
 * Represents an upgrade that doubles the production of a building.
 */
export class Upgrade100 extends UpgradeBuilding {
  /**
   * Returns the upgrade itself.
   * @returns The upgrade.
   */
  getValue(): Upgrade100 {
    return this;
  }

  /**
   * Creates a new 100% upgrade.
   * @param props The properties of the upgrade.
   */
  constructor(readonly props: Upgrade100Props) {
    super(props);
    this.setupBuildingSubscription();
  }

  protected getBuildingConfig(): UpgradeBuildingConfig {
    return {
      threshold: 3,
      label: "Upgrade 100%",
      buildingChangeKey: BuildingModelChanges.UPGRADE_100,
      applyEffect: (e, own) => {
        e.upgrade_100 = own;
      },
    };
  }
}
