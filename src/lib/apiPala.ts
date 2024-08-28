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
  NetworkError,
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

import axios from "axios";

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
import { getViewsFromUUID } from "@/lib/apiPalaTracker";


const PALADIUM_API_URL = "https://api.paladium.games/";


// configure timeout to 4 seconds
axios.defaults.timeout = 4000;

// configure header to have Authorization
axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_PALADIUM_API_KEY}`;


export const isApiDown = async (): Promise<boolean> => {
  const response = await axios.get(`${PALADIUM_API_URL}/v1/status`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      return true;
    }
  }
  return response.status !== 200;
}


const getPaladiumProfileByPseudo = async (pseudo: string): Promise<PaladiumPlayerInfo> => {
  const response = await axios.get<PaladiumPlayerInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${pseudo}`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get player information by pseudo\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as PaladiumPlayerInfo;
}

export const getPaladiumLeaderboardPositionByUUID = async (uuid: string): Promise<string> => {
// set a timeout of 2 seconds to avoid blocking the main thread for too long
  const response = await axios.get<PaladiumRanking>(`${PALADIUM_API_URL}/v1/paladium/ranking/position/clicker/${uuid}`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get player positions in a specific leaderboard\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    return "Error";
  }

  return response.data.ranked ? response.data.position.toString() : "Unranked";
}

const getPaladiumClickerDataByUUID = async (uuid: string): Promise<PaladiumClickerData> => {
  const response = await axios.get<PaladiumClickerData>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/clicker`).catch((error) => error);

  axios.get<PaladiumClickerData>(`https://palatracker.bromine.fr/v1/paladium/player/profile/${uuid}`)

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get player's clicker information\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as PaladiumClickerData;
}

