import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { redirect } from "next/navigation";
import { WebHookType } from "@/types";
import { WebHookSelectorClientItem } from "@/components/WebHooks/WebHookClientSelector.tsx";
import { WebHookInputClientItem } from "@/components/WebHooks/WebHookInputClient.tsx";
import GraphItem from "@/components/AhTracker/GraphItem.tsx";
import React, { Suspense } from "react";
import { GraphItemFallback } from "@/app/ah/page.tsx";
import { generateWebHookUrl } from "@/lib/misc.ts";

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

type webHookPageProps =
  {
    webhookType: string | undefined
    item: string | undefined
  }
export default function WebHooksPage({ searchParams }: {
  searchParams: webHookPageProps
}) {

  return (
    <Card>
      <CardHeader>
        <WebHookSelectorClientItem/>
      </CardHeader>
      <CardContent>
        <WebHookInputClientItem/>
      </CardContent>

    </Card>
  )
    ;
};
