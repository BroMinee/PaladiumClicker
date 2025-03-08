import 'server-only';
import { cookies } from 'next/headers';

import {
  Achievement,
  AhItemHistory,
  AhType,
  CategoryEnum,
  Metiers,
  MetiersPossiblyUndefined,
  MountInfo,
  PaladiumAhHistory,
  PaladiumAhItemStat,
  PaladiumClickerData,
  PaladiumFactionInfo,
  PaladiumFactionLeaderboard,
  PaladiumFriendInfo,
  PaladiumPlayerInfo,
  PaladiumRanking,
  PetInfo,
  PlayerInfo,
  Role,
} from "@/types";


import translate_building_json from "@/assets/translate_building.json";
import translate_upgrade_json from "@/assets/translate_upgrade.json";
import metier_json from "@/assets/metier.json";
import default_achievements_default from "@/assets/achievements/defaultAchievements.json";
import { getViewsFromUUID } from "@/lib/api/apiPalaTracker.ts";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { redirect } from "next/navigation";
import { getInitialPlayerInfo } from "@/lib/misc.ts";
import { registerPlayerAction } from "@/lib/api/apiServerAction.ts";
// import { toast } from "sonner";
import constants, { API_PALATRACKER } from "@/lib/constants.ts";

export const PALADIUM_API_URL = process.env.PALADIUM_API_URL || "https://api.paladium.games";


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
  return await fetchWithHeader<PaladiumPlayerInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${pseudo}`, 15 * 60, pseudo).catch((error: Error) => {
    return redirect(`/error?message=Impossible de récupérer les données de ${pseudo}, vérifie que tu as bien écrit ton pseudo.&detail=${error.message}&username=${pseudo}`)
  });
}


export const getPaladiumLeaderboardPositionByUUID = async (uuid: string, username: string): Promise<string> => {
  const response = await fetchWithHeader<PaladiumRanking>(`${PALADIUM_API_URL}/v1/paladium/ranking/position/clicker/${uuid}`).catch((e: Error) => {
    const message = e.message;
    return redirect(`/error?message=Impossible de récupérer ta position dans le classement. : ${message}&username=${username}`);
  });
  return response.ranked ? response.position.toString() : "Unranked";
}

const getPaladiumClickerDataByUUID = async (uuid: string, username: string): Promise<PaladiumClickerData> => {
  return await fetchWithHeader<PaladiumClickerData>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/clicker`).catch((error: Error) => {
    const message = error.message;
    return redirect(`/error?message=Impossible de récupérer les données du clicker, vérifie que tu ne les as pas désactivées sur ton profil Paladium via la commande /profil.&detail=${message}&username=${username}`);
  })
}

