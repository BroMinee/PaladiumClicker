import { parseCsv } from "@/lib/misc";

import {
  AhItemHistory,
  AhPaladium,
  Building,
  BuildingUpgrade,
  CategoryUpgrade,
  CPS,
  GlobalUpgrade,
  ManyUpgrade,
  Metier,
  NetworkError,
  PaladiumAhHistory,
  PaladiumAhItemStat,
  PaladiumClickerData,
  PaladiumFactionInfo,
  PaladiumFactionLeaderboard,
  PaladiumFriendInfo, PaladiumJobs,
  PaladiumPlayerInfo,
  PaladiumRanking,
  PlayerInfo,
  PosteriorUpgrade,
  TerrainUpgrade,
} from "@/types";
import axios from "axios";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";

const PALADIUM_API_URL = "https://palatracker.bromine.fr/";

const fetchLocal = async <T>(file: string) => {
  const result = await axios<T>(import.meta.env.BASE_URL + file, {
    headers: {
      Accept: "application/json",
    }
  });

  if (result.status !== 200) {
    throw result;
  }

  return result.data;
}

export default fetchLocal;

const getPaladiumProfileByPseudo = async (pseudo: string): Promise<PaladiumPlayerInfo> => {
  const response = await axios.get<PaladiumPlayerInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${pseudo}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get player information by pseudo\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

const getPlayerJobFromUUID = async (uuid: string): Promise<PaladiumJobs> => {
  return axios.get<PaladiumJobs>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/jobs`, {
    timeout: 4000
  }).then((response) => {
    if (response.status !== 200) {
      throw response;
    }

    return response.data;
  });
}

export const getPaladiumLeaderboardPositionByUUID = async (uuid: string): Promise<string> => {
// set a timeout of 2 seconds to avoid blocking the main thread for too long
  const response = await axios.get<PaladiumRanking>(`${PALADIUM_API_URL}/v1/paladium/ranking/position/clicker/${uuid}`, {
    timeout: 4000
  }).catch((error) => error);

  if(response.data.type === "AUTHORIZATION_ERROR")
    return "Unranked"
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
  const response = await axios.get<PaladiumClickerData>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/clicker`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get player's clicker information\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const getFactionInfo = async (factionName: string): Promise<PaladiumFactionInfo> => {
  const response = await axios.get<PaladiumFactionInfo>(`${PALADIUM_API_URL}/v1/paladium/faction/profile/${factionName}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get faction profile\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const getFactionLeaderboard = async (): Promise<PaladiumFactionLeaderboard> => {
  const response = await axios.get<PaladiumFactionLeaderboard>(`${PALADIUM_API_URL}/v1/paladium/faction/leaderboard`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get faction leaderboard\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const getAuctionHouseInfo = async (uuid: string) => {
  const response = await axios.get<PaladiumAhItemStat>(`${PALADIUM_API_URL}/v1/paladium/shop/market/players/${uuid}/items`, {
    timeout: 4000
  }).catch((error) => error);

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

  return res;
}

export const getFriendsList = async (uuid: string): Promise<PaladiumFriendInfo> => {
  const response = await axios.get<PaladiumFriendInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/friends`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get player friend list\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
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

  const localData = usePlayerInfoStore.getState().data;

  if (localData !== null && localData.username === pseudo && localData.uuid !== "" && new Date().getTime() - localData.last_fetch < 5 * 60 * 1000) {
    throw "Profil déjà importé, veuillez patienter 5 minutes avant de réimporter le profil"
  }

  const initialPlayerInfo = await getInitialPlayerInfo();

  const paladiumProfil = await getPaladiumProfileByPseudo(pseudo);
  const { buildings, upgrades } = await getPaladiumClickerDataByUUID(paladiumProfil.uuid);
  paladiumProfil.jobs = await getPlayerJobFromUUID(paladiumProfil.uuid);

  const translateBuildingName = await fetchLocal<Record<string, number>>("/translate_building.json");
  const translateBuildingUpgradeName = await fetchLocal<
    Record<string, [keyof Pick<PlayerInfo, "building_upgrade">, string]>
  >("/translate_upgrade.json");

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

    const targettedBuildingUpgrade = initialPlayerInfo[translatedUpgrade].at(Number(translatedPosition));

    if (targettedBuildingUpgrade) {
      targettedBuildingUpgrade.own = true;
    }
  });

  const AhInfo = await getAuctionHouseInfo(paladiumProfil.uuid);

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

  const existingJobs = ["miner", "farmer", "hunter", "alchemist"] as const;

  existingJobs.forEach((job, index) => {
    if (paladiumProfil.jobs[job] === undefined) {
      return;
    }
    initialPlayerInfo.metier[index].level = paladiumProfil.jobs[job].level;
    initialPlayerInfo.metier[index].xp = paladiumProfil.jobs[job].xp;
  });

  return initialPlayerInfo;
}

const getInitialPlayerInfo = async (): Promise<PlayerInfo> => {

  const metiers = await fetchLocal<Metier[]>("/metier.json");
  const buildings = await fetchLocal<Building[]>("/building.json");
  for(let i = 0; i < buildings.length; i++) {
    buildings[i].base_production = String(0.10000000149011612  * Math.pow(1.7999999523162842, i));
  }
  const buildingUpgrade = await fetchLocal<BuildingUpgrade[]>("/building_upgrade.json");
  const categoryUpgrade = await fetchLocal<CategoryUpgrade[]>("/category_upgrade.json");
  const CPS = await fetchLocal<CPS[]>("/CPS.json");
  const globalUpgrade = await fetchLocal<GlobalUpgrade[]>("/global_upgrade.json");
  const manyUpgrade = await fetchLocal<ManyUpgrade[]>("/many_upgrade.json");
  const posteriorUpgrade = await fetchLocal<PosteriorUpgrade[]>("/posterior_upgrade.json");
  const terrainUpgrade = await fetchLocal<TerrainUpgrade[]>("/terrain_upgrade.json");
  const playerInfo: PlayerInfo = {
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
  };
  return playerInfo;
}

export const getGraphData = async () => {
  const parsedCsv = await fetchLocal<string>("/graph.csv").then(parseCsv);

  const data = parsedCsv
    .filter((data) => data.Date !== "")
    .map((data) => {
      for (const key in data) {
        if (key === "Date") {

        } else {
          data[key] = data[key] === "" ? "" : Number(data[key]);
        }
      }
      return data;
    });

  return data;
}

export const getAhItemData = async () => {
  return await fetchLocal<AhPaladium[]>("/AhAssets/items_list.json");
}

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
    const response = await axios.get<PaladiumAhHistory>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}/history?offset=${offset}&limit=100`, {
      timeout: 4000
    }).catch((error) => error);

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
  const response = await axios.get<PaladiumAhItemStat>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get item information in the Market Shop\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }
  return response.data;
}
