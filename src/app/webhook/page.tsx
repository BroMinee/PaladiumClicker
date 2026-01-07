import React from "react";
import { AuthForceWrapper } from "@/components/auth/auth-force-wrapper.server";
import { getWebHookDiscordFromCookies, getWebHookFromCookies } from "@/lib/api/api-pala-tracker.server";
import { constants } from "@/lib/constants";
import { SetWebhookStore } from "@/components/webhook/set-webhook-store.client";
import { DashboardRefonteMultipleChannels } from "@/components/webhook/dashboard.client";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc";

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
      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("Alertes Webhook °Discord°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          {"Définissez des alertes pour recevoir des notifications Discord en temps réel."}
        </PageHeaderDescription>
      </PageHeader>
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