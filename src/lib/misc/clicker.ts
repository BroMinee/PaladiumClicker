import globalUpgradeJson from "@/assets/global_upgrade.json";
import global_upgrade_json from "@/assets/global_upgrade.json";
import terrainUpgradeJson from "@/assets/terrain_upgrade.json";
import terrain_upgrade_json from "@/assets/terrain_upgrade.json";
import buildingUpgradeJson from "@/assets/building_upgrade.json";
import building_upgrade_json from "@/assets/building_upgrade.json";
import manyUpgradeJson from "@/assets/many_upgrade.json";
import many_upgrade_json from "@/assets/many_upgrade.json";
import posteriorUpgradeJson from "@/assets/posterior_upgrade.json";
import posterior_upgrade_json from "@/assets/posterior_upgrade.json";
import categoryUpgradeJson from "@/assets/category_upgrade.json";
import category_upgrade_json from "@/assets/category_upgrade.json";
import metier_json from "@/assets/metier.json";
import building_json from "@/assets/building.json";
import CPS_json from "@/assets/CPS.json";
import { AnyCondition, Building, BuildingUpgrade, CategoryUpgrade, GlobalUpgrade, ManyUpgrade, Metiers, PlayerInfo, PosteriorUpgrade, TerrainUpgrade, UpgradeKey, CPS } from "@/types";
import constants from "@/lib/constants.ts";
import { safeJoinPaths } from "./navbar";

export function formatPrice(price: number | undefined) {
  if (price === undefined) {
    return "Error";
  }
  const numberFormatter = new Intl.NumberFormat("fr-FR");
  return numberFormatter.format(price);
}

export function formatPriceWithUnit(price: number): string {
  if (price < 1000) {
    return price.toString();
  }
  if (price < 1000000) {
    return (price / 1000).toFixed(1) + "k";
  }

  return (price / 1000000).toFixed(1) + "M";
}

export function getTotalSpend(playerInfo: PlayerInfo) {
  let total = 0;
  const validKeys = [
    "building",
    "building_upgrade",
    "category_upgrade",
    "global_upgrade",
    "many_upgrade",
    "terrain_upgrade",
    "posterior_upgrade",
    "CPS"
  ] as const;

  for (const key in playerInfo) {

    if (validKeys.includes(key as typeof validKeys[number])) {
      const target = playerInfo[key as typeof validKeys[number]];
      for (const element of target) {
        if (
          ("price" in element) &&
          (element.own === true || (typeof element.own === "number" && element.own >= 1))
        ) {
          if (key === "building") {
            for (let i = 0; i < (element.own as number); i++) {
              total += computePrice(element.price ?? -1, i);
            }
          } else {
            total += element.price ?? 0;
          }
        }
      }
    }
  }
  return total;
}

function getCoinsCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined) {
    return 0;
  }

  const r = conditions.find(c => typeof c !== "undefined" && "coins" in c) as { coins: number } | undefined;
  return r ? r.coins : -1;
}

function getBuildingIndexCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined) {
    return 0;
  }
  const r = conditions.find(c => typeof c !== "undefined" && "index" in c) as { index: number } | undefined;
  return r ? r.index : -1;
}

function getBuildingCountCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined) {
    return 0;
  }
  const r = conditions.find(c => typeof c !== "undefined" && "own" in c) as { own: number } | undefined;
  return r ? r.own : -1;
}

function getDayCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined) {
    return 0;
  }
  const r = conditions.find(c => typeof c !== "undefined" && "day" in c) as { day: number } | undefined;
  return r ? r.day : -1;
}

// unlockable, coins, totalCoins, day, daySinceStart, buildingIndex, buildingNeed, buildingCount
export function checkCondition(playerInfo: PlayerInfo, conditions: AnyCondition, date: Date) {
  const coinsCondition = getCoinsCondition(conditions);
  const dayCondition = getDayCondition(conditions);
  const spend = getTotalSpend(playerInfo);
  const totalCoins = Math.round(spend + Math.max(playerInfo.production - spend, 0));
  const buildingIndex = getBuildingIndexCondition(conditions);
  const buildingNeed = getBuildingCountCondition(conditions);
  const daySinceStart = (date.getTime() - constants.startSeason.getTime()) / (1000 * 60 * 60 * 24);
  const buildingCount = buildingIndex === -1 ? -1 : playerInfo.building[buildingIndex].own;

  const unlockable = totalCoins >= coinsCondition &&
    daySinceStart >= dayCondition &&
    (buildingIndex === -1 ? true : Number(playerInfo.building[buildingIndex].own) >= buildingNeed); // TODO change day

  return {
    unlockable,
    coinsCondition,
    totalCoins,
    dayCondition,
    daySinceStart,
    buildingIndex,
    buildingNeed,
    buildingCount
  };
}

