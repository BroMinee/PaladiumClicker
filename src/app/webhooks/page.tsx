import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { redirect } from "next/navigation";
import constants from "@/lib/constants.ts";
import { WebHookType } from "@/types";
import { WebHookSelectorClientItem } from "@/components/WebHooks/WebHookClientSelector.tsx";
import { WebHookInputClientItem } from "@/components/WebHooks/WebHookInputClient.tsx";

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
  }
export default function WebHooksPage({ searchParams }: {
  searchParams: webHookPageProps
}) {
  if (searchParams.webhookType === undefined || !Object.values(WebHookType).includes(searchParams.webhookType as WebHookType))
    redirect(`${constants.webhooksPath}?webhookType=${WebHookType.QDF}`);

  const currentWebHookType = searchParams.webhookType as WebHookType

  return (
    <Card>
      <CardHeader>
        <WebHookSelectorClientItem currentWebHookType={currentWebHookType}/>
      </CardHeader>
      <CardContent>
        <WebHookInputClientItem currentWebHookType={currentWebHookType}/>
      </CardContent>

    </Card>
  )
    ;
};
