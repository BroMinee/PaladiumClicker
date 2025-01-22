import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import React from "react";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper.tsx";
import { getWebHookFromCookies } from "@/lib/api/apiPalaTracker.ts";
import { WebHookPreview } from "@/components/WebHooks/WebHookPreview.tsx";


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
  const r = await getWebHookFromCookies();

  return (
    <AuthForceWrapper url={"/webhooks/login"}>
      <Card>
        <CardHeader>
          Définissez des webhooks discord pour recevoir des notifications en temps réel sur Paladium.
        </CardHeader>
        <CardContent className="flex flex-col justify-left gap-2">
          {r.length === 0 &&
            "Vous n'avez pas de webhooks définis. Créez-en un dès maintenant !"
          }

          {
            r.map((webhook, index) => (
              <WebHookPreview key={`webhook-${index}`} webHookAlert={webhook}/>
            ))
          }
        </CardContent>
      </Card>
      {JSON.stringify(r)}
    </AuthForceWrapper>
  );
};