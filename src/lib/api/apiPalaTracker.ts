import { PalaAnimationLeaderboard, PalaAnimationLeaderboardGlobal, ProfilViewType } from "@/types";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { timeout } from "d3-timer";

export const API_PALATRACKER = "https://palatracker.bromine.fr"

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

export const getLeaderboardPalaAnimation = async (session_uuid: string, username: string): Promise<PalaAnimationLeaderboard> => {
  return await fetchWithHeader<PalaAnimationLeaderboard>(`${API_PALATRACKER}/v1/palaAnimation/leaderboard?username=${username}&session_uuid=${session_uuid}`)
}

export const getGlobalLeaderboard = async (): Promise<PalaAnimationLeaderboardGlobal> => {
  return await fetchWithHeader<PalaAnimationLeaderboardGlobal>(`${API_PALATRACKER}/v1/palaAnimation/leaderboard/global`)
}

export const getAnswerPalaAnimation = async (session_uuid: string): Promise<{ answer: string }> => {
  return await fetchWithHeader<{
    answer: string
  }>(`${API_PALATRACKER}/v1/palaAnimation/answer?session_uuid=${session_uuid}`)
}

export const getViewsFromUUID = async (uuid: string): Promise<ProfilViewType> => {
  return await fetchWithHeader<ProfilViewType>(`${API_PALATRACKER}/v1/user/getUser/${uuid}`, 10);
}

export const pushNewUserEvent = async (username: string): Promise<void> => {
  await fetchWithHeader(`${API_PALATRACKER}/v1/bromine/event/${username}`)
  alert("Adapt to new endpoint");
}

export const getEventUsers = async (): Promise<{ username: string }[]> => {
  const response = await fetchWithHeader<{ username: string }[]>(`${API_PALATRACKER}/v1/bromine/event/users`)
  alert("Adapt to new endpoint");

  return response as { username: string }[];
}