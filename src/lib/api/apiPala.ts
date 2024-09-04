import 'server-only';

import {
  AhItemHistory,
  AhType,
  Building,
  BuildingUpgrade,
  CategoryUpgrade,
  CPS,
  GlobalUpgrade,
  ManyUpgrade,
  Metiers,
  MetiersPossiblyUndefined,
  PaladiumAhHistory,
  PaladiumAhItemStat,
  PaladiumClickerData,
  PaladiumFactionInfo,
  PaladiumFactionLeaderboard,
  PaladiumFriendInfo,
  PaladiumPlayerInfo,
  PaladiumRanking,
  PlayerInfo,
  PosteriorUpgrade,
  TerrainUpgrade,
} from "@/types";


import translate_building_json from "@/assets/translate_building.json";
import translate_upgrade_json from "@/assets/translate_upgrade.json";
import building_json from "@/assets/building.json";
import building_upgrade_json from "@/assets/building_upgrade.json";
import metier_json from "@/assets/metier.json";
import category_upgrade_json from "@/assets/category_upgrade.json";
import CPS_json from "@/assets/CPS.json";
import global_upgrade_json from "@/assets/global_upgrade.json";
import many_upgrade_json from "@/assets/many_upgrade.json";
import posterior_upgrade_json from "@/assets/posterior_upgrade.json";
import terrain_upgrade_json from "@/assets/terrain_upgrade.json";
import { getViewsFromUUID } from "@/lib/api/apiPalaTracker.ts";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { redirect } from "next/navigation";


const PALADIUM_API_URL = "https://api.paladium.games/";


export const isApiDown = async (): Promise<boolean> => {
  let response = null;

  try {
    response = await fetch(`${PALADIUM_API_URL}/v1/status`, {
      cache: 'no-cache', signal: AbortSignal.timeout(4000), headers: {
        'Authorization': `Bearer ${process.env.PALADIUM_API_KEY}`
      }
    })
    await response.json();

    if (!response.ok) return true;
  } catch (error) {
    return true;
  }
  return false;
}


export const getPaladiumProfileByPseudo = async (pseudo: string): Promise<PaladiumPlayerInfo> => {
  return await fetchWithHeader<PaladiumPlayerInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${pseudo}`);
}

export const getPaladiumLeaderboardPositionByUUID = async (uuid: string): Promise<string> => {
  const response = await fetchWithHeader<PaladiumRanking>(`${PALADIUM_API_URL}/v1/paladium/ranking/position/clicker/${uuid}`);
  return response.ranked ? response.position.toString() : "Unranked";
}

const getPaladiumClickerDataByUUID = async (uuid: string): Promise<PaladiumClickerData> => {
  return await fetchWithHeader<PaladiumClickerData>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/clicker`)
}

export const getFactionInfo = async (factionName: string): Promise<PaladiumFactionInfo> => {
  if (factionName === "")
    factionName = "Wilderness";
  return await fetchWithHeader<PaladiumFactionInfo>(`${PALADIUM_API_URL}/v1/paladium/faction/profile/${factionName}`)
}

export const getFactionLeaderboard = async (): Promise<PaladiumFactionLeaderboard> => {
  return await fetchWithHeader<PaladiumFactionLeaderboard>(`${PALADIUM_API_URL}/v1/paladium/faction/leaderboard`);
}

export const getAuctionHouseInfo = async (uuid: string): Promise<AhType> => {
  const response = await fetchWithHeader<AhType>(`${PALADIUM_API_URL}/v1/paladium/shop/market/players/${uuid}/items`)
  response.dateUpdated = new Date().getTime();
  return response;
}

