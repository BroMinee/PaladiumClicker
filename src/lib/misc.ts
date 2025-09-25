import {
  AdminShopItem,
  AdminShopPeriode,
  AhItemType,
  AnyCondition,
  Building,
  BuildingUpgrade,
  CategoryUpgrade,
  CPS,
  CraftPrice,
  CraftSectionEnum,
  EventType,
  GlobalUpgrade,
  ManyUpgrade,
  MarketItemOffer,
  MetierKey,
  Metiers,
  NodeType,
  OptionType,
  PlayerInfo,
  PosteriorUpgrade,
  ProfilSectionEnum,
  RankingResponse,
  RankingType,
  Role,
  StatusPeriode,
  TerrainUpgrade,
  Tree,
  UpgradeKey,
  WebHookType
} from "@/types";
import constants, { PathValid } from "@/lib/constants.ts";

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
import { redirect } from "next/navigation";

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
      let target = playerInfo[key as typeof validKeys[number]];
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

  const r = conditions.find(c => typeof c !== 'undefined' && "coins" in c) as { coins: number } | undefined;
  return r ? r.coins : -1;
}

function getBuildingIndexCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined) {
    return 0;
  }
  const r = conditions.find(c => typeof c !== 'undefined' && "index" in c) as { index: number } | undefined;
  return r ? r.index : -1;
}

function getBuildingCountCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined) {
    return 0;
  }
  const r = conditions.find(c => typeof c !== 'undefined' && "own" in c) as { own: number } | undefined;
  return r ? r.own : -1;
}

function getDayCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined) {
    return 0;
  }
  const r = conditions.find(c => typeof c !== 'undefined' && "day" in c) as { day: number } | undefined;
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
  const padL = (num: number, chr = `0`) => `${num}`.padStart(2, chr);

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
  const padL = (num: number, chr = `0`) => `${num}`.padStart(2, chr);

  return `${padL(d.getDate())}/${padL(d.getMonth() + 1)}/${d.getFullYear()} à ${padL(d.getHours())}:${padL(d.getMinutes())}:${padL(d.getSeconds())}`;
}

export function getHHMMSS(d: Date) {
  const padL = (num: number, chr = `0`) => `${num}`.padStart(2, chr);

  return `${padL(d.getHours())}:${padL(d.getMinutes())}:${padL(d.getSeconds())}`;
}

export function getHHMM(d: Date) {
  const padL = (num: number, chr = `0`) => `${num}`.padStart(2, chr);

  return `${padL(d.getHours())}:${padL(d.getMinutes())}`;
}

export function adaptPlurial(word: string, count: number) {
  return count >= 2 ? word + "s" : word;
}

export function generateXpCalculatorUrl(username: string, metier: string | undefined, level: number | undefined, double: boolean | undefined, dailyBonus: number | undefined, f2: boolean | undefined, f3: boolean | undefined) {
  if (f3 !== undefined && f2 !== undefined) {
    f2 = undefined;
  }
  const argMetier = metier ? `metier=${metier}` : "";
  const argLevel = level ? `level=${level}` : "";
  const argDouble = double ? `double=${double}` : "";
  const argDailyBonus = dailyBonus ? `dailyBonus=${dailyBonus}` : "";
  const argF2 = f2 ? `f2=${f2}` : "";
  const argF3 = f3 ? `f3=${f3}` : "";
  const args = [argMetier, argLevel, argDouble, argDailyBonus, argF2, argF3].filter((e) => e).join("&");
  return safeJoinPaths(constants.calculatorXpPath, username, `?${args}`);
}

export function generateRankingUrl(category: string | undefined, usernames?: string[] | undefined, noUsernames?: string[] | undefined) {
  const argCategory = category ? `category=${category}` : "";
  const argUsernames = usernames ? `usernames=${usernames}` : "";
  const argNoUsernames = noUsernames ? `noUsernames=${noUsernames}` : "";
  const args = [argCategory, argUsernames, argNoUsernames].filter((e) => e).join("&");
  return safeJoinPaths("/ranking", `?${args}`);
}

export function generateAhShopUrl(item: OptionType | undefined) {
  const argItem = item ? `item=${item.value}` : "";
  const args = [argItem].filter((e) => e).join("&");
  return safeJoinPaths(constants.ahPath, `?${args}`);
}

export function generateAdminShopUrl(item: AdminShopItem, periode?: AdminShopPeriode) {
  const argItem = item ? `item=${item}` : "";
  const argPeriode = periode ? `periode=${periode}` : "";
  const args = [argItem, argPeriode].filter((e) => e).join("&");
  return safeJoinPaths(constants.adminShopPath, `?${args}`);
}

