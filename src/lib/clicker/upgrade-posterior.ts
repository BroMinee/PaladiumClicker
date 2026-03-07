import { BuildingModelChanges } from "./building";
import { UpgradeProps } from "./upgrade";
import { UpgradeBuilding, UpgradeBuildingConfig } from "./upgrade-building";

export type UpgradePosteriorProps = UpgradeProps

/**
 * Represents an upgrade that is applied to a building based on the number of previous buildings owned.
 */
export class UpgradePosterior extends UpgradeBuilding {
  /**
   * Returns the upgrade itself.
   * @returns The upgrade.
   */
  getValue(): UpgradePosterior {
    return this;
  }

  /**
   * Creates a new posterior upgrade.
   * @param props The properties of the upgrade.
   */
  constructor(readonly props: UpgradePosteriorProps) {
    super(props);
    this.setupBuildingSubscription();
  }

  protected getBuildingConfig(): UpgradeBuildingConfig {
    return {
      threshold: 4,
      label: "Upgrade Posterior",
      buildingChangeKey: BuildingModelChanges.UPGRADE_POSTERIOR,
      applyEffect: (e, own) => {
        e.upgrade_posterior = own;
      },
    };
  }
}
