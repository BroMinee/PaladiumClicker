import { MetierKey } from "@/types/profil";
import { BuildingModelChanges } from "./building";
import { METIER_EVENT_MAP } from "./clicker";
import { Upgrade, UpgradeModelChanges, UpgradeProps } from "./upgrade";

export interface UpgradeTerrainProps extends UpgradeProps {
  metier: MetierKey;
}

/**
 * Represents an upgrade that is linked to a specific job level.
 */
export class UpgradeTerrain extends Upgrade {
  /**
   * Returns the upgrade itself.
   * @returns The upgrade.
   */
  getValue(): UpgradeTerrain {
    return this;
  }

  /**
   * Creates a new terrain upgrade.
   * @param props The properties of the upgrade.
   */
  constructor(readonly props: UpgradeTerrainProps) {
    super(props);
    this.setupSubscription();
    this.canBuy = false;
  }

  private setupSubscription(): void {
    // [CAN_BUY] subscribe to building count changes to see if we can buy the upgrade
    this.props.clicker.getValue().subscribe(METIER_EVENT_MAP[this.props.metier], `[Upgrade Terrain] ${this.props.name} changes in job ${this.props.metier} level`, ({ oldValue, newValue }) => {
      if (this.own) {
        this.props.active_index.forEach(active_index => {
          this.props.clicker.getValue().buildings[active_index].applyChanges(BuildingModelChanges.UPGRADE_TERRAIN, `[Upgrade Terrain] ${this.props.name} upgrade owned`, (e) => {
            e.upgrade_terrain += (newValue.metier[this.props.metier] - oldValue.metier[this.props.metier]) * 0.01;
          });
        });
      }
    });

    this.setupDayConditionSubscription("Upgrade Terrain", () => true);

    // [OWN] subscribe to own changes to apply the upgrade effects
    this.subscribe(UpgradeModelChanges.OWN, `[Upgrade Terrain] ${this.props.name} own changes`, ({ newValue }) => {

      this.props.active_index.forEach(active_index => {
        if(newValue.own) {
          this.props.clicker.getValue().buildings[active_index].applyChanges(BuildingModelChanges.UPGRADE_TERRAIN, `[Upgrade Terrain] ${this.props.name} upgrade owned`, (e) => {
            e.upgrade_terrain += this.props.clicker.getValue().metier[this.props.metier] * 0.01;
          });
        } else {
          this.props.clicker.getValue().buildings[active_index].applyChanges(BuildingModelChanges.UPGRADE_TERRAIN, `[Upgrade Terrain] ${this.props.name} upgrade not owned`, (e) => {
            e.upgrade_terrain -= this.props.clicker.getValue().metier[this.props.metier] * 0.01;
          });
        }
      });

    });
  }
}
