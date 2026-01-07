"use client";

import { ReactNode, useEffect } from "react";
import { GroupedServer, WebHookAlert, WebhookDiscord } from "@/types";
import { useWebhookAlertStore } from "@/stores/use-webhook-alert-store";

/**
 * Component that set the zustand webhook alert state given the searchParams
 * @param alerts The list of webhook alerts.
 * @param discords The list of webhook discord configurations.
 * @param children The child components to render within the store context.
 */
export function SetWebhookStore({ alerts, discords, children }: { alerts: WebHookAlert[], discords: WebhookDiscord[], children: ReactNode }) {
  const { setGroupedServer } = useWebhookAlertStore();

  useEffect(() => {
    const serverMap = new Map<string, GroupedServer>();
    discords.forEach(discord => {
      if (!serverMap.has(discord.guild_id)) {
        serverMap.set(discord.guild_id, {
          serverId: discord.guild_id,
          serverName: "should have been set later",
          channels: []
        });
      }

      const server = serverMap.get(discord.guild_id)!;
      if (!server.channels.find(c => c.channelId === discord.channel_id)) {
        server.channels.push({
          channelId: discord.channel_id,
          channelName: discord.channel_name,
          discordData: discord,
          alerts: []
        });
        server.serverName = discord.server_name;
      }
    });

    alerts.forEach(alert => {
      const guildId = alert.webhook.guild_id;
      const channelId = alert.webhook.channel_id;

      if (!serverMap.has(guildId)) {
        serverMap.set(guildId, {
          serverId: guildId,
          serverName: `Serveur ${guildId}`,
          channels: []
        });
      }
      const server = serverMap.get(guildId)!;

      let channel = server.channels.find(c => c.channelId === channelId);
      if (!channel) {
        channel = {
          channelId: channelId,
          channelName: `Channel ${channelId}`,
          alerts: []
        };
        server.channels.push(channel);
      }

      channel.alerts.push(alert);
    });

    setGroupedServer(Array.from(serverMap.values()));
  }, [alerts, discords, setGroupedServer]);

  return <>{children}</>;
}