export function generateStatusUrl(periode?: StatusPeriode) {
  const argPeriode = periode ? `periode=${periode}` : "";
  const args = [argPeriode].filter((e) => e).join("&");
  return safeJoinPaths(constants.statusPath, `?${args}`);
}

export function generateCraftUrl(item: string | null, count: number | null, section: CraftSectionEnum) {
  switch(section) {
  case  CraftSectionEnum.recipe:
  {
    const argItem = item ? `item=${item}` : "";
    const argCount = count ? `count=${count}` : "";
    const argSection = `section=${section}`;
    const args = [argItem, argCount, argSection].filter((e) => e).join("&");
    return safeJoinPaths(constants.craftPath, `?${args}`);
  }
  case CraftSectionEnum.optimizer:
    const argSection = `section=${section}`;
    const args = [argSection].filter((e) => e).join("&");
    return safeJoinPaths(constants.craftPath, `?${args}`);
  default:
    return redirect("/error?message=Section inconnu");
  }

}

export function safeJoinPaths(base: string, ...paths: string[]): string {
  const allPaths = ["/" + base, ...paths];
  const result = allPaths.join('/');
  return result.replace(/\/+/g, '/');
}

export function getRankImg(rank: string) {
  if (rank === "Default") {
    return safeJoinPaths(constants.imgPathProfile,"dirt.png");
  } else if (rank === "Titan") {
    return safeJoinPaths(constants.imgPathProfile,"titan.png");
  } else if (rank === "Paladin") {
    return safeJoinPaths(constants.imgPathProfile,"paladin.png");
  } else if (rank === "Endium") {
    return safeJoinPaths(constants.imgPathProfile,"endium.png");
  } else if (rank === "Trixium") {
    return safeJoinPaths(constants.imgPathProfile,"trixium.png");
  } else if (rank === "Trixium+") {
    return safeJoinPaths(constants.imgPathProfile,"trixium+.png");
  } else if (rank === "Youtuber") {
    return safeJoinPaths(constants.imgPathProfile,"youtuber.png");
  } else if (rank === "Heros") {
    return safeJoinPaths(constants.imgPathProfile,"heros.png");
  }else if (rank === "Divinity") {
    return safeJoinPaths(constants.imgPathProfile,"divinity.png");
  }else if (rank === "Legend") {
    return safeJoinPaths(constants.imgPathProfile,"legend.png");
  }else if (rank === "Premium") {
    return safeJoinPaths(constants.imgPathProfile,"premium.png");
  } else if(rank === "Rusher") {
    return safeJoinPaths(constants.imgPathProfile,"rusher.png");
  } else {
    return "unknown.png";
  }
}

export function computeTimePlayed(timeInMinutes: number) {
  if (timeInMinutes === -1) {
    return "Indisponible";
  }

  const minute = timeInMinutes % 60;
  const hour = Math.floor(timeInMinutes / 60) % 24;
  const day = Math.floor(timeInMinutes / 60 / 24);
  let res = "";
  if (day > 0) {
    res += day + "j ";
  }
  if (hour > 0) {
    res += hour + "h ";
  }
  res += minute + "m";

  return res;
}

export function convertEpochToDateUTC2(epoch: number | undefined) {
  if (!epoch) {
    return "Error";
  }
  const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
  date.setUTCSeconds(epoch / 1000);
  return date.toLocaleString();
}

export function getXpCoef(level: number, currentXp: number) {
  // if (level === 100)
  //   return 1;
  if (currentXp === 0) {
    return 0;
  }
  if(level >= 100) {
    return (currentXp - constants.metier_palier[99] - constants.metier_xp[99] * (level - 100)) / constants.metier_xp[99];
  }
  return (currentXp - constants.metier_palier[level - 1]) / constants.metier_xp[level];
}

export const getColorByMetierName = (name: MetierKey) => {
  let color = [0, 150, 0];
  let bgColor = [0, 0, 0];

  switch (name) {
  case "miner":
    color = [255, 47, 47];
    bgColor = [255, 47, 47];
    break;
  case "farmer":
    color = [199, 169, 33];
    bgColor = [255, 209, 1];
    break;
  case "hunter":
    color = [47, 103, 255];
    bgColor = [47, 103, 255];
    break;
  case "alchemist":
    color = [255, 100, 201];
    bgColor = [255, 100, 201];
  }

  return { color, bgColor };
};

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

  return parseFloat(str.replace(/,/g, '.'));
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
  let jsonToUse = null;
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

