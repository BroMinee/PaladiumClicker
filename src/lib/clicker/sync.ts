import { MetierKey } from "@/types/profil";
import { PlayerInfo } from "@/types";
import { Clicker } from "./clicker";
import { BuildingModelChanges } from "./building";
import { UpgradeModelChanges } from "./upgrade";
import { TimeModelChanges } from "./time";

/**
 * Syncs a PlayerInfo state into a fresh Clicker instance.
 * Must be called on a freshly created Clicker (via setupClicker()).
 */
export function syncPlayerInfoToClicker(clicker: Clicker, playerInfo: PlayerInfo): void {
  // Step 1: advance time to now so all real-time day conditions are immediately met
  clicker.time.applyChanges(TimeModelChanges.CURRENT_DATECHANGE, "advance to now", (e) => {
    e.currentDate = new Date();
  });

  // Step 2: metier levels (before terrain upgrades, which use metier level)
  const metierKeys: MetierKey[] = ["farmer", "hunter", "alchemist", "miner"];
  for (const key of metierKeys) {
    const level = playerInfo.metier?.[key]?.level ?? 1;
    try {
      clicker.setMetierLevel(key, Math.max(1, level));
    } catch (e) {
      console.warn(`[sync] Failed to set metier ${key} to ${level}`, e);
    }
  }

  // Step 3: buildings in index order, one unit at a time (prerequisite: building[i-1] must have count > 0)
  for (let i = 0; i < Math.min(playerInfo.building.length, clicker.buildings.length); i++) {
    const targetCount = Math.min(Number(playerInfo.building[i].own), 99);
    for (let j = 1; j <= targetCount; j++) {
      try {
        clicker.buildings[i].applyChanges(BuildingModelChanges.COUNT, "sync", (e) => {
          e.count = j;
        });
      } catch (e) {
        console.warn(`[sync] Failed to set building[${i}] count to ${j}`, e);
        break;
      }
    }
  }

  // Step 4: upgrade_100 — playerInfo.building_upgrade[0..15]
  for (let i = 0; i < Math.min(16, playerInfo.building_upgrade.length); i++) {
    if (playerInfo.building_upgrade[i].own && i < clicker.upgrade_100.length) {
      try {
        clicker.upgrade_100[i].applyChanges(UpgradeModelChanges.OWN, "sync", (e) => {
          e.own = true;
        });
      } catch (e) {
        console.warn(`[sync] Failed to set upgrade_100[${i}] owned`, e);
      }
    }
  }

  // Step 5: upgrade_200 — playerInfo.building_upgrade[16..31]
  for (let i = 16; i < playerInfo.building_upgrade.length; i++) {
    const idx = i - 16;
    if (playerInfo.building_upgrade[i].own && idx < clicker.upgrade_200.length) {
      try {
        clicker.upgrade_200[idx].applyChanges(UpgradeModelChanges.OWN, "sync", (e) => {
          e.own = true;
        });
      } catch (e) {
        console.warn(`[sync] Failed to set upgrade_200[${idx}] owned`, e);
      }
    }
  }

  // Step 6: upgrade_many
  for (let i = 0; i < Math.min(playerInfo.many_upgrade.length, clicker.upgrade_many.length); i++) {
    if (playerInfo.many_upgrade[i].own) {
      try {
        clicker.upgrade_many[i].applyChanges(UpgradeModelChanges.OWN, "sync", (e) => {
          e.own = true;
        });
      } catch (e) {
        console.warn(`[sync] Failed to set upgrade_many[${i}] owned`, e);
      }
    }
  }

  // Step 7: upgrade_posterior
  for (let i = 0; i < Math.min(playerInfo.posterior_upgrade.length, clicker.upgrade_posterior.length); i++) {
    if (playerInfo.posterior_upgrade[i].own) {
      try {
        clicker.upgrade_posterior[i].applyChanges(UpgradeModelChanges.OWN, "sync", (e) => {
          e.own = true;
        });
      } catch (e) {
        console.warn(`[sync] Failed to set upgrade_posterior[${i}] owned`, e);
      }
    }
  }

  // Step 8: upgrade_category
  for (let i = 0; i < Math.min(playerInfo.category_upgrade.length, clicker.upgrade_category.length); i++) {
    if (playerInfo.category_upgrade[i].own) {
      try {
        clicker.upgrade_category[i].applyChanges(UpgradeModelChanges.OWN, "sync", (e) => {
          e.own = true;
        });
      } catch (e) {
        console.warn(`[sync] Failed to set upgrade_category[${i}] owned`, e);
      }
    }
  }

  // Step 9: upgrade_terrain (only requires day condition, which is already met)
  for (let i = 0; i < Math.min(playerInfo.terrain_upgrade.length, clicker.upgrade_terrain.length); i++) {
    if (playerInfo.terrain_upgrade[i].own) {
      try {
        clicker.upgrade_terrain[i].applyChanges(UpgradeModelChanges.OWN, "sync", (e) => {
          e.own = true;
        });
      } catch (e) {
        console.warn(`[sync] Failed to set upgrade_terrain[${i}] owned`, e);
      }
    }
  }

  // Step 10: upgrade_global — synced last since it requires total_spend >= coinCondition
  for (let i = 0; i < Math.min(playerInfo.global_upgrade.length, clicker.upgrade_global.length); i++) {
    if (playerInfo.global_upgrade[i].own) {
      try {
        clicker.upgrade_global[i].applyChanges(UpgradeModelChanges.OWN, "sync", (e) => {
          e.own = true;
        });
      } catch (e) {
        console.warn(`[sync] Failed to set upgrade_global[${i}] owned`, e);
      }
    }
  }
}
