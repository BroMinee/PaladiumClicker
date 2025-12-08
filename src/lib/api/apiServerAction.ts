"use server";
import { getPlayerInfo, PALADIUM_API_URL } from "@/lib/api/apiPala";
import { fetchPostWithHeader, fetchWithHeader } from "@/lib/api/misc";
import {
  AdminShopItem,
  AdminShopItemDetail,
  AdminShopPeriod,
  AhItemHistory,
  AllPalaAnimationStats,
  DiscordUser,
  NotificationWebSiteResponse,
  OptionType,
  PaladiumAhHistory,
  PaladiumAhItemStat,
  PaladiumAhItemStatResponse,
  PaladiumFactionLeaderboard,
  PlayerCountHistory,
  RankingPositionResponse,
  RankingResponse,
  rankingResponseSubType,
  RankingType,
  Role,
  ServerPaladiumStatusResponse,
  StatusPeriod,
  User,
  WebHookCreate,
  WebHookType
} from "@/types";
import { Event } from "@/types";
import { cookies } from "next/headers";
import { API_PALATRACKER } from "@/lib/constants";
import { redirect } from "next/navigation";

/* The content of this file is not sent to the client*/

/**
 * Fetches the player profile info for a given username.
 * @param username The Minecraft username of the player.
 */
export async function getPlayerInfoAction(username: string) {
  return await getPlayerInfo(username);
}

/**
 * Registers a view for a player with their UUID and username.
 * @param uuid The UUID of the player.
 * @param username The Minecraft username of the player.
 */
export async function registerPlayerAction(uuid: string, username: string) {
  return await fetchWithHeader(`${API_PALATRACKER}/v1/user/register/${uuid}/${username}`, 5 * 60).catch((e) => {
    console.error(e);
  });
}

/**
 * Retrieves Paladium AH item statistics for all items.
 */
export async function getPaladiumAhItemStatsOfAllItemsAction(): Promise<PaladiumAhItemStat[]> {
  "use server";
  const response = await fetchWithHeader<PaladiumAhItemStatResponse>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items?limit=100&offset=0`, 5 * 60);
  const totalCount = response.totalCount;

  let data = response.data;
  let offset = 100;
  let c = 0;
  while (offset < totalCount && c <= 10) {
    const response = await fetchWithHeader<PaladiumAhItemStatResponse>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items?offset=${offset}&limit=100`, 5 * 60);
    data = data.concat(response.data);
    offset += 100;
    c++;
  }

  return data;
}

/**
 * Fetches the current active event.
 */
export async function getCurrentEvent() {
  try {
    const event = await getNotCloseEvent();
    if (event) {
      console.log("Event found:", event);
    } else {
      console.log("No event found");
    }
    return event;
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
}

/**
 * Returns the current event for which the player with given UUID is not registered.
 * @param uuid The UUID of the player.
 */
export async function getCurrentEventNotRegistered(uuid: string): Promise<Event | null> {
  const event: Event | null = await getCurrentEvent();

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
    console.error("Error fetching events:", error);
  }
  return null;
}

/**
 * Returns the event that the player has won but not yet claimed.
 * @param uuid The UUID of the player.
 */
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
    console.error("Error fetching events:", error);
    return "Not winner";
  }
}

/**
 * Fetches the current website notification.
 */
export async function getNotificationWebSite() {
  try {
    return await getCurrentNotification();
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
}

/**
 * Fetches all items from the server as options.
 */
export async function getAllItemsServerAction(): Promise<OptionType[]> {
  return await fetchWithHeader<{
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
      };
    });
  }).catch(() => {
    return [];
  });
}

async function getCurrentNotification(): Promise<NotificationWebSiteResponse | null> {
  return await fetchWithHeader<NotificationWebSiteResponse>(`${API_PALATRACKER}/v1/notification/website`, 5 * 60);
}

/**
 * Fetches the current active event.
 */
export async function getNotCloseEvent(): Promise<Event | null> {
  return await fetchWithHeader<Event | null>(`${API_PALATRACKER}/v1/events/getCurrent`, 60);
}

