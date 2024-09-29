import 'server-only';

import {
  AhItemHistory,
  AhType,
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
} from "@/types";


import translate_building_json from "@/assets/translate_building.json";
import translate_upgrade_json from "@/assets/translate_upgrade.json";
import metier_json from "@/assets/metier.json";
import { getViewsFromUUID } from "@/lib/api/apiPalaTracker.ts";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { redirect } from "next/navigation";
import { getInitialPlayerInfo } from "@/lib/misc.ts";


const PALADIUM_API_URL = "https://api.paladium.games";


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

export const getPlayerOnlineCount = async (): Promise<number> => {
  const response = await fetchWithHeader<{
    java: {
      global: {
        players: number;
      }
    }
  }>(`${PALADIUM_API_URL}/v1/status`, 0).catch(() => { return { java: { global: { players: -1 } } } });
  return response.java.global.players;
}


export const getPaladiumProfileByPseudo = async (pseudo: string): Promise<PaladiumPlayerInfo> => {
  return await fetchWithHeader<PaladiumPlayerInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${pseudo}`, 15 * 60, pseudo);
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

  return await fetchWithHeader<PaladiumFactionInfo>(`${PALADIUM_API_URL}/v1/paladium/faction/profile/${factionName}`).catch(() => {
    return {
      name: "Wilderness",
      access: "INVITATION",
      createdAt: 1726671074505,
      description: "Zone libre",
      emblem: {
        backgroundId: 0,
        borderColor: -1,
        backgroundColor: -1,
        forcedTexture: "wilderness",
        foregroundColor: -1,
        foregroundId: 0,
        iconBorderColor: -1,
        iconColor: -1,
        iconId: 0,
      },
      level: { level: 1, xp: 0 },
      players: [],
      uuid: "00000000-0000-0000-0000-000000000000"
    };
  });
}

export const getFactionLeaderboard = async (): Promise<PaladiumFactionLeaderboard> => {
  return await fetchWithHeader<PaladiumFactionLeaderboard>(`${PALADIUM_API_URL}/v1/paladium/faction/leaderboard`);
}

export const getAuctionHouseInfo = async (uuid: string): Promise<AhType> => {
  return {
    data: [],
    totalCount: 0,
    dateUpdated: new Date().getTime(),
  }
  const response = await fetchWithHeader<AhType>(`${PALADIUM_API_URL}/v1/paladium/shop/market/players/${uuid}/items`)
  response.dateUpdated = new Date().getTime();
  return response;
}

export const getFriendsList = async (uuid: string): Promise<PaladiumFriendInfo> => {
  return await fetchWithHeader<PaladiumFriendInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/friends`).catch(() => {
    return {
      data: [],
      totalCount: 0
    }
  });
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