export function computePrice(priceLevel0: number, level: number) {
  return Math.round(priceLevel0 * Math.pow(1.100000023841858, level));
}

export function getPathImg(bestListName: string, bestUpgradeIndex: number) {
  switch (bestListName) {
  case "building":
    return safeJoinPaths(constants.imgPathClicker,"/BuildingIcon/", `${bestUpgradeIndex}.png`);
  case "building_upgrade":
    return safeJoinPaths(constants.imgPathClicker,"/BuildingUpgradeIcon/", (bestUpgradeIndex < 16 ? "0" : "1") + ".png");
  case "category_upgrade":
    return safeJoinPaths(constants.imgPathClicker,"/CategoryIcon/", `${bestUpgradeIndex}.png`);
  case "global_upgrade":
    return safeJoinPaths(constants.imgPathClicker,"/GlobalIcon/", `${bestUpgradeIndex}.png`);
  case "many_upgrade":
    return safeJoinPaths(constants.imgPathClicker,"/ManyIcon/0.png");
  case "terrain_upgrade":
    return safeJoinPaths(constants.imgPathClicker,"/TerrainIcon/", `${bestUpgradeIndex}.png`);
  case "posterior_upgrade":
    return safeJoinPaths(constants.imgPathClicker,"/PosteriorIcon/0.png");
  default:
    alert("Error in bestListName");
    return safeJoinPaths(constants.imgPathClicker,"/BuildingUpgradeIcon/0.png");
  }
}

export function getDDHHMMSSOnlyClicker(d: Date) {
  if (new Date() > d) {
    return "Maintenant";
  }
  const padL = (num: number, chr = "0") => `${num}`.padStart(2, chr);

  return `${padL(d.getDate())}/${padL(d.getMonth() + 1)}/${d.getFullYear()} à ${padL(d.getHours())}:${padL(d.getMinutes())}:${padL(d.getSeconds())}`;
}

export function reverseDDHHMMSSOnlyClicker(d: string) {
  // get the date out of the string (format : DD/MM/YYYY à HH:MM:SS)
  const date = d.split(" à ")[0];
  const time = d.split(" à ")[1];
  const day = date.split("/")[0];
  const month = date.split("/")[1];
  const year = date.split("/")[2];
  const hour = time.split(":")[0];
  const minute = time.split(":")[1];
  const second = time.split(":")[2];
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
}

export function getDDHHMMSS(d: Date) {
  const padL = (num: number, chr = "0") => `${num}`.padStart(2, chr);

  return `${padL(d.getDate())}/${padL(d.getMonth() + 1)}/${d.getFullYear()} à ${padL(d.getHours())}:${padL(d.getMinutes())}:${padL(d.getSeconds())}`;
}

export function getHHMMSS(d: Date) {
  const padL = (num: number, chr = "0") => `${num}`.padStart(2, chr);

  return `${padL(d.getHours())}:${padL(d.getMinutes())}:${padL(d.getSeconds())}`;
}

export function getHHMM(d: Date) {
  const padL = (num: number, chr = "0") => `${num}`.padStart(2, chr);

  return `${padL(d.getHours())}:${padL(d.getMinutes())}`;
}

export function scaleCurrentProduction(playerInfo: PlayerInfo, buildingIndex: number, level: number) {
  if (level === 0 || level === -1) {
    return 0;
  }
  const newBaseProduction = scaleBaseProduction(playerInfo, buildingIndex);
  return newBaseProduction * level;
}

function scaleBaseProduction(playerInfo: PlayerInfo, buildingIndex: number) {
  const baseProduction = convertToFloat(playerInfo.building?.[buildingIndex].base_production || 0);
  const pourcentageBonus = getPourcentageBonus(playerInfo, buildingIndex);
  return (baseProduction * pourcentageBonus);
}

