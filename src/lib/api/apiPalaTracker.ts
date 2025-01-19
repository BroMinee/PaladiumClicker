import 'server-only';
import {
  AdminShopItemDetail,
  AdminShopPeriode,
  CraftingRecipeType,
  Item,
  OptionType,
  PalaAnimationLeaderboardGlobal,
  ProfilViewType,
  RankingResponse,
  RankingType,
  ServerPaladiumStatusResponse,
  ServerStatusResponse,
  StatusPeriode
} from "@/types";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { redirect } from "next/navigation";
import { Event } from "@/types/db_types.ts";
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
  return await fetchWithHeader<PalaAnimationLeaderboardGlobal>(`${API_PALATRACKER}/v1/pala-animation/leaderboard/global`, 0)
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


export async function getStatusPaladium(periode: StatusPeriode) {
  return fetchWithHeader<ServerPaladiumStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/paladium/${periode}`, 0);
}

export function getStatusFaction(periode: StatusPeriode) {
  return fetchWithHeader<ServerStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/faction/${periode}`, 0);
}

export function getStatusLauncher(periode: StatusPeriode) {
  return fetchWithHeader<ServerStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/launcher/${periode}`, 0);
}

export async function getAllItems(): Promise<OptionType[]> {
  return fetchWithHeader<Item[]>(`${API_PALATRACKER}/v1/item/getAll`, 30 * 60).then((res) => {
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

  const craft = allCraft.find((craft) => craft.item.item_name === item_name);
  if (craft === undefined)
    redirect(`/error?message=Impossible de trouver le craft de ${item_name}`);

  return craft;
}

export const getAdminShopHistory = (item: string, periode: AdminShopPeriode): Promise<AdminShopItemDetail[]> => {
  return fetchWithHeader<AdminShopItemDetail[]>(`${API_PALATRACKER}/v1/admin-shop/${item}/${periode}`, 0);
};