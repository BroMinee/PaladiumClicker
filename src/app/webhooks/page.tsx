import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import React from "react";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper.tsx";
import { getWebHookDiscordFromCookies, getWebHookFromCookies } from "@/lib/api/apiPalaTracker.ts";
import {
  CreateNewWebHookButtonKnowingUrl,
  CreateNewWebHookButtonWithoutKnowing,
  WebHookPreview
} from "@/components/WebHooks/WebHookPreview.tsx";
import { WebHookAlert } from "@/types";
import { DisplayChannelBox, DisplayServerBox } from "@/components/WebHooks/WebHookDisplayServerInfo.tsx";


export async function generateMetadata() {
  const title = "PalaTracker | Webhook";
  const description = "Définissez des webhooks discord pour recevoir des notifications en temps réel sur Paladium.";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  }
}

export default async function WebHooksPage() {
  let webHookAlerts = await getWebHookFromCookies();
  let webHookDiscord = await getWebHookDiscordFromCookies()
  const guildIdToServerName: Record<string, string> = {};
  const channelIdToChannelName: Record<string, string> = {};

  const groups: Record<string, Record<string, WebHookAlert[]>> = webHookDiscord.reduce((acc, webhook) => {
    guildIdToServerName[webhook.guild_id] = webhook.server_name;
    channelIdToChannelName[webhook.channel_id] = webhook.channel_name;

    if (!acc[webhook.guild_id]) {
      acc[webhook.guild_id] = {} as Record<string, WebHookAlert[]>;
    }

    if (!acc[webhook.guild_id][webhook.channel_id]) {
      acc[webhook.guild_id][webhook.channel_id] = [];
    }
    return acc;
  }, {} as Record<string, Record<string, WebHookAlert[]>>);

  webHookAlerts.forEach((webhook) => {
    if (groups[webhook.webhook.guild_id] && groups[webhook.webhook.guild_id][webhook.webhook.channel_id]) {
      groups[webhook.webhook.guild_id][webhook.webhook.channel_id].push(webhook);
    }
    else
    {
      throw new Error(`Webhook not found in groups ${webhook.webhook} ${groups}`);
    }
  });

  return (
    <AuthForceWrapper url={"/webhooks/login"}>
      <Card>
        <CardHeader>
          Définissez des webhooks discord pour recevoir des notifications en temps réel sur Paladium.
        </CardHeader>
        <CardContent className="flex flex-col justify-left gap-2">
          {webHookAlerts.length === 0 &&
            "Vous n'avez pas de webhooks définis. Créez-en un dès maintenant !"
          }
          <div className="flex flex-col gap-12">
            <CreateNewWebHookButtonWithoutKnowing/>
            {
              groups && Object.keys(groups).map((guildId, index) => (
                <DisplayServerBox key={`${guildId}-${index}`} guildId={guildId} guildIdToServerName={guildIdToServerName}
                                  channelId={Object.keys(groups[guildId])[0]}
                                  >
                    {
                      Object.keys(groups[guildId]).map((channelId, index) => (
                        <DisplayChannelBox key={`${guildId}-${channelId}-${index}`} channelId={channelId}
                                           guildId={guildId}
                                           channelIdToChannelName={channelIdToChannelName}
                                           >
                            {
                              groups[guildId][channelId] &&
                              groups[guildId][channelId].sort((w1, w2) => w1.type.localeCompare(w2.type)).map((webhook, index) => (
                                <WebHookPreview key={`webhook-${index}`} webHookAlert={webhook}/>
                              ))
                            }
                          <CreateNewWebHookButtonKnowingUrl
                            text={`Créer une alerte sur le channel "${channelIdToChannelName[channelId]}" du serveur "${guildIdToServerName[guildId]}"`}
                            webhookDiscord={webHookDiscord.find(w => w.guild_id === guildId && w.channel_id === channelId)}/>
                        </DisplayChannelBox>
                      ))
                    }
                </DisplayServerBox>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </AuthForceWrapper>
  );
};

