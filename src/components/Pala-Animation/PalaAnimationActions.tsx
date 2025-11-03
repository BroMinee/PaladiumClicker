"use server";
import "server-only";
import { PalaAnimationLeaderboard, PalaAnimationLeaderboardGlobal } from "@/types";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER } from "@/lib/constants.ts";

/**
 * Fetches the leaderboard for a Pala-Animation session.
 * @param session_uuid - The UUID of the current session.
 * @returns A promise that resolves to the leaderboard for the session.
 */
export const getLeaderboardPalaAnimation = async (session_uuid: string): Promise<PalaAnimationLeaderboard> => {
  return await fetchWithHeader<PalaAnimationLeaderboard>(`${API_PALATRACKER}/v1/pala-animation/leaderboard?session_uuid=${session_uuid}`, 0);
};

/**
 * Fetches the global leaderboard for the all Pala-Animation.
 *
 * @returns A promise that resolves to the global leaderboard.
 */
export const getGlobalLeaderboard = async (): Promise<PalaAnimationLeaderboardGlobal> => {
  return await fetchWithHeader<PalaAnimationLeaderboardGlobal>(`${API_PALATRACKER}/v1/pala-animation/leaderboard/global`, 0);
};

/**
 * Fetches the correct answer for a Pala-Animation session.
 *
 * @param session_uuid - The UUID of the current session.
 * @returns A promise that resolves to an object containing the answer string.
 */
export const getAnswerPalaAnimation = async (session_uuid: string): Promise<{ answer: string }> => {
  return await fetchWithHeader<{
    answer: string
  }>(`${API_PALATRACKER}/v1/pala-animation/answer?session_uuid=${session_uuid}`, 0);
};