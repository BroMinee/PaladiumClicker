import { Card, CardContent, CardHeader, CardTitleH1 } from "@/components/ui/card.tsx";
import React from "react";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper.tsx";
import { getWebHookDiscordFromCookies, getWebHookFromCookies } from "@/lib/api/apiPalaTracker.ts";
import { WebHookPreviewPage } from "@/components/WebHooks/WebHookPreview.tsx";
import { WebHookAlert } from "@/types";
import constants from "@/lib/constants.ts";

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
  };
}

export type subGroupsType = Record<string, WebHookAlert[]>;

export type groupsType = Record<string, subGroupsType>;

export default async function WebHooksMainPage() {
  return (
    <AuthForceWrapper url={`${constants.webhooksPath}/login`}>
      <Card>
        <CardHeader>
          <CardTitleH1>
            Définissez des webhooks discord pour recevoir des notifications en temps réel sur Paladium.
          </CardTitleH1>
        </CardHeader>
        <WebHooksPage/>
      </Card>
    </AuthForceWrapper>
  );
};

export async function WebHooksPage() {
  const webHookAlerts = await getWebHookFromCookies();
  const webHookDiscord = await getWebHookDiscordFromCookies();
  const guildIdToServerName: Record<string, string> = {};
  const channelIdToChannelName: Record<string, string> = {};

  const groups: groupsType = webHookDiscord.reduce((acc, webhook) => {
    guildIdToServerName[webhook.guild_id] = webhook.server_name;
    channelIdToChannelName[webhook.channel_id] = webhook.channel_name;

    if (!acc[webhook.guild_id]) {
      acc[webhook.guild_id] = {} as subGroupsType;
    }

    if (!acc[webhook.guild_id][webhook.channel_id]) {
      acc[webhook.guild_id][webhook.channel_id] = [];
    }
    return acc;
  }, {} as groupsType);

  webHookAlerts.forEach((webhook) => {
    if (groups[webhook.webhook.guild_id] && groups[webhook.webhook.guild_id][webhook.webhook.channel_id]) {
      groups[webhook.webhook.guild_id][webhook.webhook.channel_id].push(webhook);
    } else {
      throw new Error(`Webhook not found in groups ${webhook.webhook} ${groups}`);
    }
  });

  return (
    <CardContent className="flex flex-col justify-left gap-2">
      {webHookAlerts.length === 0 &&
          <CardTitleH1>Vous n&apos;avez pas de webhooks définis. Créez-en un dès maintenant !
          </CardTitleH1>
      }
      <WebHookPreviewPage webHookDiscord={webHookDiscord} channelIdToChannelName={channelIdToChannelName}
        guildIdToServerName={guildIdToServerName} groupsArg={groups}/>
    </CardContent>
  );
}