async function isRegisteredToEvent(uuid: string, event_id: number) {
  return await fetchWithHeader<{
    isRegistered: boolean
  }>(`${API_PALATRACKER}/v1/events/isRegistered?uuid=${uuid}&event_id=${event_id}`, 0);
}

/**
 * Fetches the closed event that is still claimable.
 */
export async function getClosedEventStillClaimable() {
  return await fetchWithHeader<Event | null>(`${API_PALATRACKER}/v1/events/getClosedEventStillClaimable`, 60);
}

async function isWinnerNotClaim(event_id: number, uuid: string) {
  return await fetchWithHeader<{
    description: string
  }>(`${API_PALATRACKER}/v1/events/hasWonAndNotClaim?uuid=${uuid}&event_id=${event_id}`, 0);
}

/**
 * Registers a user to an event.
 * @param uuid The UUID of the player.
 * @param discord_name The Discord name of the player (optional).
 */
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

/**
 * Checks if the current user is authenticated.
 */
export async function isAuthenticate(): Promise<DiscordUser | null> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ");

  try {
    const response = await fetch(`${API_PALATRACKER}/v1/auth/user`, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

/**
 * Creates a webhook on the server.
 *
 * @param body The webhook creation details.
 */
export async function createWebHookServerAction(body: WebHookCreate): Promise<{ succeeded: boolean, msg: string }> {
  if (!(await isAuthenticate())) {
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
  case WebHookType.vote:
    break;
  default:
    return { succeeded: false, msg: "Type de WebHook inconnu" };
  }

  console.log("Creating WebHook", body);

  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/create`, JSON.stringify(body), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  });
  return { succeeded: r.succeeded, msg: r.msg };
}

/**
 * Edits a webhook on the server.
 * @param body The webhook update details.
 */
export async function editWebHookServerAction(body: WebHookCreate): Promise<{ succeeded: boolean, msg: string }> {
  if (!(await isAuthenticate())) {
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
  case WebHookType.vote:
    break;
  default:
    return { succeeded: false, msg: "Type de WebHook inconnu" };
  }

  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/edit`, JSON.stringify(body), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  });
  return { succeeded: r.succeeded, msg: r.msg };
}

/**
 * Deletes a webhook by its ID.
 * @param webHookAlertId The ID of the webhook to delete.
 */
export async function deleteWebhookServerAction(webHookAlertId: number): Promise<{ succeeded: boolean, msg: string }> {
  if (!(await isAuthenticate())) {
    return { succeeded: false, msg: "Not authenticated" };
  }

  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/delete`, JSON.stringify({ id: webHookAlertId }), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  });
  return { succeeded: r.succeeded, msg: r.msg };
}

/**
 * Deletes a webhook for a specific guild.
 * @param guildId The ID of the guild.
 */
export async function deleteWebhookGuildServerAction(guildId: string): Promise<{ succeeded: boolean, msg: string }> {
  if (!(await isAuthenticate())) {
    return { succeeded: false, msg: "Not authenticated" };
  }

  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/guild/delete`, JSON.stringify({ id: guildId }), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  });
  return { succeeded: r.succeeded, msg: r.msg };
}

/**
 * Deletes a webhook for a specific channel in a guild.
 * @param guildId The ID of the guild.
 * @param channelId The ID of the channel.
 */
export async function deleteWebhookChannelServerAction(guildId: string, channelId: string): Promise<{
  succeeded: boolean,
  msg: string
}> {
  if (!(await isAuthenticate())) {
    return { succeeded: false, msg: "Not authenticated" };
  }

  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/channel/delete`, JSON.stringify({
    guildId: guildId,
    channelId: channelId
  }), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  });
  return { succeeded: r.succeeded, msg: r.msg };
}

type WebHookEditChannelName =
  {
    channel_id: string,
    guild_id: string,
    channel_name: string,
  }

/**
 * Edits the name of a webhook channel.
 * @param guild_id The ID of the guild.
 * @param channel_id The ID of the channel.
 * @param channel_name The new name for the channel.
 */
export async function editWebhookChannelNameServerAction(guild_id: string, channel_id: string, channel_name: string): Promise<{
  succeeded: boolean,
  msg: string
}> {
  if (!(await isAuthenticate())) {
    return { succeeded: false, msg: "Not authenticated" };
  }

  const body: WebHookEditChannelName = {
    channel_id: channel_id,
    guild_id: guild_id,
    channel_name: channel_name
  };

  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/channel/edit`, JSON.stringify(body), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  });
  return { succeeded: r.succeeded, msg: r.msg };
}

