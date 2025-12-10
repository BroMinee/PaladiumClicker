import React from "react";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper";
import { getWebHookDiscordFromCookies, getWebHookFromCookies } from "@/lib/api/apiPalaTracker";
import { constants } from "@/lib/constants";
import { SetWebhookStore } from "@/components/webhook1/set-webhook-store.client";
import { DashboardRefonteMultipleChannels } from "@/components/webhook1/dashboard.client";

/**
 * Generate Metadata
 */
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

/**
 * [Webhook page](https://palatracker.bromine.fr/webhooks)
 */
export default async function Page() {
  return (
    <AuthForceWrapper url={`${constants.webhooksPath}/login`}>
      <PageWeb/>
    </AuthForceWrapper>
  );
}

/**
 * Webhook Page Content - Dashboard
 */
export async function PageWeb() {
  const alerts = await getWebHookFromCookies();
  const discords = await getWebHookDiscordFromCookies();

  return (
    <SetWebhookStore alerts={alerts} discords={discords}>
      <DashboardRefonteMultipleChannels/>
    </SetWebhookStore>
  );
}