'use server';
import { getPlayerInfo } from "@/lib/api/apiPala.ts";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER } from "@/lib/api/apiPalaTracker.ts";

export async function getPlayerInfoAction(username: string) {
  return await getPlayerInfo(username)
}

export async function registerPlayerAction(uuid: string, username: string) {
  return await fetchWithHeader(`${API_PALATRACKER}/v1/user/register/${uuid}/${username}`, 5 * 60).catch((e) => { console.error(e) });
}