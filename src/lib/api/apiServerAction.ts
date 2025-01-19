'use server';
import { getPlayerInfo, PALADIUM_API_URL } from "@/lib/api/apiPala.ts";
import { fetchPostWithHeader, fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER } from "@/lib/api/apiPalaTracker.ts";
import { NotificationWebSiteResponse, OptionType, PaladiumAhItemStat, PaladiumAhItemStatResponse } from "@/types";
import { Event } from "@/types/db_types.ts";
import { cookies } from "next/headers";


/* The content of this file is not sent to the client*/

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
    const response = await fetchWithHeader<PaladiumAhItemStatResponse>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items?offset=${offset}&limit=100`, 5 * 60)
    data = data.concat(response.data);
    offset += 100;
    c++;
  }

  console.assert(data.length === totalCount, "Data length is not equal to totalCount");
  return data;
}

export async function getCurrentEvent() {
  try {
    const event = await getNotCloseEvent();
    if (event) {
      console.log("Event found:", event);
    } else {
      console.log("No event found")
    }
    return event;
  } catch (error) {
    console.error('Error fetching events:', error);
    return null;
  }
}

export async function getCurrentEventNotRegistered(uuid: string): Promise<Event | null> {
  let event: Event | null = await getCurrentEvent();

  if (!event) {
    return null;
  }
  if (isNaN(event.id)) {
    console.error("Event id is not a number");
    return null;
  }

  try {
    const res = await isRegisteredToEvent(uuid, event.id);
    if (!res.isRegistered) {
      return event;
    }
    return null;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
  return null;
}

export async function getEventNotClaimed(uuid: string) {
  try {
    const event = await getClosedEventStillClaimable();
    if (!event) {
      return "Not winner";
    }
    const event_id = event.id;
    const description = await isWinnerNotClaim(event_id, uuid);
    if (description.description) {
      return description.description;
    }
    return "Not winner";
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error("Error fetching events");
  }
}


export async function getNotificationWebSite() {
  try {
    return await getCurrentNotification();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error("Error fetching events");
  }
}

export async function getAllItemsServerAction() {
  return fetchWithHeader<{
    item_name: string,
    us_trad: string,
    fr_trad: string,
    img: string
  }[]>(`${API_PALATRACKER}/v1/item/getAll`, 30 * 60).then((res) => {
    return res.map((item) => {
      return {
        value: item.item_name,
        label: item.us_trad,
        label2: item.fr_trad,
        img: item.img
      }
    });
  }).catch(() => {
    return [] as OptionType[];
  })
}

export async function getCurrentNotification(): Promise<NotificationWebSiteResponse | null> {
  return fetchWithHeader<NotificationWebSiteResponse>(`${API_PALATRACKER}/v1/notification/website`, 5 * 60);
}

const getNotCloseEvent = (): Promise<Event | null> => {
  return fetchWithHeader<Event | null>(`${API_PALATRACKER}/v1/events/getCurrent`, 0);
}

function isRegisteredToEvent(uuid: string, event_id: number) {
  return fetchWithHeader<{
    isRegistered: boolean
  }>(`${API_PALATRACKER}/v1/events/isRegistered?uuid=${uuid}&event_id=${event_id}`, 0);
}

export const getClosedEventStillClaimable = () => {
  return fetchWithHeader<Event | null>(`${API_PALATRACKER}/v1/events/getClosedEventStillClaimable`, 0);
}

function isWinnerNotClaim(event_id: number, uuid: string) {
  return fetchWithHeader<{
    description: string
  }>(`${API_PALATRACKER}/v1/events/hasWonAndNotClaim?uuid=${uuid}&event_id=${event_id}`, 0);
}

export async function registerUserToEvent(uuid: string, discord_name: string | undefined): Promise<{
  succeeded: boolean
}> {
  return fetchPostWithHeader<{
    succeeded: boolean
  }>(`${API_PALATRACKER}/v1/events/register`, JSON.stringify({
    uuid: uuid,
    discord_name: discord_name,
  }),0);
}

export async function isAuthenticate() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

  const response = await fetch('http://localhost:3001/v1/auth/user', {
    headers: {
      Cookie: cookieHeader,
    },
    credentials: 'include',
  });

  if(response.ok) {
    return await response.json();
  }

  return null;
}