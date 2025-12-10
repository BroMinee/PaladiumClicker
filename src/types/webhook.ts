import { Item } from "./market";

export type NotificationWebSiteResponse =
  {
    title: string,
    content: string,
    url: string,
  }

export enum WebHookType {
  "QDF" = "QDF",
  "EventPvp" = "EventPvp",
  "statusServer" = "statusServer",
  "adminShop" = "adminShop",
  "market" = "market",
  "vote" = "vote",
}

export type EventType =
  "BOSS" | "A VOS MARQUES" | "TOTEM" | "EGGHUNT" | "KOTH" | "BLACKMARKET"

export type WebHookThresholdCondition =
  "increasing"
  | "decreasing"
  | "aboveThreshold"
  | "underThreshold"
  | "increasingAboveThreshold"
  | "decreaseAboveThreshold"
  | "aboveQuantity"

export type WebhookDiscord = {
  url: string,
  guild_id: string,
  channel_id: string,
  failedConsecutive: number,
  server_name: string,
  channel_name: string,
}

export type WebHookAlert = {
  id: number;
  webhook: WebhookDiscord;
  content: string | null;
  embed: string | null;
  title: string | null;
  type: WebHookType;
  alreadySatisfied: boolean | null;
  endDate: number | null;
  enumEvent: EventType | null;
  item: Item | null;
  threshold: number | null;
  thresholdCondition:
      WebHookThresholdCondition
      | null;
  username: string | null,
}

export type WebHookCreate = {
  id: number | null;
  url: string,
  content: string | null;
  embed: string | null;
  title: string | null;
  type: WebHookType;
  enumEvent: EventType | null;
  itemName: string | null;
  threshold: number | null;
  thresholdCondition:
      WebHookThresholdCondition
      | null;
  username: string;
}

export interface GroupedChannel {
  channelId: string;
  channelName: string;
  discordData?: WebhookDiscord;
  alerts: WebHookAlert[];
}

export interface GroupedServer {
  serverId: string;
  serverName: string;
  channels: GroupedChannel[];
}