function getPourcentageBonus(playerInfo: PlayerInfo, buildingIndex: number) {
  function getBonusFromTerrain() {
    const terrainUpgrades = playerInfo.terrain_upgrade
      .filter((terrain) => terrain.own && terrain.active_list_index.includes(buildingIndex));
    const targetedBuilding = playerInfo.building[buildingIndex];
    let terrainPourcentage = 0;
    if (terrainUpgrades.length > 1) {
      alert(`Error in getBonusFromTerrain function : more than one bonus from terrain for ${targetedBuilding.name}`);
    } else if (terrainUpgrades.length === 1) {
      const terrainUpgrade = terrainUpgrades[0];
      if (terrainUpgrade.name.includes("Mineur")) {
        terrainPourcentage += 0.01 * playerInfo.metier.miner.level;
      } else if (terrainUpgrade.name.includes("Farmer")) {
        terrainPourcentage += 0.01 * playerInfo.metier.farmer.level;
      } else if (terrainUpgrade.name.includes("Hunter")) {
        terrainPourcentage += 0.01 * playerInfo.metier.hunter.level;
      } else if (terrainUpgrade.name.includes("Alchimiste")) {
        terrainPourcentage += 0.01 * playerInfo.metier.alchemist.level;
      } else {
        alert(`Error in getBonusFromTerrain function : unknown bonus from terrain for ${playerInfo["building"][buildingIndex]["name"]}`);
      }
    }
    return terrainPourcentage;
  }

  function getBonusFromGlobal() {
    return playerInfo.global_upgrade
      .filter((global) => global.own).length * 0.1;
  }

  function getBonusFromCategory() {
    const categoryUpgrades = playerInfo.category_upgrade
      .filter((category) => category.own && category.active_list_index.includes(buildingIndex));
    return categoryUpgrades.reduce((total, category) => total + category.pourcentage, 0);
  }

  function getBonusFromMany() {
    const manyUpgrades = playerInfo.many_upgrade
      .filter((many) => many.own && many.active_index === buildingIndex);
    const targetedBuilding = playerInfo.building[buildingIndex];
    if (manyUpgrades.length > 1) {
      alert(`Error in getBonusFromMany function : more than one bonus from many for ${targetedBuilding.name}`);
    } else if (manyUpgrades.length === 1) {
      return Number(targetedBuilding.own) * 0.01;
    }
    return 0;
  }

  function getBonusFromBuild() {
    const buildingUpgrades = playerInfo.building_upgrade
      .filter((building) => building.own && building.active_index === buildingIndex);
    const targetedBuilding = playerInfo.building[buildingIndex];
    if (buildingUpgrades.length > 2) {
      alert(`Error in getBonusFromBuild function : more than one/two bonus from building for ${targetedBuilding.name}`);
    }

    return buildingUpgrades.length;
  }

  function getBonusFromPosterior() {
    const posteriorUpgrades = playerInfo.posterior_upgrade
      .filter((posterior) => posterior.own && posterior.active_index === buildingIndex);
    const targetedBuilding = playerInfo.building[buildingIndex];
    if (posteriorUpgrades.length > 1) {
      alert(`Error in getBonusFromPosterior function : more than one bonus from posterior for ${targetedBuilding.name}`);
    }
    if (posteriorUpgrades.length === 1) {
      return Number(playerInfo.building[posteriorUpgrades[0].previous_index].own) * 0.01;
    }
    return 0;
  }

  const bonusFunctions = [
    getBonusFromGlobal,
    getBonusFromTerrain,
    getBonusFromBuild,
    getBonusFromMany,
    getBonusFromPosterior,
    getBonusFromCategory
  ];

  return bonusFunctions.reduce((total, bonusFunction) => total + bonusFunction(), 1);

}

function convertToFloat(str: string | number) {
  if (typeof str === "number") {
    return str;
  }

  return parseFloat(str.replace(/,/g, "."));
}

export function computeRPS(playerInfo: PlayerInfo) {
  let rps = 0.5;
  playerInfo.building.forEach((building, index) => {
    if (building.own !== 0) {
      rps += scaleCurrentProduction(playerInfo, index, Number(building.own));
    }
  }
  );
  return rps;
}

