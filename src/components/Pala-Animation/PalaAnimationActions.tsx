'use server';
import 'server-only';
import { PalaAnimationLeaderboard, PalaAnimationLeaderboardGlobal } from "@/types";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER } from "@/lib/constants.ts";

export const getLeaderboardPalaAnimation = async (session_uuid: string): Promise<PalaAnimationLeaderboard> => {
  return await fetchWithHeader<PalaAnimationLeaderboard>(`${API_PALATRACKER}/v1/pala-animation/leaderboard?session_uuid=${session_uuid}`, 0);
};

export const getGlobalLeaderboard = async (): Promise<PalaAnimationLeaderboardGlobal> => {
  return await fetchWithHeader<PalaAnimationLeaderboardGlobal>(`${API_PALATRACKER}/v1/pala-animation/leaderboard/global`, 0);
};

export const getAnswerPalaAnimation = async (session_uuid: string): Promise<{ answer: string }> => {
  return await fetchWithHeader<{
    answer: string
  }>(`${API_PALATRACKER}/v1/pala-animation/answer?session_uuid=${session_uuid}`, 0);
};