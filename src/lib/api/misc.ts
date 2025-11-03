import "server-only";
import { PlayerDBApiReponse } from "@/types";
import { cookies } from "next/headers";

const apiPala = process.env.NEXT_PUBLIC_PALACLICKER_API_URL ?? "https://palatracker.bromine.fr";

/**
 * Performs a GET request with authorization and cookies, and optional caching it.
 *
 * @param url The endpoint URL to fetch data from.
 * @param cache_duration_in_sec Duration in seconds for caching the response, defaults to 15 minutes.
 * @param username Optional Minecraft username to use for fallback UUID lookup if the initial request fails.
 * @param timeout Optional request timeout in milliseconds, defaults to 4000ms.
 */
export const fetchWithHeader = async <T>(url: string, cache_duration_in_sec = 15 * 60, username = "", timeout = 4000): Promise<T> => {
  let response: Response | null = null;
  let json = null;

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ");

  try {
    response = await fetch(url,
      {
        next: { revalidate: cache_duration_in_sec },
        signal: AbortSignal.timeout(timeout),
        headers: {
          "Authorization": `Bearer ${process.env.PALADIUM_API_KEY}`,
          Cookie: cookieHeader,
        },
        credentials: "include",
      });
    json = await response.json();

    if (!response.ok) {
      throw new Error(url + json.message);
    }
    return json as T;
  } catch (error) {
    console.error(error, url, response?.status);
  }

  if (username !== "" && url === `${apiPala}/v1/paladium/player/profile/` + username && response && response.status === 404) {
    let uuid = "";
    try {
      const playerdbAPI = await fetch(`https://playerdb.co/api/player/minecraft/${username}`, {
        next: { revalidate: 15 * 60 },
        signal: AbortSignal.timeout(4000),
      });
      const playerdbAPIJson = await playerdbAPI.json();
      uuid = (playerdbAPIJson as PlayerDBApiReponse).data.player.id;
    } catch (error) {
      console.error("Using the other API " + error);
    }

    if (uuid !== "") {
      try {
        response = await fetch(`${apiPala}/v1/paladium/player/profile/${uuid}`,
          {
            next: { revalidate: cache_duration_in_sec },
            signal: AbortSignal.timeout(4000),
            headers: {
              "Authorization": `Bearer ${process.env.PALADIUM_API_KEY}`
            }
          });
        json = await response.json();

        if (!response.ok) {
          throw new Error(url + json.message);
        }
        return json as T;
      } catch (error) {
        console.error(error, url);
      }
    } else {
      throw new Error(`Le pseudo ${username} n'existe pas sur Minecraft.`);
    }
  }

  if (json) {
    throw new Error(json.message);
  } else {
    throw new Error(`Impossible de récupérer les données actuelles de ${url}`);
  }
};

/**
 * Performs a POST request with authorization and cookie headers, and optional caching it.
 *
 * @param url The endpoint URL to send the request to.
 * @param body The JSON string body to send with the POST request.
 * @param cache_duration_in_sec The duration (in seconds) to cache the response, defaults to 15 minutes.
 */
export const fetchPostWithHeader = async <T>(url: string, body: string, cache_duration_in_sec = 15 * 60): Promise<T> => {
  let response: Response | null = null;
  let json = null;

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ");

  try {
    response = await fetch(url,
      {
        method: "POST",
        next: { revalidate: cache_duration_in_sec },
        signal: AbortSignal.timeout(4000),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PALADIUM_API_KEY}`,
          Cookie: cookieHeader,
        },
        body: body
      });
    json = await response.json();

    if (!response.ok) {
      throw new Error(url + json.message);
    }
    return json as T;
  } catch (error) {
    console.error(error, url);
  }

  if (json) {
    throw new Error(json.message);
  } else {
    throw new Error(`Impossible de récupérer les données actuelles de ${url}`);
  }
};