export const getFactionInfo = async (factionName: string): Promise<PaladiumFactionInfo> => {
  if (factionName === "")
    factionName = "Wilderness";

  return await fetchWithHeader<PaladiumFactionInfo>(`${PALADIUM_API_URL}/v1/paladium/faction/profile/${factionName}`).catch(() => {
    // toast.info("Impossible de récupérer les données de la faction, c'est le cas quand elle vient de changer de nom ou a été supprimée.");
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
  return await fetchWithHeader<PaladiumFactionLeaderboard>(`${PALADIUM_API_URL}/v1/paladium/faction/leaderboard`).catch((e) => {
    console.error(e);
    return []
  });
}

export const getAuctionHouseInfo = async (uuid: string, username: string): Promise<AhType> => {

  const response = await fetchWithHeader<AhType>(`${PALADIUM_API_URL}/v1/paladium/shop/market/players/${uuid}/items`).catch((error: Error) => {
    const message = error.message;
    console.error(message, username);
    return { data: [], totalCount: 0, dateUpdated: new Date().getTime() };
  })
  response.dateUpdated = new Date().getTime();
  return response;
}

export const getFriendsList = async (uuid: string): Promise<PaladiumFriendInfo> => {
  try {
    return await fetchWithHeader<PaladiumFriendInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/friends`);
  } catch (error: any) {
    // toast.info("Ce joueur a désactivé l'accès à sa liste d'amis.");
    return {
      data: [],
      totalCount: 0
    }
  }
}

export const getPlayerInfo = async (pseudo: string): Promise<PlayerInfo> => {
  try {
    if (pseudo === "") {
      throw "Pseudo is empty";
    } else if (pseudo.includes(" ")) {
      throw "Pseudo contains space";
    } else if (!/^[a-zA-Z0-9_]+$/.test(pseudo)) {
      throw "Pseudo doit contenir que des lettres ou des chiffres";
    }
  } catch (error) {
    redirect(`/error?message=${error}&username=${pseudo}`);
  }


  let paladiumProfil = await getPaladiumProfileByPseudo(pseudo)


  cookies().set('uuid', paladiumProfil.uuid, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) });
  cookies().set('username', paladiumProfil.username, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) });

  // Do all fetches in parallel to save time
  const p1 = getPaladiumClickerDataByUUID(paladiumProfil.uuid, paladiumProfil.username);
  const p2 = getAuctionHouseInfo(paladiumProfil.uuid, paladiumProfil.username);
  const p3 = getFriendsList(paladiumProfil.uuid);
  const p4 = getJobsFromUUID(paladiumProfil.uuid, paladiumProfil.username);
  const p5 = getPaladiumLeaderboardPositionByUUID(paladiumProfil.uuid, paladiumProfil.username);
  const p6 = getFactionInfo(paladiumProfil.faction === "" ? "Wilderness" : paladiumProfil.faction);
  const p7 = getViewsFromUUID(paladiumProfil.uuid, paladiumProfil.username);
  const p8 = getPlayerAchievements(paladiumProfil.uuid);
  const p9 = getPlayerMount(paladiumProfil.uuid)
  const p10 = getPlayerPet(paladiumProfil.uuid);


  const [clickerData, ahInfo, friendList, metiers, leaderboardPosition, paladiumFactionInfo, viewCount, achievements, mount, pet] = await Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10]);

  // NOTE: We use structuredClone to avoid modifying the original JSON by accident (it already happened once oupsy)
  let initialPlayerInfo = structuredClone(getInitialPlayerInfo());

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

  initialPlayerInfo.firstSeen = paladiumProfil.firstSeen;
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
  initialPlayerInfo.achievements = achievements;
  initialPlayerInfo.alliance = paladiumProfil.alliance;
  initialPlayerInfo.currentBanner = paladiumProfil.currentBanner;
  initialPlayerInfo.description = paladiumProfil.description;
  initialPlayerInfo.mount = mount;
  initialPlayerInfo.pet = pet;
  registerPlayerAction(initialPlayerInfo.uuid, initialPlayerInfo.username);

  registerPlayerAction(paladiumProfil.uuid, paladiumProfil.username);


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

  if (data.length !== totalCount)
    redirect(`/error?message=Data length is not equal to totalCount (getPaladiumAhItemFullHistory)`);

  return data;
}

export const getPaladiumAhItemStats = async (itemId: string): Promise<PaladiumAhItemStat> => {
  return await fetchWithHeader<PaladiumAhItemStat>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}`)
}

export const getJobsFromUUID = async (uuid: string, username: string): Promise<Metiers> => {
  const response = await fetchWithHeader<MetiersPossiblyUndefined>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/jobs`).catch((e: Error) => {
    const message = e.message;
    return redirect(`/error?message=Impossible de récupérer tes données de métiers, vérifie que tu ne les as pas désactivées sur ton profil Paladium via la commande /profil.&detail=${message}&username=${username}`);
  })


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

  return initialMetierJson;
}


export const getPlayerAchievements = async (uuid: string): Promise<Achievement[]> => {
  type AchievementResponse = {
    totalCount: number,
    data: { id: string, progress: number, completed: boolean }[]
  }
  const response = await fetchWithHeader<AchievementResponse>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/achievements?limit=100&offset=0`).catch(() => {
    return { totalCount: 0, data: [] } as AchievementResponse;
  })
  const totalCount = response.totalCount;

  let data = response.data;
  let offset = 100;
  let c = 0;
  while (offset < totalCount && c <= 10) {
    const response = await fetchWithHeader<AchievementResponse>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/achievements?offset=${offset}&limit=100`).catch(() => {
      return { totalCount: 0, data: [] } as AchievementResponse;
    })
    data = data.concat(response.data);
    offset += 100;
    c++;
  }

  if (data.length !== totalCount)
    redirect(`/error?message=Data length is not equal to totalCount (getPlayerAchievements)`);

  const allAchievements = await getAllAchievements().catch(() => {
    return structuredClone(default_achievements_default as AllAchievementResponse);
  });

  const achievements = allAchievements.data.map((achievement) => {
    const found = data.find((a) => a.id === achievement.id);
    return {
      id: achievement.id,
      progress: found ? found.progress : 0,
      completed: found ? found.completed : false,
      category: achievement.category,
      name: achievement.name,
      description: achievement.description,
      amount: achievement.amount,
      icon: achievement.icon,
      subAchievements: [] as Achievement[],
      imgPath: "/AH_img/barrier.png"
    }
  });


  const dictIdToSubIds = constants.dictAchievementIdToSubIds;

  const categoryAchievements = achievements.filter(achievement => achievement.amount === -1);
  const nonCategoryAchievements = achievements.filter(achievement => achievement.amount !== -1);
  const subCategoryAchievements: string[] = [];


  categoryAchievements.forEach((achievement) => {

    if (dictIdToSubIds.get(achievement.id)) {
      dictIdToSubIds.get(achievement.id)!.forEach((subId) => {
        const subAchievement = achievements.find((a) => a.id === subId);
        if (subAchievement) {
          if (!subAchievement.completed)
            achievement.completed = false;
          subAchievement.category = achievement.category;
          achievement.subAchievements.push(subAchievement);
          subCategoryAchievements.push(subId);
        }
      })
    }


    let id = achievement.id;

    if (id === "palamod.craftcauldron.gluballall")
      id = "palamod.craftcauldron.glueball"
    else if (id === "paladium.pickup.flower.multi.all")
      id = "paladium.pickup.flower";
    else if (id === "paladium.pickup.secret.multi.all")
      id = "paladium.pickup.secret";

    else if (id.endsWith(".all"))
      id = id.slice(0, -4);
    else if (id.endsWith("all"))
      id = id.slice(0, -3);

    achievements.forEach((a) => {
      if (a.id.startsWith(id + ".") && a.id !== achievement.id && a.category === achievement.category) {
        a.category = achievement.category;
        if (!a.completed)
          achievement.completed = false;
        achievement.subAchievements.push(a);
        subCategoryAchievements.push(a.id);
      }
    })
  })

  return categoryAchievements.concat(nonCategoryAchievements.filter((a) => subCategoryAchievements.indexOf(a.id) === -1));
}

type AllAchievementResponse = {
  totalCount: number,
  data: { id: string, category: CategoryEnum, name: string, description: string, amount: number, icon: string }[]
}

const getAllAchievements = async (): Promise<AllAchievementResponse> => {
  let response: AllAchievementResponse;
  try {
    response = await fetchWithHeader<AllAchievementResponse>(`${PALADIUM_API_URL}/v1/paladium/achievements?limit=100&offset=0`, 3600);
  } catch (e) {
    return Promise.reject(e);
  }
  const totalCount = response.totalCount;

  let data = response.data;
  let offset = 100;
  let c = 0;
  while (offset < totalCount && c <= 10) {
    const response = await fetchWithHeader<AllAchievementResponse>(`${PALADIUM_API_URL}/v1/paladium/achievements?offset=${offset}&limit=100`, 3600).catch((e) => {
      return Promise.reject(e);
    })
    data = data.concat(response.data);
    offset += 100;
    c++;
  }

  if (data.length !== totalCount)
    redirect(`/error?message=Data length is not equal to totalCount (getAllAchievements)`);


  // some achivement are deprecated, we remove them
  data = data.filter((achievement) => constants.deprecatedIdAchivement.indexOf(achievement.id) === -1);

  return { data: data, totalCount: data.length };
}

export const getPlayerMount = async (uuid: string): Promise<MountInfo | null> => {
  return await fetchWithHeader<MountInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/mount`).then((mount) => {
    if (mount.mountType === 0)
      return null;
    return mount;
  }).catch(() => {
    return null;
  })
}

export const getPlayerPet = async (uuid: string): Promise<PetInfo | null> => {
  return await fetchWithHeader<PetInfo>(`${PALADIUM_API_URL}/v1/paladium/player/profile/${uuid}/pet`).catch(() => {
    return null;
  })
}

export async function getPlayerRole(): Promise<Role> {
  return fetchWithHeader<Role>(`${API_PALATRACKER}/v1/role/getRole`, 5 * 60).catch(() => "Classic");
}