type WebHookEditGuildName =
  {
    channel_id: string,
    guild_id: string,
    guild_name: string,
  }

/**
 * Edits the name of a webhook guild.
 * @param guild_id The ID of the guild.
 * @param channel_id The ID of the channel.
 * @param guild_name The new name for the guild.
 */
export async function editWebhookGuildNameServerAction(guild_id: string, channel_id: string, guild_name: string): Promise<{
  succeeded: boolean,
  msg: string
}> {
  if (!(await isAuthenticate())) {
    return { succeeded: false, msg: "Not authenticated" };
  }

  const body: WebHookEditGuildName = {
    channel_id: channel_id,
    guild_id: guild_id,
    guild_name: guild_name
  };

  const r = await fetchPostWithHeader<{
    succeeded: boolean,
    msg: string
  }>(`${API_PALATRACKER}/v1/webhook/guild/edit`, JSON.stringify(body), 0).catch((e) => {
    return { msg: JSON.stringify(e.message), succeeded: false };
  });
  return { succeeded: r.succeeded, msg: r.msg };
}

/**
 * Fetches admin shop history for a specific item and period.
 * @param item The admin shop item.
 * @param periode The period to fetch history for.
 */
export async function getAdminShopHistoryServerAction(item: AdminShopItem, periode: AdminShopPeriod): Promise<AdminShopItemDetail[]> {
  return await fetchWithHeader<AdminShopItemDetail[]>(`${API_PALATRACKER}/v1/admin-shop/${item}/${periode}`, 0);
}

/**
 * Fetches the market history of an item by its ID.
 * @param itemId The ID of the item.
 */
export const getMarketHistoryServerAction = async (itemId: string): Promise<AhItemHistory[]> => {
  const response = await fetchWithHeader<PaladiumAhHistory>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}/history?limit=100&offset=0`);
  const totalCount = response.totalCount;

  let data = response.data;
  let offset = 100;
  let c = 0;
  while (offset < totalCount && c <= 10) {
    const response = await fetchWithHeader<PaladiumAhHistory>(`${PALADIUM_API_URL}/v1/paladium/shop/market/items/${itemId}/history?offset=${offset}&limit=100`);
    data = data.concat(response.data);
    offset += 100;
    c++;
  }

  if (data.length !== totalCount) {
    redirect("/error?message=Data length is not equal to totalCount (getPaladiumAhItemFullHistory)");
  }

  return data;
};

/**
 * Sets a cookie.
 * @param name The name of the cookie.
 * @param value The value to store in the cookie.
 * @param maxAge The maximum age of the cookie in seconds.
 */
export async function setCookies(name: string, value: string, maxAge: number = 60 * 60 * 24 * 30) {
  const cookieStore = await cookies();
  cookieStore.set(name as any, value as any, {
    maxAge: maxAge,
  } as any);
}

/**
 * Fetches all Paladium animation time statistics.
 */
export async function getAllPalaAnimationTime() {
  return await fetchWithHeader<AllPalaAnimationStats>(`${API_PALATRACKER}/v1/pala-animation/my-time/getAll`, 5 * 60).catch(() => []);
}

/**
 * Updates the role of a Discord user.
 *
 * @param discord_id The Discord ID of the user.
 * @param role The role to assign to the user.
 */
export async function editRoleSubmit(discord_id: string, role: Role): Promise<{
  succeeded: boolean
}> {

  if (!discord_id) {
    return { succeeded: false };
  }
  if (!role) {
    return { succeeded: false };
  }

  return fetchPostWithHeader<{
    succeeded: boolean
  }>(`${API_PALATRACKER}/v1/role/setRole`, JSON.stringify({
    discord_user_id: discord_id,
    role: role,
  }), 0);
}

/**
 * Fetches Paladium server status history for a given period.
 * @param periode The period for which to fetch status.
 */
export async function getStatusPaladiumAction(periode: StatusPeriod): Promise<ServerPaladiumStatusResponse[]> {
  return await fetchWithHeader<ServerPaladiumStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/paladium/${periode}`, 0);
}