export function getImagePathFromRankingType(rankingType: string): string {
  let imgPath: string;
  switch (rankingType) {
  case RankingType.money:
    imgPath = safeJoinPaths(constants.imgPathRanking, `money.png`);
    break;
  case RankingType["job.alchemist"]:
    imgPath = safeJoinPaths(constants.imgPathRanking, `alchimiste.png`);
    break;
  case RankingType["job.farmer"]:
    imgPath = safeJoinPaths(constants.imgPathRanking, `farmeur.png`);
    break;
  case RankingType["job.hunter"]:
    imgPath = safeJoinPaths(constants.imgPathRanking, `hunter.png`);
    break;
  case RankingType["job.miner"]:
    imgPath = safeJoinPaths(constants.imgPathRanking, `mineur.png`);
    break;
  case RankingType.boss:
    imgPath = safeJoinPaths(constants.imgPathRanking, `boss.png`);
    break;
  case RankingType.egghunt:
    imgPath = safeJoinPaths(constants.imgPathRanking, `egghunt.png`);
    break;
    // case RankingType.end:
    //   imgPath = safeJoinPaths(constants.imgPathRanking, `end.png`);
    //   break;
    // case RankingType.chorus:
    //   imgPath = safeJoinPaths(constants.imgPathRanking, `chorus.png`);
    //   break;
  case RankingType.koth:
    imgPath = safeJoinPaths(constants.imgPathRanking, `koth.png`);
    break;
  case RankingType.clicker:
    imgPath = safeJoinPaths(constants.imgPathRanking, `clicker.png`);
    break;
  case RankingType.alliance:
    imgPath = safeJoinPaths(constants.imgPathRanking, `alliance.png`);
    break;
  case RankingType.vote:
    imgPath = safeJoinPaths(constants.imgPathRanking, `vote.png`);
    break;
  default:
    imgPath = safeJoinPaths("/unknown.png");
    break;
  }
  return imgPath;
}

export function rankingTypeToUserFriendlyText(rankingType: RankingType): string {
  switch (rankingType) {
  case RankingType.money:
    return "Money";
  case RankingType["job.alchemist"]:
    return "Métier Alchimiste";
  case RankingType["job.farmer"]:
    return "Métier Fermier";
  case RankingType["job.hunter"]:
    return "Métier Chasseur";
  case RankingType["job.miner"]:
    return "Métier Mineur";
  case RankingType.boss:
    return "Boss";
  case RankingType.egghunt:
    return "EggHunt";
    // case RankingType.end:
    //   return "End";
    // case RankingType.chorus:
    //   return "Chorus";
  case RankingType.koth:
    return "KOTH";
  case RankingType.clicker:
    return "Clicker";
  case RankingType.alliance:
    return "Alignement";
  case RankingType.vote:
    return "Vote";
  default:
    return "Inconnu";
  }
}

