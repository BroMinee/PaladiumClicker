import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { WebHookSelectorClientItem } from "@/components/WebHooks/WebHookClientSelector.tsx";
import { WebHookInputClientItem } from "@/components/WebHooks/WebHookInputClient.tsx";
import React from "react";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper.tsx";
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
  }
}

export default async function WebHooksPage() {
  return (
    <AuthForceWrapper url={`${constants.webhooksPath}/login`}>
      <Card>
        <CardHeader>
          <WebHookSelectorClientItem/>
        </CardHeader>
        <CardContent>
          <WebHookInputClientItem/>
        </CardContent>
      </Card>
    </AuthForceWrapper>
  );
};