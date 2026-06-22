"use server";

import { getRandomWordleCraftName } from "./api-pala-tracker.server";

/**
 * Fetches a random craft name for Wordle training.
 */
export async function getRandomCraftAction(): Promise<string | null> {
  return await getRandomWordleCraftName();
}