export function adminShopItemToUserFriendlyText(item: AdminShopItem): string {
  switch (item) {
  case "passive-wither-head":
    return "Passif Wither Head";
  case "reeds":
    return "Sugar Cane";
  case "dye":
    return "Ink Sack";
  }

  return item.replaceAll('tile', '').split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getImagePathFromAdminShopType(item: AdminShopItem): string {
  const translateTable: Record<string, string> = {
    "wool": `wool_colored_white`,
    "passive-wither-head": "passifwither_head",
    "slime-ball": "slimeball",
    "log": "log_oak",
    "red-mushroom": "mushroom_red",
    "brown-mushroom": "mushroom_brown",
    "cactus": "cactus_side",
    "wheat-seeds": "seeds",
    "dye": "dye_powder_black",
    "redstone": "redstone_dust",
    "fermented-spider-eye": "spider_eye_fermented",
  };
  if (translateTable[item]) {
    return `/AH_img/${translateTable[item]}.webp`;
  }

  return `/AH_img/${item.replaceAll("-", "_")}.webp`;
}

export function convertAhItemTypeToMarketItemOffer(item: AhItemType, seller: string): MarketItemOffer {
  return {
    seller: seller, // uuid of the seller
    name: item.name, // Display name of the item
    renamed: item.renamed,
    quantity: item.item.quantity, // The remaining quantity of the item currenlty listed
    price: item.price, // The price of the item in ($)
    pricePb: item.pricePb, // The price of the item in pb
    durability: item.durability, // Durability of the item
    skin: item.skin, // Skin ID of the item
    slot: item.slot, // Slot of the item in the market
    createdAt: item.createdAt, // Date of the listing
    expireAt: item.expireAt, // Date of the expiration of the listing
  };
}

export function getIconNameFromEventType(eventType: EventType) {
  switch (eventType) {
  case 'A VOS MARQUES':
    return "/EventIcon/a_vos_marques.png";
  case "BOSS":
    return "/EventIcon/boss.png";
  case "BLACKMARKET":
    return "/EventIcon/blackmarket.png";
  case "EGGHUNT":
    return "/EventIcon/egghunt.png";
  case "KOTH":
    return "/EventIcon/koth.png";
  case "TOTEM":
    return "/EventIcon/totem.png";
  default:
    return "/EventIcon/unknown.png";
  }
}

export function getLinkFromUrl(url: string):
  PathValid | undefined {
  const urlArray = url.split("/");
  let trouvaille: PathValid | undefined = undefined;
  while (urlArray.length > 0 && urlArray[urlArray.length - 1] !== "") {
    trouvaille = Object.keys(constants.links).find((key) => {
      return key.includes(urlArray[urlArray.length - 1]);
    }) as PathValid | undefined;
    if (trouvaille !== undefined) {
      break;
    } else {
      urlArray.pop();
    }
  }
  return trouvaille;
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

export function reloadProfilNeeded(playerInfoLocal: PlayerInfo | null, username: string, defaultProfile: boolean) {
  if (defaultProfile) {
    return false;
  }

  if (username === constants.defaultUsername) {
    return false;
  }

  if (playerInfoLocal === null) {
    return true;
  }

  if (playerInfoLocal.username.toLowerCase() !== username.toLowerCase()) {
    return true;
  }

  if (playerInfoLocal.version === undefined || playerInfoLocal.version !== constants.version) {
    return true;
  }

  return false;
}

export function createTreeNode(item: OptionType, count: number, checked = false): Tree<NodeType> {
  const node: NodeType = createNodeType(item, count, checked);
  return { value: node, children: [] };
}

export function createNodeType(item: OptionType, count: number, checked = false): NodeType {
  return { ...item, count: count, checked: checked };
}

export function addChildrenToTree<T>(father: Tree<T>, children: Tree<T>) {
  father.children.push(children);
}

export function getValueTree<T>(root: Tree<T>): T {
  return root.value;
}

export function getAllLeaves<T>(root: Tree<T>): Tree<T>[] {
  if (root.children.length === 0) {
    return [root];
  }
  return root.children.flatMap((child) => getAllLeaves(child));
}

export function getInternalNode<T>(root: Tree<T>): Tree<T>[] {
  if (root.children.length === 0) {
    return [];
  }
  return [root, ...root.children.flatMap((child) => getInternalNode(child))];
}

export const ProfilSectionValid = Object.values(ProfilSectionEnum) as string[];

export function isProfilSection(section?: string): boolean {
  if (section === undefined) {
    return true;
  }
  return ProfilSectionValid.includes(section);
}

export function generateProfilUrl(username: string, item: ProfilSectionEnum | string, ranking?: RankingType, usernames?: string[]) {
  if (!isProfilSection(item)) {
    throw new Error(`Invalid section given in generateProfilUrl ${item}`);
  }
  const argItem = item ? `section=${item}` : "";
  const argUsername = usernames && usernames.length != 0 ? `usernames=${usernames}` : "";
  const argRanking = ranking ? `category=${ranking}` : "";
  const args = [argItem, argRanking, argUsername].filter((e) => e).join("&");
  return safeJoinPaths(constants.profilPath, username, `?${args}`);
}

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

  let currentUpgrade = playerInfo.building.reduce((acc, building) => acc + building.own, 0)
    + playerInfo.CPS.reduce((acc, cps) => acc + (cps.own ? 1 : 0), 0)
    + playerInfo.global_upgrade.reduce((acc, global) => acc + (global.own ? 1 : 0), 0)
    + playerInfo.terrain_upgrade.reduce((acc, terrain) => acc + (terrain.own ? 1 : 0), 0)
    + playerInfo.building_upgrade.reduce((acc, building) => acc + (building.own ? 1 : 0), 0)
    + playerInfo.many_upgrade.reduce((acc, many) => acc + (many.own ? 1 : 0), 0)
    + playerInfo.posterior_upgrade.reduce((acc, posterior) => acc + (posterior.own ? 1 : 0), 0);

  return currentUpgrade * 100 / maxUpgrade;
}

export function mountureGetNeededXpForLevel(level: number) {
  let sum = 0;
  for (let i = 2; i <= level; i++) {
    sum += Math.pow(i, 2.5);
  }
  return sum;
}

export function montureGetLevelFromXp(xp: number) {
  for (let lvl = 0; lvl <= 100; lvl++) {
    let needed = mountureGetNeededXpForLevel(lvl);
    if (xp < needed) {
      return lvl;
    }
  }
  return 100;
}

export function montureGetCoef(xp: number, curLevel: number) {
  let needed = mountureGetNeededXpForLevel(curLevel);
  return xp / needed;
}

export function petGetNeededXpForLevel(level: number): number {
  if (level === 0) {
    return 0;
  }
  return (level * level - 1) * (90 / level) + 300 + petGetNeededXpForLevel(level - 1);
}

export function petGetLevelFromXp(xp: number) {
  for (let lvl = 0; lvl <= 100; lvl++) {
    let needed = petGetNeededXpForLevel(lvl);
    if (xp < needed) {
      return lvl;
    }
  }
  return 100;
}

export function petGetCoef(xp: number, xpNeeded: number) {
  return xp / xpNeeded;
}

export function getTextFromWebHookType(webHookType: WebHookType) {
  switch (webHookType) {
  case WebHookType.QDF:
    return "QDF";
  case WebHookType.adminShop:
    return "AdminShop";
  case WebHookType.market:
    return "Market";
  case WebHookType.EventPvp:
    return "Event";
  case WebHookType.statusServer:
    return "Status serveur";
  case WebHookType.vote:
    return "Vote";
  default:
    return `Unknown WebHookType ${webHookType}`;
  }
}

export function addMissingDate(data: RankingResponse) {
  const filledData: RankingResponse = [];
  const groupedByUser: Record<string, RankingResponse> = {};

  data.forEach((entry) => {
    if (!groupedByUser[entry.username]) {
      groupedByUser[entry.username] = [];
    }
    groupedByUser[entry.username].push(entry);
  });

  Object.values(groupedByUser).forEach((userEntries) => {
    userEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (let i = 0; i < userEntries.length; i++) {
      filledData.push(userEntries[i]);

      if (i > 0) {
        const prevEntry = userEntries[i - 1];
        const currEntry = userEntries[i];

        let prevDate = new Date(prevEntry.date);
        let currDate = new Date(currEntry.date);
        let nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() + 1);

        while (nextDate < currDate) {
          filledData.push({
            uuid: prevEntry.uuid,
            username: prevEntry.username,
            date: nextDate.toISOString().split("T")[0],
            value: prevEntry.value,
            position: prevEntry.position,
          });

          nextDate.setDate(nextDate.getDate() + 1);
        }
      }
    }
  });

  return filledData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

}

