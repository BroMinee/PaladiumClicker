'use server';
import { getPlayerInfo, PALADIUM_API_URL } from "@/lib/api/apiPala.ts";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER } from "@/lib/api/apiPalaTracker.ts";
import { PaladiumAhItemStat, PaladiumAhItemStatResponse } from "@/types";

export async function getPlayerInfoAction(username: string) {
  return await getPlayerInfo(username)
}

export async function registerPlayerAction(uuid: string, username: string) {
  return await fetchWithHeader(`${API_PALATRACKER}/v1/user/register/${uuid}/${username}`, 5 * 60).catch((e) => { console.error(e) });
}

export async function getPaladiumAhItemStatsOfAllItemsAction(): Promise<PaladiumAhItemStat[]> {
  'use server'
  const response = await fetchWithHeader<PaladiumAhItemStatResponse>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items?limit=100&offset=0`, 5 * 60);
  const totalCount = response.totalCount;

  let data = response.data;
  let offset = 100;
  let c = 0;
  while (offset < totalCount && c <= 10) {
    const response = await fetchWithHeader<PaladiumAhItemStatResponse>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items?offset=${offset}&limit=100`,5 * 60)
    data = data.concat(response.data);
    offset += 100;
    c++;
  }

  console.assert(data.length === totalCount, "Data length is not equal to totalCount");
  return data;
}