import type { AnyCondition, PlayerInfo } from "@/types";

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
    "CPS",
    "metier"
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
            for (let i = 0; i < (element.own as number); i++)
              total += computePrice(element.price ?? -1, i);
          } else
            total += element.price ?? 0;
        }
      }
    }
  }
  return total;
}

function getCoinsCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined)
    return 0;

  const r = conditions.find(c => typeof c !== 'undefined' && "coins" in c) as { coins: number } | undefined;
  return r ? r.coins : -1;
}

function getBuildingIndexCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined)
    return 0;
  const r = conditions.find(c => typeof c !== 'undefined' && "index" in c) as { index: number } | undefined;
  return r ? r.index : -1;
}

function getBuildingCountCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined)
    return 0;
  const r = conditions.find(c => typeof c !== 'undefined' && "own" in c) as { own: number } | undefined;
  return r ? r.own : -1;
}

function getDayCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined)
    return 0;
  const r = conditions.find(c => typeof c !== 'undefined' && "day" in c) as { day: number } | undefined;
  return r ? r.day : -1;
}


// unlockable, coins, totalCoins, day, daySinceStart, buildingIndex, buildingNeed, buildingCount
export function checkCondition(playerInfo: PlayerInfo, conditions: AnyCondition) {
  const coinsCondition = getCoinsCondition(conditions);
  const dayCondition = getDayCondition(conditions);
  const totalCoins = playerInfo.production;
  const buildingIndex = getBuildingIndexCondition(conditions);
  const buildingNeed = getBuildingCountCondition(conditions);
  const daySinceStart = (new Date().getTime() - new Date("2024-02-18").getTime()) / (1000 * 60 * 60 * 24);
  const buildingCount = buildingIndex === -1 ? -1 : playerInfo["building"][buildingIndex]["own"];

  const unlockable = totalCoins >= coinsCondition &&
    daySinceStart >= dayCondition &&
    (buildingIndex === -1 ? true : Number(playerInfo.building[buildingIndex].own) >= buildingNeed); // TODO change day

  return [unlockable, coinsCondition, totalCoins, dayCondition, daySinceStart, buildingIndex, buildingNeed, buildingCount];
}

export function formatPrice(price: number | undefined) {
  if (price === undefined)
    return "Error";
  const numberFormatter = new Intl.NumberFormat("fr-FR");
  return numberFormatter.format(price);
}

export function computePrice(priceLevel0: number, level: number) {
  return Math.round(priceLevel0 * Math.pow(1.100000023841858, level));
}

export function getPathImg(bestListName: string, bestUpgradeIndex: number) {
  switch (bestListName) {
    case "building":
      return safeJoinPaths( "/BuildingIcon/", `${bestUpgradeIndex}.png`);
    case "building_upgrade":
      return safeJoinPaths( "/BuildingUpgradeIcon/", (bestUpgradeIndex < 16 ? "0" : "1") + ".png");
    case "category_upgrade":
      return safeJoinPaths( "/CategoryIcon/", `${bestUpgradeIndex}.png`);
    case "global_upgrade":
      return safeJoinPaths( "/GlobalIcon/", `${bestUpgradeIndex}.png`);
    case "many_upgrade":
      return safeJoinPaths( "/ManyIcon/0.png");
    case "terrain_upgrade":
      return safeJoinPaths( "/TerrainIcon/", `${bestUpgradeIndex}.png`);
    case "posterior_upgrade":
      return safeJoinPaths( "/PosteriorIcon/0.png");
    default:
      alert("Error in bestListName");
      return safeJoinPaths( "/BuildingUpgradeIcon/0.png");
  }
}

export function parseCsv(csv: string) {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(";");
  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string | 'Date', string | number | "NaN"> = {};
    const currentline = lines[i].split(";");
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  return result;
}

export function levensteinDistance(a: string, b: string) {
  const distance = [];
  for (let i = 0; i <= a.length; i++) {
    distance[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    distance[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      distance[i][j] = Math.min(
        distance[i - 1][j] + 1,
        distance[i][j - 1] + 1,
        distance[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
      );
    }
  }
  return distance[a.length][b.length];
}

export function getDDHHMMSS(d: Date) {
  if (new Date() > d)
    return "Maintenant";
  const padL = (num: number, chr = `0`) => `${num}`.padStart(2, chr);

  return `${padL(d.getDate())}/${padL(d.getMonth() + 1)}/${d.getFullYear()} à ${padL(d.getHours())}:${padL(d.getMinutes())}:${padL(d.getSeconds())}`;
}

export function adaptPlurial(word: string, count: number) {
  return count >= 2 ? word + "s" : word;
}

export function safeJoinPaths(base: string, ...paths: string[]): string {
  const allPaths = ["/" + base, ...paths];
  const result = allPaths.join('/');
  return result.replace(/\/+/g, '/');
}