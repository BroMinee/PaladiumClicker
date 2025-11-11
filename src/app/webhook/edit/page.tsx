import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WebHookSelectorClientItem } from "@/components/WebHooks/WebHookClientSelector";
import { WebHookInputClientItem } from "@/components/WebHooks/WebHookInputClient";
import React from "react";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper";

import { constants } from "@/lib/constants";

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | Webhook | Edit";
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
 * [Webhook edit page](https://palatracker.bromine.fr/webhook/edit)
 */
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