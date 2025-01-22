import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import React from "react";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper.tsx";
import { getWebHookFromCookies } from "@/lib/api/apiPalaTracker.ts";
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
  // let webHookDiscord = await getWebHookDiscordUnusedFromCookies(); TODO
  const guildIdToServerName = {};
  const channelIdToChannelName = {};

  const groups: Record<string, Record<string, WebHookAlert[]>> = webHookAlerts.reduce((acc, webhook) => {
    guildIdToServerName[webhook.webhook.guild_id] = webhook.webhook.server_name;
    channelIdToChannelName[webhook.webhook.channel_id] = webhook.webhook.channel_name;

    if (!acc[webhook.webhook.guild_id]) {
      acc[webhook.webhook.guild_id] = {} as Record<string, WebHookAlert[]>;
    }

    if (!acc[webhook.webhook.guild_id][webhook.webhook.channel_id]) {
      acc[webhook.webhook.guild_id][webhook.webhook.channel_id] = [];
    }
    acc[webhook.webhook.guild_id][webhook.webhook.channel_id].push(webhook);
    return acc;
  }, {});

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
              Object.keys(groups).map((guildId, index) => (
                <div key={`${guildId}-${index}`} className="px-4 border-2 py-2 border-secondary-foreground">
                  <div>
                    <h2 className="font-bold text-xl">Serveur: {guildIdToServerName[guildId]}</h2>
                    {
                      Object.keys(groups[guildId]).map((channelId, index) => (
                        <div key={`${channelId}-${index}`} className="px-4 border-2 py-2 mb-2 border-primary">
                          <h3 className="font-bold text-l">Channel: {channelIdToChannelName[channelId]}</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {
                              groups[guildId][channelId].sort((w1, w2) => w1.type.localeCompare(w2.type)).map((webhook, index) => (
                                <WebHookPreview key={`webhook-${index}`} webHookAlert={webhook}/>
                              ))
                            }
                            Creer un webhook
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
            ))
          }
          </div>

        </CardContent>
      </Card>
    </AuthForceWrapper>
  );
};