export const getFriendsList = async (uuid: string): Promise<PaladiumFriendInfo> => {
  return await fetchWithHeader<PaladiumFriendInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/friends`)
}

export const getPlayerInfo = async (pseudo: string): Promise<PlayerInfo> => {
  let initialPlayerInfo = null;
  try {
    if (pseudo === "") {
      throw "Pseudo is empty";
    } else if (pseudo.includes(" ")) {
      throw "Pseudo contains space";
    } else if (!/^[a-zA-Z0-9_]+$/.test(pseudo)) {
      throw "Pseudo doit contenir que des lettres ou des chiffres";
    } else if (pseudo.length <= 3) {
      throw "Pseudo trop court";
    } else if (pseudo.length > 16) {
      throw "Pseudo trop long";
    }
  } catch (error) {
    redirect(`/error?message=${error}&username=${pseudo}`);
  }


  let paladiumProfil = await getPaladiumProfileByPseudo(pseudo);


  // Do all fetches in parallel to save time
  const p1 = getPaladiumClickerDataByUUID(paladiumProfil.uuid);
  const p2 = getAuctionHouseInfo(paladiumProfil.uuid);
  const p3 = getFriendsList(paladiumProfil.uuid);
  const p4 = getJobsFromUUID(paladiumProfil.uuid);
  const p5 = getPaladiumLeaderboardPositionByUUID(paladiumProfil.uuid);
  const p6 = getFactionInfo(paladiumProfil.faction === "" ? "Wilderness" : paladiumProfil.faction);
  const p7 = getViewsFromUUID(paladiumProfil.uuid);


  const [clickerData, ahInfo, friendList, metiers, leaderboardPosition, paladiumFactionInfo, viewCount] = await Promise.all([p1, p2, p3, p4, p5, p6, p7]);


  // NOTE: We use structuredClone to avoid modifying the original JSON by accident (it already happened once oupsy)
  initialPlayerInfo = structuredClone(getInitialPlayerInfo());

  const translateBuildingName = translate_building_json as Record<string, number>;
  const translateBuildingUpgradeName = translate_upgrade_json as Record<string, (string | number)[]>;


  clickerData.buildings.forEach((building) => {
    const buildingIndex = translateBuildingName[building["name"]];
    if (buildingIndex === undefined)
      throw `Unknown building name : '${building["name"]}', please contact the developer to fix it`;
    initialPlayerInfo["building"][buildingIndex].own = building["quantity"];
    initialPlayerInfo["production"] += building["production"];
  })
  clickerData.upgrades.forEach((upgrade) => {
    const pathToFollow = translateBuildingUpgradeName[upgrade];
    if (pathToFollow === undefined)
      throw `Unknown upgrade name : '${upgrade}', please contact the developer to fix it`;

    const [translatedUpgrade, translatedPosition] = pathToFollow;

    const targettedBuildingUpgrade = initialPlayerInfo[translatedUpgrade as keyof Pick<PlayerInfo, "building_upgrade">].at(translatedPosition as number);

    if (targettedBuildingUpgrade) {
      targettedBuildingUpgrade.own = true;
    }
  });


  initialPlayerInfo.metier = metiers;

  const friendsList = friendList;

  initialPlayerInfo.firstJoin = paladiumProfil.firstJoin;
  initialPlayerInfo.friends = friendsList;
  initialPlayerInfo.money = paladiumProfil.money;
  initialPlayerInfo.timePlayed = paladiumProfil.timePlayed;
  initialPlayerInfo.username = paladiumProfil.username;
  initialPlayerInfo.uuid = paladiumProfil.uuid;
  initialPlayerInfo.rank = paladiumProfil.rank;
  initialPlayerInfo.ah = ahInfo;
  initialPlayerInfo.leaderboard = leaderboardPosition;
  initialPlayerInfo.faction = paladiumFactionInfo;
  initialPlayerInfo.view_count = viewCount;


  return initialPlayerInfo;

}

const getInitialPlayerInfo = (): PlayerInfo => {

  const metiers = metier_json as Metiers;
  const buildings = building_json as Building[];
  for (let i = 0; i < buildings.length; i++) {
    buildings[i].base_production = String(0.10000000149011612 * Math.pow(1.7999999523162842, i));
  }
  const buildingUpgrade = building_upgrade_json as BuildingUpgrade[];
  const categoryUpgrade = category_upgrade_json as CategoryUpgrade[];
  const CPS = CPS_json as CPS[];
  const globalUpgrade = global_upgrade_json as GlobalUpgrade[];
  const manyUpgrade = many_upgrade_json as ManyUpgrade[];
  const posteriorUpgrade = posterior_upgrade_json as PosteriorUpgrade[];
  const terrainUpgrade = terrain_upgrade_json as TerrainUpgrade[];
  return {
    metier: metiers,
    building: buildings,
    building_upgrade: buildingUpgrade,
    category_upgrade: categoryUpgrade,
    CPS: CPS,
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
    firstJoin: 0,
    friends: { data: [], totalCount: 0 },
    money: 0,
    timePlayed: 0,
    username: "",
    uuid: "",
    rank: "Rank inconnu",
    leaderboard: "Unranked",
    ah: { data: [], totalCount: 0, dateUpdated: 0 },
    last_fetch: new Date().getTime(),
    view_count: { count: 0, uuid: "" },
  };
}

// export const getGraphData = async () => {
//   const parsedCsv = await fetchLocal<string>("/graph.csv").then(parseCsv);
//
//   const data = parsedCsv
//     .filter((data) => data.Date !== "")
//     .map((data) => {
//       for (const key in data) {
//         if (key !== "Date") {
//           data[key] = data[key] === "" ? "" : Number(data[key]);
//         }
//       }
//       return data;
//     });
//
//   return data;
// }
//


export const getPaladiumAhItemFullHistory = async (itemId: string): Promise<AhItemHistory[]> => {
  const response = await fetchWithHeader<PaladiumAhHistory>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}/history?limit=100&offset=0`);
  const totalCount = response.totalCount;

  let data = response.data;
  let offset = 100;
  let c = 0;
  while (offset < totalCount && c <= 10) {
    const response = await fetchWithHeader<PaladiumAhHistory>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}/history?offset=${offset}&limit=100`)
    data = data.concat(response.data);
    offset += 100;
    c++;
  }

  console.assert(data.length === totalCount, "Data length is not equal to totalCount");

  return data;
}

export const getPaladiumAhItemStats = async (itemId: string): Promise<PaladiumAhItemStat> => {
  return await fetchWithHeader<PaladiumAhItemStat>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}`)
}

export const getJobsFromUUID = async (uuid: string): Promise<Metiers> => {
  const response = await fetchWithHeader<MetiersPossiblyUndefined>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/jobs`)


  // NOTE we take the original JSON to have name easily modifiable (for example response.farmer.name witch is not in the response JSON)
  const initialMetierJson = structuredClone(metier_json as Metiers);


  if (response.farmer) {
    initialMetierJson.farmer.level = response.farmer.level;
    initialMetierJson.farmer.xp = response.farmer.xp;
  }

  if (response.hunter) {
    initialMetierJson.hunter.level = response.hunter.level;
    initialMetierJson.hunter.xp = response.hunter.xp;
  }

  if (response.alchemist) {
    initialMetierJson.alchemist.level = response.alchemist.level;
    initialMetierJson.alchemist.xp = response.alchemist.xp;
  }
  if (response.miner) {
    initialMetierJson.miner.level = response.miner.level;
    initialMetierJson.miner.xp = response.miner.xp;
  }

  return initialMetierJson as Metiers;
}
