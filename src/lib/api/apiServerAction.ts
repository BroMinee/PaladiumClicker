'use server';
import { getPlayerInfo, PALADIUM_API_URL } from "@/lib/api/apiPala.ts";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER } from "@/lib/api/apiPalaTracker.ts";
import { OptionType, PaladiumAhItemStat, PaladiumAhItemStatResponse } from "@/types";
import { Event } from "@/types/db_types.ts";
import {
  getClosedEventStillClaimable,
  getNotCloseEvent,
  getRewards,
  isRegisteredToEvent,
  isWinnerNotClaim
} from "@/lib/database/events_database.ts";
import { getCurrentNotification } from "@/lib/database/notificationWebsite_database.ts";
import { pool } from "@/lib/api/db.ts";
import { redirect } from "next/navigation";

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
    const eventDB = await getNotCloseEvent();
    const rewards = await getRewards(eventDB.id);
    return { ...eventDB, rewards: rewards };
  } catch (error) {
    throw new Error("Failed to fetch events");
  }
}

export async function getCurrentEventNotRegistered(username: string) {

  if (!username) throw new Error("No username");
  if (username.length > 16) throw new Error("Username too long");

  let event: Event | null = null;
  try {
    event = await getCurrentEvent();
  } catch (error) {
    throw new Error('Failed to fetch events');
  }

  if (!event) {
    throw new Error("No active event");
  }
  if (isNaN(event.id)) {
    throw new Error("Event id is not a number");
  }

  try {
    const registered = await isRegisteredToEvent(username, event.id);
    if (!registered) {
      return event;
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
  throw new Error("Already registered");
}

export async function getEventNotClaimed(username: string) {
  try {
    const event = await getClosedEventStillClaimable();
    const event_id = event.id;
    const description = await isWinnerNotClaim(event_id, username);
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

export async function getItemName(itemId: number | null, itemName: string) {
  if(itemId === null)
    return new Promise<{fr_trad: string, us_trad: string}>((resolve, reject) => {
      resolve({fr_trad: itemName, us_trad: itemName});
    });


  return new Promise<{fr_trad: string, us_trad: string}>((resolve, reject) => {
    try {
      pool.query(`select fr_trad, us_trad
                  from items
                  where id = ?;`, [itemId], (error: any, results: any) => {
        if (error)
          return reject(error);
        if (results.length === 1)
          return resolve(results[0])
        return reject("No item id found");
      });
    } catch (e) {
      return reject(e);
    }
  })
}

export async function getAllItemsServerAction() {
  return fetchWithHeader<{
    item_name: string,
    us_trad: string,
    fr_trad: string,
    img: string
  }[]>(`${API_PALATRACKER}/v1/craft/items`, 30 * 60).then((res) => {
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