/**
 * Fetches Paladium Bedrock server status history for a given period.
 * @param periode The period for which to fetch status.
 */
export async function getStatusPaladiumBedrockAction(periode: StatusPeriod): Promise<ServerPaladiumStatusResponse[]> {
  return await fetchWithHeader<ServerPaladiumStatusResponse[]>(`${API_PALATRACKER}/v1/status-history/paladium-bedrock/${periode}`, 0);
}

/**
 * Fetches the Paladium player count history.
 */
export async function getPlayerCountHistoryPaladiumAction() {
  return await fetchWithHeader<PlayerCountHistory>(`${API_PALATRACKER}/v1/status-history/paladium/player/count-history`, 5*60);
}

/**
 * Fetches the ranking positions of a player.
 * @param uuid The UUID of the player.
 */
export async function getPlayerPositionAction(uuid: string): Promise<RankingPositionResponse> {
  return await fetchWithHeader<{
    boss: number;
    money: number;
    // alliance: number;
    "job-farmer": number;
    "job-miner": number;
    end: number;
    koth: number;
    chorus: number;
    "job-hunter": number;
    egghunt: number;
    "job-alchemist": number;
    clicker: number;
  }>(`${API_PALATRACKER}/v1/paladium/ranking/position/${uuid}`, 5*60).then(data => {
    const converted: RankingPositionResponse = {
      boss: data.boss,
      money: data.money,
      // alliance: data.alliance,
      "job.farmer": data["job-farmer"],
      "job.miner": data["job-miner"],
      "job.hunter": data["job-hunter"],
      "job.alchemist": data["job-alchemist"],
      egghunt: data.egghunt,
      koth: data.koth,
      clicker: data.clicker,
      // end: data.end,
      // chorus: data.chorus,
    };
    return converted;
  });
}

/**
 * Fetches the faction leaderboard from the Paladium API.
 */
export const getFactionLeaderboardAction = async (): Promise<PaladiumFactionLeaderboard> => {
  return await fetchWithHeader<PaladiumFactionLeaderboard>(`${PALADIUM_API_URL}/v1/paladium/faction/leaderboard`).catch((e) => {
    console.error(e);
    return [];
  });
};

/**
 * Fetches the leaderboard for a given ranking type.
 * @param rankingType The type of ranking to fetch.
 * @param limit Number of entries to retrieve (default: 10).
 * @param offset Number of entries to skip for pagination (default: 0).
 */
export async function getRankingLeaderboardAction(rankingType: RankingType, limit = 10, offset = 0): Promise<Array<{ [x: string]: rankingResponseSubType[] }>> {
  return await fetchWithHeader<Array<{ [x: string]: rankingResponseSubType[] }>>(`${API_PALATRACKER}/v1/ranking/${rankingType}/all?limit=${limit}&offset=${offset}`, 60*60, "", 10000);
}

/**
 * Fetches the leaderboard data for a specific player by UUID and ranking type.
 * @param uuid The UUID of the player.
 * @param rankingType The type of ranking to fetch.
 */
export async function getRankingLeaderboardPlayerUUIDAction(uuid: string, rankingType: RankingType): Promise<RankingResponse> {
  return await fetchWithHeader<RankingResponse>(`${API_PALATRACKER}/v1/ranking/${rankingType}/${uuid}`, 60*60);
}

/**
 * Fetches the ranking leaderboard for a specific player by username.
 * @param username The player's username.
 * @param rankingType The type of ranking to fetch.
 */
export async function getRankingLeaderboardPlayerUsernameAction(username: string, rankingType: RankingType): Promise<RankingResponse> {
  return await fetchWithHeader<RankingResponse>(`${API_PALATRACKER}/v1/ranking/${rankingType}/username/${username}`, 60*60);
}

/**
 * Fetches username that are match the given username using %username% pattern
 * @param partialUsername part of a username
 */
export async function getSimilareUsernames(partialUsername: string): Promise<User[]> {
  return await fetchWithHeader<User[]>(`${API_PALATRACKER}/v1/user/getUsers/${partialUsername}`, 60*60);
}