export function getJsonToUseForUpgrade(upgradeType: UpgradeKey) {
  const jsonToUse = null;
  if (upgradeType === "global_upgrade") {
    return globalUpgradeJson;
  } else if (upgradeType === "building_upgrade") {
    return buildingUpgradeJson;
  } else if (upgradeType === "category_upgrade") {
    return categoryUpgradeJson;
  } else if (upgradeType === "many_upgrade") {
    return manyUpgradeJson;
  } else if (upgradeType === "posterior_upgrade") {
    return posteriorUpgradeJson;
  } else if (upgradeType === "terrain_upgrade") {
    return terrainUpgradeJson;
  }

  return jsonToUse;
}

export const getInitialPlayerInfo = (): PlayerInfo => {

  const metiers = structuredClone(metier_json) as Metiers;
  const buildings = structuredClone(building_json) as Building[];
  for (let i = 0; i < buildings.length; i++) {
    buildings[i].base_production = String(0.10000000149011612 * Math.pow(1.7999999523162842, i));
  }
  const buildingUpgrade = structuredClone(building_upgrade_json) as BuildingUpgrade[];
  const categoryUpgrade = structuredClone(category_upgrade_json) as CategoryUpgrade[];
  const CPS = CPS_json as CPS[];
  const globalUpgrade = structuredClone(global_upgrade_json) as GlobalUpgrade[];
  const manyUpgrade = structuredClone(many_upgrade_json) as ManyUpgrade[];
  const posteriorUpgrade = structuredClone(posterior_upgrade_json) as PosteriorUpgrade[];
  const terrainUpgrade = structuredClone(terrain_upgrade_json) as TerrainUpgrade[];
  return {
    metier: metiers,
    achievements: [],
    alliance: "NEUTRAL",
    building: buildings,
    building_upgrade: buildingUpgrade,
    category_upgrade: categoryUpgrade,
    CPS: CPS,
    currentBanner: "default",
    description: "",
    global_upgrade: globalUpgrade,
    many_upgrade: manyUpgrade,
    posterior_upgrade: posteriorUpgrade,
    terrain_upgrade: terrainUpgrade,
    production: 0.5,
    faction: {
      access: "INVITATION", createdAt: 1707909089647, description: "Zone libre", emblem: {
        backgroundColor: -1,
        backgroundId: 0,
        borderColor: -1,
        forcedTexture: "Wilderness",
        foregroundColor: -1,
        foregroundId: 0,
        iconBorderColor: -1,
        iconColor: -1,
        iconId: 0,
      }, level: { level: 1, xp: 0 }, name: "Wilderness", players: [], uuid: "00000000-0000-0000-0000-000000000000"
    },
    firstSeen: 0,
    friends: { data: [], totalCount: 0 },
    money: 0,
    timePlayed: 0,
    username: constants.defaultUsername,
    uuid: "",
    rank: "default",
    leaderboard: "Unranked",
    ah: { data: [], totalCount: 0, dateUpdated: 0 },
    last_fetch: new Date().getTime(),
    view_count: { count: 0, uuid: "" },
    version: constants.version,
    mount: { name: "Dancarok", damage: 0, food: 6000, xp: 0, mountType: 1, sharedXpPercent: 100 },
    pet: { currentSkin: "dog", experience: 0, happiness: 0, skills: [] },
    edited: false,
  };
};

export function computeProgression(playerInfo: PlayerInfo | null) {
  if (!playerInfo) {
    return 0;
  }

  const maxUpgrade =
    playerInfo.building.length * 99
    + playerInfo.CPS.length
    + playerInfo.global_upgrade.length
    + playerInfo.terrain_upgrade.length
    + playerInfo.building_upgrade.length
    + playerInfo.many_upgrade.length
    + playerInfo.posterior_upgrade.length;

  const currentUpgrade = playerInfo.building.reduce((acc, building) => acc + building.own, 0)
    + playerInfo.CPS.reduce((acc, cps) => acc + (cps.own ? 1 : 0), 0)
    + playerInfo.global_upgrade.reduce((acc, global) => acc + (global.own ? 1 : 0), 0)
    + playerInfo.terrain_upgrade.reduce((acc, terrain) => acc + (terrain.own ? 1 : 0), 0)
    + playerInfo.building_upgrade.reduce((acc, building) => acc + (building.own ? 1 : 0), 0)
    + playerInfo.many_upgrade.reduce((acc, many) => acc + (many.own ? 1 : 0), 0)
    + playerInfo.posterior_upgrade.reduce((acc, posterior) => acc + (posterior.own ? 1 : 0), 0);

  return currentUpgrade * 100 / maxUpgrade;
}