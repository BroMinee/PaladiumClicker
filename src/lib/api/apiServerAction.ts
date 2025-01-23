'use server';
import { getPlayerInfo, PALADIUM_API_URL } from "@/lib/api/apiPala.ts";
import { fetchPostWithHeader, fetchWithHeader } from "@/lib/api/misc.ts";
import {
  DiscordUser,
  NotificationWebSiteResponse,
  OptionType,
  PaladiumAhItemStat,
  PaladiumAhItemStatResponse,
  WebHookCreate,
  WebHookType
} from "@/types";
import { Event } from "@/types/db_types.ts";
import { cookies } from "next/headers";
import { API_PALATRACKER } from "@/lib/constants.ts";


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
  }), 0);
}

export async function isAuthenticate() : Promise<DiscordUser | null> {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

  try {
    const response = await fetch(`${API_PALATRACKER}/v1/auth/user`, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: 'include',
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }


  return null;
}

export async function createWebHookServerAction(body: WebHookCreate): Promise<{ succeeded: boolean, msg: string }> {
  if (!await isAuthenticate()) {
    return { succeeded: false, msg: "Not authenticated" };
  }
  // Check that the request is valid
  switch (body.type) {
    case WebHookType.QDF:
      break;
    case WebHookType.EventPvp:
      break;
    case WebHookType.statusServer:
      break;
    case WebHookType.adminShop:
      break;
    case WebHookType.market:
      break;
    default:
      return { succeeded: false, msg: "Type de WebHook inconnu" }
  }

  console.log("Creating WebHook", body)

  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/create`, JSON.stringify(body), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  })
  return { succeeded: r.succeeded, msg: r.msg };
}

export async function editWebHookServerAction(body: WebHookCreate): Promise<{ succeeded: boolean, msg: string }> {
  if (!await isAuthenticate()) {
    return { succeeded: false, msg: "Not authenticated" };
  }
  // Check that the request is valid
  switch (body.type) {
    case WebHookType.QDF:
      break;
    case WebHookType.EventPvp:
      break;
    case WebHookType.statusServer:
      break;
    case WebHookType.adminShop:
      break;
    case WebHookType.market:
      break;
    default:
      return { succeeded: false, msg: "Type de WebHook inconnu" }
  }

  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/edit`, JSON.stringify(body), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  })
  return { succeeded: r.succeeded, msg: r.msg };
}

export async function deleteWebhookServerAction(webHookAlertId: number): Promise<{ succeeded: boolean, msg: string }> {
  if (!await isAuthenticate()) {
    return { succeeded: false, msg: "Not authenticated" };
  }


  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/delete`, JSON.stringify({ id: webHookAlertId }), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  })
  return { succeeded: r.succeeded, msg: r.msg };
}

type WebHookEditChannelName =
  {
    channel_id: string,
    guild_id: string,
    channel_name: string,
  }

export async function editWebhookChannelNameServerAction(guild_id: string, channel_id: string, channel_name: string): Promise<{
  succeeded: boolean,
  msg: string
}> {
  if (!await isAuthenticate()) {
    return { succeeded: false, msg: "Not authenticated" };
  }

  const body: WebHookEditChannelName = {
    channel_id: channel_id,
    guild_id: guild_id,
    channel_name: channel_name
  }


  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/channel/edit`, JSON.stringify(body), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  })
  return { succeeded: r.succeeded, msg: r.msg };
}

type WebHookEditGuildName =
  {
    channel_id: string,
    guild_id: string,
    guild_name: string,
  }

export async function editWebhookGuildNameServerAction(guild_id: string, channel_id: string, guild_name: string): Promise<{
  succeeded: boolean,
  msg: string
}> {
  if (!await isAuthenticate()) {
    return { succeeded: false, msg: "Not authenticated" };
  }

  const body: WebHookEditGuildName = {
    channel_id: channel_id,
    guild_id: guild_id,
    guild_name: guild_name
  }


  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/guild/edit`, JSON.stringify(body), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  })
  return { succeeded: r.succeeded, msg: r.msg };
}