export const getFactionInfo = async (factionName: string): Promise<PaladiumFactionInfo> => {
  const response = await axios.get<PaladiumFactionInfo>(`${PALADIUM_API_URL}/v1/paladium/faction/profile/${factionName}`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get faction profile\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as PaladiumFactionInfo;
}

export const getFactionLeaderboard = async (): Promise<PaladiumFactionLeaderboard> => {
  const response = await axios.get<PaladiumFactionLeaderboard>(`${PALADIUM_API_URL}/v1/paladium/faction/leaderboard`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get faction leaderboard\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as PaladiumFactionLeaderboard;
}

export const getAuctionHouseInfo = async (uuid: string): Promise<AhType> => {
  const response = await axios.get<AhType>(`${PALADIUM_API_URL}/v1/paladium/shop/market/players/${uuid}/items`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get items for sale of a player in the Market Shop\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  const res = response.data;
  res.dateUpdated = new Date().getTime();

  return res as AhType;
}

export const getFriendsList = async (uuid: string): Promise<PaladiumFriendInfo> => {
  const response = await axios.get<PaladiumFriendInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/friends`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get player friend list\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as PaladiumFriendInfo;
}

export const getPlayerInfo = async (pseudo: string): Promise<PlayerInfo> => {

  if (pseudo === "") {
    throw "Pseudo is empty";
  } else if (pseudo.includes(" ")) {
    throw "Pseudo contains space";
  } else if (/^[a-zA-Z0-9_]+$/.test(pseudo) === false) {
    throw "Pseudo doit contenir que des lettres ou des chiffres";
  } else if (pseudo.length <= 3) {
    throw "Pseudo trop court";
  } else if (pseudo.length > 16) {
    throw "Pseudo trop long";
  }

  const initialPlayerInfo = await getInitialPlayerInfo();

  const paladiumProfil = await getPaladiumProfileByPseudo(pseudo);
  const { buildings, upgrades } = await getPaladiumClickerDataByUUID(paladiumProfil.uuid);

  const translateBuildingName = translate_building_json as Record<string, number>;
  const translateBuildingUpgradeName = translate_upgrade_json as Record<string, (string | number)[]>;


  buildings.forEach((building) => {
    const buildingIndex = translateBuildingName[building["name"]];
    if (buildingIndex === undefined)
      throw `Unknown building name : '${building["name"]}', please contact the developer to fix it`;
    initialPlayerInfo["building"][buildingIndex].own = building["quantity"];
    initialPlayerInfo["production"] += building["production"];
  })
  upgrades.forEach((upgrade) => {
    const pathToFollow = translateBuildingUpgradeName[upgrade];
    if (pathToFollow === undefined)
      throw `Unknown upgrade name : '${upgrade}', please contact the developer to fix it`;

    const [translatedUpgrade, translatedPosition] = pathToFollow;

    const targettedBuildingUpgrade = initialPlayerInfo[translatedUpgrade as keyof Pick<PlayerInfo, "building_upgrade">].at(translatedPosition as number);

    if (targettedBuildingUpgrade) {
      targettedBuildingUpgrade.own = true;
    }
  });

  const AhInfo = await getAuctionHouseInfo(paladiumProfil.uuid);
  initialPlayerInfo.metier = await getJobsFromUUID(paladiumProfil.uuid);

  const friendsList = await getFriendsList(paladiumProfil.uuid)

  initialPlayerInfo.faction = { name: paladiumProfil.faction === "" ? "Wilderness" : paladiumProfil.faction };
  initialPlayerInfo.firstJoin = paladiumProfil.firstJoin;
  initialPlayerInfo.friends = friendsList;
  initialPlayerInfo.money = paladiumProfil.money;
  initialPlayerInfo.timePlayed = paladiumProfil.timePlayed;
  initialPlayerInfo.username = paladiumProfil.username;
  initialPlayerInfo.uuid = paladiumProfil.uuid;
  initialPlayerInfo.rank = paladiumProfil.rank;
  initialPlayerInfo.ah = AhInfo;
  initialPlayerInfo.leaderboard = await getPaladiumLeaderboardPositionByUUID(paladiumProfil.uuid);
  initialPlayerInfo.faction = await getFactionInfo(initialPlayerInfo.faction.name);
  initialPlayerInfo.view_count = await getViewsFromUUID(paladiumProfil.uuid);

  return initialPlayerInfo;
}

const getInitialPlayerInfo = async (): Promise<PlayerInfo> => {

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
    faction: { name: "Wilderness" },
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
// export const getAhItemData = async () => {
//   return await fetchLocal<AhPaladium[]>("/AhAssets/items_list.json");
// }

export const getPaladiumAhItemFullHistory = async (itemId: string): Promise<AhItemHistory[]> => {
  const response = await axios.get<PaladiumAhHistory>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}/history?limit=100&offset=0`);

  if (response.status !== 200) {
    throw response;
  }

  const totalCount = response.data.totalCount;

  let data = response.data.data;
  let offset = 100;
  let c = 0;
  while (offset < totalCount && c <= 10) {
    const response = await axios.get<PaladiumAhHistory>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}/history?offset=${offset}&limit=100`).catch((error) => error);

    if (response instanceof Error) {
      if ((response as NetworkError).code === "ECONNABORTED") {
        throw "Timeout error of \"Get item history in the Market Shop\" API, please try again later";
      }
    }


    if (response.status !== 200) {
      throw response;
    }
    data = data.concat(response.data.data);
    offset += 100;
    c++;
  }

  console.assert(data.length === totalCount, "Data length is not equal to totalCount");

  return data;
}

export const getPaladiumAhItemStats = async (itemId: string): Promise<PaladiumAhItemStat> => {
  const response = await axios.get<PaladiumAhItemStat>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get item information in the Market Shop\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }
  return response.data as PaladiumAhItemStat;
}

export const getJobsFromUUID = async (uuid: string): Promise<Metiers> => {
  const response = await axios.get<Metiers>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/jobs`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get player jobs by UUID\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }


  // NOTE we take the original JSON to have name easily modifiable
  const res = metier_json as Metiers;

  res.farmer.level = response.data.farmer.level;
  res.farmer.xp = response.data.farmer.xp;

  res.hunter.level = response.data.hunter.level;
  res.hunter.xp = response.data.hunter.xp;

  res.alchemist.level = response.data.alchemist.level;
  res.alchemist.xp = response.data.alchemist.xp;

  res.miner.level = response.data.miner.level;
  res.miner.xp = response.data.miner.xp;

  return res as Metiers;
}
