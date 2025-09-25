'use client'
import { PlayerDBApiReponse } from "@/types";

export async function getPlayerUsernameFromUUID(uuid: string): Promise<string> {
  let pseudo = "";
  try {
    const playerdbAPI = await fetch(`https://playerdb.co/api/player/minecraft/${uuid}`, {
      next: { revalidate: 15 * 60 },
      signal: AbortSignal.timeout(4000),
    })
    const playerdbAPIJson = await playerdbAPI.json();
    pseudo = (playerdbAPIJson as PlayerDBApiReponse).data.player.username;
  } catch (error) {
    console.error("Using the other API " + error);
    throw error;
  }
  return pseudo;
}