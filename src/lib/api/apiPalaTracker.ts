import 'server-only';
import {
  AdminShopItem,
  AdminShopItemDetail,
  CraftingRecipeType,
  OptionType,
  PalaAnimationLeaderboardGlobal,
  ProfilViewType,
  RankingResponse,
  RankingType,
  ServerPaladiumStatusResponse,
  ServerStatusResponse
} from "@/types";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { redirect } from "next/navigation";
import { pool } from "@/lib/api/db.ts";
import constants from "@/lib/constants.ts";
// import { toast } from "sonner";

export const API_PALATRACKER = process.env.PALACLICKER_API_URL || "https://palatracker.bromine.fr"

export const isMyApiDown = async (): Promise<boolean> => {
  let response = null;
  let json = null;
  try {
    response = await fetch(`${API_PALATRACKER}/v1/other/status`,
      {
        cache: 'no-cache',
        signal: AbortSignal.timeout(4000),
        headers: {
          'Authorization': `Bearer ${process.env.PALADIUM_API_KEY}`
        }
      })
    json = await response.json() as { backend_status: string, db_status: string } | null;

    if (!response.ok)
      return true;
  } catch (error) {
    return true;
  }

  return !(json && json.backend_status === "OK" && json.db_status === "OK");
}


export const getGlobalLeaderboard = async (): Promise<PalaAnimationLeaderboardGlobal> => {
  return await fetchWithHeader<PalaAnimationLeaderboardGlobal>(`${API_PALATRACKER}/v1/palaAnimation/leaderboard/global`, 0)
}


export const getViewsFromUUID = async (uuid: string, username: string): Promise<ProfilViewType> => {
  username.toLowerCase();
  return await fetchWithHeader<ProfilViewType>(`${API_PALATRACKER}/v1/user/getUser/${uuid}`, 10 * 60).catch(() => {
    // toast.info(`Impossible de récupérer les vues de ${username}`);
    return {
      uuid,
      count: 0
    }
  });
}


export function getRankingLeaderboard(rankingType: RankingType, limit = 10, offset = 0) {
  return fetchWithHeader<RankingResponse>(`${API_PALATRACKER}/v1/ranking/${rankingType}/all?limit=${limit}&offset=${offset}`, 0);
}

export function getRankingLeaderboardPlayerUUID(uuid: string, rankingType: RankingType) {
  return fetchWithHeader<RankingResponse>(`${API_PALATRACKER}/v1/ranking/${rankingType}/${uuid}`, 0)
}

export function getRankingLeaderboardPlayerUsername(username: string, rankingType: RankingType) {
  return fetchWithHeader<RankingResponse>(`${API_PALATRACKER}/v1/ranking/${rankingType}/username/${username}`, 0)
}

export function getRankingAllLeaderboardPlayer(uuid: string) {
  return fetchWithHeader<RankingResponse>(`${API_PALATRACKER}/v1/ranking/all/${uuid}`, 0)
}

export function getAdminShopHistory(item: AdminShopItem) {
  return fetchWithHeader<AdminShopItemDetail[]>(`${API_PALATRACKER}/v1/admin-shop/${item}`, 0)
}

export async function getStatusPaladium() {
  return fetchWithHeader<ServerPaladiumStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/paladium`, 0);
}

export function getStatusFaction() {
  return fetchWithHeader<ServerStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/faction`, 0);
}

export function getStatusLauncher() {
  return fetchWithHeader<ServerStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/launcher`, 0);
}

export async function getAllItems(): Promise<OptionType[]> {
  return fetchWithHeader<{
    item_name: string,
    us_trad: string,
    fr_trad: string,
    img: string
  }[]>(`${API_PALATRACKER}/v1/item/getAll`, 30 * 60).then((res) => {
    return res.map((item) => {
      return {
        value: item.item_name,
        label: item.us_trad,
        label2: item.fr_trad,
        img: item.img
      }
    });
  }).catch(() => {
    redirect(`/error?message=Impossible de charger la liste des items`);
  })
}

export async function getCraft(item_name: string): Promise<CraftingRecipeType> {
  const allCraft = await fetchWithHeader<CraftingRecipeType[]>(`${API_PALATRACKER}/v1/craft/getAll`, 30 * 60).catch(() => {
    redirect(`/error?message=Impossible de charger la totalité des crafts.`);
    return [] as CraftingRecipeType[];
  })

  const craft = allCraft.find((craft) => craft.item_name === item_name);
  if (craft === undefined)
    redirect(`/error?message=Impossible de trouver le craft de ${item_name}`);

  return craft;
}

export const getItemHistoryDay = (item: string): Promise<AdminShopItemDetail[]> => {
  return fetchWithHeader<AdminShopItemDetail[]>(`${API_PALATRACKER}/v1/admin-shop/${item}/day`, 0);
};
export const getItemHistoryWeek = (item: string): Promise<AdminShopItemDetail[]> => {
  return fetchWithHeader<AdminShopItemDetail[]>(`${API_PALATRACKER}/v1/admin-shop/${item}/week`, 0);
};

export const getItemHistoryMonth = (item: string): Promise<AdminShopItemDetail[]> => {
  return fetchWithHeader<AdminShopItemDetail[]>(`${API_PALATRACKER}/v1/admin-shop/${item}/month`, 0);
};

export const getItemHistorySeason = (item: string): Promise<AdminShopItemDetail[]> => {
  return fetchWithHeader<AdminShopItemDetail[]>(`${API_PALATRACKER}/v1/admin-shop/${item}/season`, 0);
};