export function getRoleColor(role: Role) {
  switch (role) {
  case "Admin":
    return "#EF4444";
  case "Moderator":
    return "#10B981";
  case "Bug Hunter":
    return "#06B6D4";
  case "Beta Tester":
    return "#EC4899";
  case "Palatime":
    return "#F59E0B";
  case "Classic":
    return "#ff5c00";
  default:
    return "#8B5CF6";
  }
}

export const CraftSectionValid = Object.values(CraftSectionEnum) as string[];

export function parseMessageCraftPrice(message: any) : {type: "update" | "other", data: CraftPrice[]} {

  function isCraftPrice(item: any): boolean {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof item.created_at === 'string' &&
        typeof item.item === 'object' && typeof item.item.item_name === 'string' && typeof item.item.us_trad === 'string' && typeof item.item.fr_trad === 'string' && typeof item.item.img === 'string' &&
      typeof item.priceToCraft === 'number' &&
      typeof item.currentPrice === 'number' &&
      typeof item.averagePrice === 'number' &&
      typeof item.totalSold === 'number'
    );
  }

  try {
    const json = JSON.parse(message);
    if (json.type === "update" && Array.isArray(json.data)) {
      const r : CraftPrice[] = json.data.map((item: any) => {
        if(isCraftPrice(item)) {
          return {
            created_at: item.created_at,
            item: {
              item_name: item.item.item_name,
              us_trad: item.item.us_trad,
              fr_trad: item.item.fr_trad,
              img: item.item.img
            },
            priceToCraft: Number(item.priceToCraft),
            currentPrice: Number(item.currentPrice),
            averagePrice: Number(item.averagePrice),
            totalSold: Number(item.totalSold)
          };
        } else {
          throw new Error(`Invalid item format: ${JSON.stringify(item)}`);
        }
      });
      return {type: "update", data: r};
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return {type: "other", data: []};
  }
  return {type: "other", data: []};
}

export function getHeadUrl(uuid: string | undefined) {
  if(!uuid || uuid === "") {
    return "/img/palatracker_head.png";
  } // palatracker skin
  return `https://crafatar.com/avatars/${uuid}?size=8&overlay`;
}