import 'server-only';
import { redirect } from "next/navigation";
import { PlayerDBApiReponse } from "@/types";
import { cookies } from "next/headers";

export const fetchWithoutHeader = async <T>(url: string, cache_duration = 15 * 60, username = ""): Promise<T> | never => {
  alert("Refacto like fetchWithHeader");
  let response = null;
  let json = null;
  try {
    response = await fetch(url,
      {
        next: { revalidate: cache_duration, tags: ['playerInfo'] },
        signal: AbortSignal.timeout(4000)
      })
    json = await response.json();

    if (!response.ok)
      throw new Error(json.message);
    return json;
  } catch (error) {
    console.error(error);
  }

  if (json)
    if (username !== "")
      return redirect(`/error?message=${json.message}&username=${username}`);
    else
      return redirect(`/error?message=${json.message}`);
  else if (username !== "")
    return redirect(`/error?message=Impossible de récupérer les données actuelles de ${url}&username=${username}`);
  else
    return redirect(`/error?message=Impossible de récupérer les données actuelles de ${url}`);
}


export const fetchWithHeader = async <T>(url: string, cache_duration_in_sec = 15 * 60, username = ""): Promise<T> => {
  let response: Response | null = null;
  let json = null;

  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

  try {
    response = await fetch(url,
      {
        next: { revalidate: cache_duration_in_sec, tags: ['playerInfo'] },
        signal: AbortSignal.timeout(4000),
        headers: {
          'Authorization': `Bearer ${process.env.PALADIUM_API_KEY}`,
          Cookie: cookieHeader,
        },
        credentials: 'include',
      })
    json = await response.json();

    if (!response.ok)
      throw new Error(url + json.message);
    return json as T;
  } catch (error) {
    console.error(error, url, response?.status);
  }


  if (username !== "" && url === "https://api.paladium.games/v1/paladium/player/profile/" + username && response && response.status === 404) {
    let uuid = "";
    try {
      const playerdbAPI = await fetch(`https://playerdb.co/api/player/minecraft/${username}`, {
        next: { revalidate: 0, tags: ['playerInfo'] },
        signal: AbortSignal.timeout(4000),
      })
      const playerdbAPIJson = await playerdbAPI.json();
      uuid = (playerdbAPIJson as PlayerDBApiReponse).data.player.id;
    } catch (error) {
      console.error("Using the other API " + error);
    }

    if (uuid !== "") {
      try {
        response = await fetch(`https://api.paladium.games/v1/paladium/player/profile/${uuid}`,
          {
            next: { revalidate: cache_duration_in_sec, tags: ['playerInfo'] },
            signal: AbortSignal.timeout(4000),
            headers: {
              'Authorization': `Bearer ${process.env.PALADIUM_API_KEY}`
            }
          })
        json = await response.json();

        if (!response.ok)
          throw new Error(url + json.message);
        return json as T;
      } catch (error) {
        console.error(error, url);
      }
    } else {
      throw new Error(`Le pseudo ${username} n'existe pas sur Minecraft.`);
    }
  }

  if (json)
    throw new Error(json.message);
  else
    throw new Error(`Impossible de récupérer les données actuelles de ${url}`);
}


export const fetchPostWithHeader = async <T>(url: string, body: string, cache_duration_in_sec = 15 * 60): Promise<T> => {
  let response: Response | null = null;
  let json = null;

  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

  try {
    response = await fetch(url,
      {
        method: 'POST',
        next: { revalidate: cache_duration_in_sec },
        signal: AbortSignal.timeout(4000),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PALADIUM_API_KEY}`,
          Cookie: cookieHeader,
        },
        body: body
      })
    json = await response.json();

    if (!response.ok)
      throw new Error(url + json.message);
    return json as T;
  } catch (error) {
    console.error(error, url);
  }

  if (json)
    throw new Error(json.message);
  else
    throw new Error(`Impossible de récupérer les données actuelles de ${url}`);
}