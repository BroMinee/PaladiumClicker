import { BuildingModelChanges } from "./building";
import { UpgradeBuilding, UpgradeBuildingConfig } from "./upgrade-building";
import { UpgradeProps } from "./upgrade";

export type Upgrade200Props = UpgradeProps

/**
 * Represents an upgrade that triples the production of a building.
 */
export class Upgrade200 extends UpgradeBuilding {
  /**
   * Returns the upgrade itself.
   * @returns The upgrade.
   */
  getValue(): Upgrade200 {
    return this;
  }

  /**
   * Creates a new 200% upgrade.
   * @param props The properties of the upgrade.
   */
  constructor(readonly props: Upgrade200Props) {
    super(props);
    this.setupBuildingSubscription();
  }

  protected getBuildingConfig(): UpgradeBuildingConfig {
    return {
      threshold: 7,
      label: "Upgrade 200%",
      buildingChangeKey: BuildingModelChanges.UPGRADE_200,
      applyEffect: (e, own) => {
        e.upgrade_200 = own;
      },
    };
  }
}
