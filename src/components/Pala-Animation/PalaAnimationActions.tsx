'use server'
import 'server-only';
import { PalaAnimationLeaderboard } from "@/types";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER } from "@/lib/api/apiPalaTracker.ts";

export const getLeaderboardPalaAnimation = async (session_uuid: string, username: string): Promise<PalaAnimationLeaderboard> => {
  return await fetchWithHeader<PalaAnimationLeaderboard>(`${API_PALATRACKER}/v1/palaAnimation/leaderboard?username=${username}&session_uuid=${session_uuid}`, 0)
}

export const getAnswerPalaAnimation = async (session_uuid: string): Promise<{ answer: string }> => {
  return await fetchWithHeader<{
    answer: string
  }>(`${API_PALATRACKER}/v1/palaAnimation/answer?session_uuid=${session_uuid}`, 0)
}