import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import React from "react";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper.tsx";
import { getWebHookDiscordFromCookies, getWebHookFromCookies } from "@/lib/api/apiPalaTracker.ts";
import { WebHookPreview } from "@/components/WebHooks/WebHookPreview.tsx";
import { WebHookAlert } from "@/types";


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

  // TODO check that unique key is correctly respected


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
            {
              groups && Object.keys(groups).map((guildId, index) => (
                <DisplayServerBox key={`${guildId}-${index}`} guildId={guildId} guildIdToServerName={guildIdToServerName}
                                  >
                    {
                      Object.keys(groups[guildId]).map((channelId, index) => (
                        <DisplayChannelBox key={`${guildId}-${channelId}-${index}`} channelId={channelId}
                                           channelIdToChannelName={channelIdToChannelName}
                                           >
                            {
                              groups[guildId][channelId] &&
                              groups[guildId][channelId].sort((w1, w2) => w1.type.localeCompare(w2.type)).map((webhook, index) => (
                                <WebHookPreview key={`webhook-${index}`} webHookAlert={webhook}/>
                              ))
                            }
                            Creer un webhook
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

function DisplayServerBox({ guildId, guildIdToServerName, children }:
                            {
                              guildId: string,
                              guildIdToServerName: Record<string, string>,
                              children: React.ReactNode
                            }) {
  return (<div className="px-4 border-2 py-2 border-secondary-foreground">
    <div>
      <h2 className="font-bold text-xl">Serveur: {guildIdToServerName[guildId]}</h2>
      {children}
    </div>
  </div>)
}

function DisplayChannelBox({ channelId, channelIdToChannelName, children }: {
  channelId: string,
  channelIdToChannelName: Record<string, string>,
  children: React.ReactNode
}) {
  return (<div className="px-4 border-2 py-2 mb-2 border-primary">
    <h3 className="font-bold text-l">Channel: {channelIdToChannelName[channelId]}</h3>
    <div className="grid grid-cols-2 gap-2">
      {children}
    </div>
  </div>)
}