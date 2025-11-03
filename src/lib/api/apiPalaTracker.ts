import "server-only";
import {
  AdminShopItemDetail,
  AdminShopPeriod,
  CraftingRecipeType,
  DiscordUser,
  Item,
  MoneySumHistory,
  NodeType,
  OptionType,
  PlayerCountHistory,
  ProfilViewType,
  RankingResponse,
  RankingType,
  Role,
  RoleResponse,
  ServerPaladiumStatusResponse,
  ServerStatusResponse,
  StatusPeriod,
  Tree,
  WebHookAlert,
  WebhookDiscord
} from "@/types";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { redirect } from "next/navigation";
import { API_PALATRACKER } from "@/lib/constants.ts";
// import { toast } from "sonner";

export const isMyApiDown = async (): Promise<boolean> => {
  let response = null;
  let json = null;
  try {
    response = await fetch(`${API_PALATRACKER}/v1/other/status`,
      {
        cache: "no-cache",
        signal: AbortSignal.timeout(4000),
        headers: {
          "Authorization": `Bearer ${process.env.PALADIUM_API_KEY}`
        }
      });
    json = await response.json() as { backend_status: string, db_status: string } | null;

    if (!response.ok) {
      return true;
    }
  } catch (_) {
    return true;
  }

  return !(json && json.backend_status === "OK" && json.db_status === "OK");
};

export const getViewsFromUUID = async (uuid: string, username: string): Promise<ProfilViewType> => {
  username.toLowerCase();
  return await fetchWithHeader<ProfilViewType>(`${API_PALATRACKER}/v1/user/getUser/${uuid}`, 10 * 60).catch(() => {
    // toast.info(`Impossible de récupérer les vues de ${username}`);
    return {
      uuid,
      count: 0
    };
  });
};

export async function getRankingLeaderboard(rankingType: RankingType, limit = 10, offset = 0): Promise<RankingResponse> {
  return await fetchWithHeader<RankingResponse>(`${API_PALATRACKER}/v1/ranking/${rankingType}/all?limit=${limit}&offset=${offset}`, 60*60, "", 10000);
}

export async function getRankingLeaderboardPlayerUUID(uuid: string, rankingType: RankingType): Promise<RankingResponse> {
  return await fetchWithHeader<RankingResponse>(`${API_PALATRACKER}/v1/ranking/${rankingType}/${uuid}`, 60*60);
}

export async function getRankingLeaderboardPlayerUsername(username: string, rankingType: RankingType): Promise<RankingResponse> {
  return await fetchWithHeader<RankingResponse>(`${API_PALATRACKER}/v1/ranking/${rankingType}/username/${username}`, 60*60);
}

export async function getStatusPaladium(periode: StatusPeriod): Promise<ServerPaladiumStatusResponse[]> {
  return await fetchWithHeader<ServerPaladiumStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/paladium/${periode}`, 0);
}

export async function getStatusFaction(periode: StatusPeriod): Promise<ServerStatusResponse[]> {
  return await fetchWithHeader<ServerStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/faction/${periode}`, 0);
}

export async function getStatusLauncher(periode: StatusPeriod): Promise<ServerStatusResponse[]> {
  return await fetchWithHeader<ServerStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/launcher/${periode}`, 0);
}

export async function getAllItems(): Promise<OptionType[]> {
  return await fetchWithHeader<Item[]>(`${API_PALATRACKER}/v1/item/getAll`, 30 * 60).then((res) => {
    return res.map((item) => {
      return {
        value: item.item_name,
        label: item.us_trad,
        label2: item.fr_trad,
        img: item.img
      };
    });
  }).catch(() => {
    return redirect("/error?message=Impossible de charger la liste des items");
  });
}

export async function getCraft(item_name: string): Promise<CraftingRecipeType> {
  const allCraft = await fetchWithHeader<CraftingRecipeType[]>(`${API_PALATRACKER}/v1/craft/getAll`, 30 * 60).catch(() => {
    return redirect("/error?message=Impossible de charger la totalité des crafts.");
  });

  const craft = allCraft.find((craft) => craft.item.item_name === item_name);
  if (craft === undefined) {
    return redirect(`/error?message=Impossible de trouver le craft de ${item_name}`);
  }

  return craft;
}

export async function getAdminShopHistory(item: string, periode: AdminShopPeriod): Promise<AdminShopItemDetail[]> {
  return await fetchWithHeader<AdminShopItemDetail[]>(`${API_PALATRACKER}/v1/admin-shop/${item}/${periode}`, 0);
};

export async function getProfileFromCookies(): Promise<DiscordUser | null> {
  return await fetchWithHeader<DiscordUser | null>(`${API_PALATRACKER}/v1/auth/user`, 0).catch((e) => {
    console.error(e);
    return null;
  });
}

export async function getWebHookFromCookies(): Promise<WebHookAlert[]> {
  return await fetchWithHeader<WebHookAlert[]>(`${API_PALATRACKER}/v1/webhook/getAll`, 0).catch((e) => {
    console.error(e);
    return [];
  });
}

export async function getWebHookDiscordFromCookies(): Promise<WebhookDiscord[]> {
  return await fetchWithHeader<WebhookDiscord[]>(`${API_PALATRACKER}/v1/webhook/getWebhookDiscord`, 0).catch((e) => {
    console.error(e);
    return [];
  });
}

export async function getPlayerCountHistoryPaladium() {
  return await fetchWithHeader<PlayerCountHistory>(`${API_PALATRACKER}/v1/status-history/paladium/player/count-history`, 0);
}

export async function getMoneySumHistoryPaladium() {
  return await fetchWithHeader<MoneySumHistory>(`${API_PALATRACKER}/v1/status-history/paladium/money/count-history`, 0);
}

export async function getAllUsersLinked() {
  return await fetchWithHeader<RoleResponse[]>(`${API_PALATRACKER}/v1/role/getAllUsersRole`, 0);
}

export async function getRole(): Promise<Role> {
  const res = await fetchWithHeader<{ role: Role }>(`${API_PALATRACKER}/v1/role/getRole`, 0).catch(() => {
    return { role: "Classic" as Role };
  });
  return res.role;
}

export async function isAdmin() {
  return await fetchWithHeader<boolean>(`${API_PALATRACKER}/v1/role/isAdmin`, 0).catch(() => {
    return false;
  });
}

export async function getItemAlias(item_name: string | undefined): Promise<string | null> {
  if (item_name === undefined) {
    return null;
  }

  return await fetchWithHeader<string | null>(`${API_PALATRACKER}/v1/item/getAlias/${item_name}`, 30 * 60).catch(() => {
    console.error("Impossible de charger récupérer l'alias de l'item");
    return null;
  });
}

export async function getCraftRecipe(item_name: string, count: number): Promise<Tree<NodeType>> {
  return await fetchWithHeader<Tree<NodeType>>(`${API_PALATRACKER}/v1/craft/get?item=${item_name}&count=${count}`, 30 * 60).catch(() => {
    return redirect("/error?message=Impossible de charger la recette de ce craft.");
  });
}