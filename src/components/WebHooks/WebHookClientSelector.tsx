'use client'

import { WebHookType, } from "@/types";
import { Button } from "@/components/ui/button.tsx";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";

function getTextFromWebHookType(webHookType: WebHookType) {
  switch (webHookType) {
    case WebHookType.QDF:
      return "QDF";
    case WebHookType["AdminShop"]:
      return "AdminShop";
    case WebHookType.Market:
      return "Market";
    case WebHookType.Event:
      return "Event";
    case WebHookType.ServeurStatus:
      return "Status serveur";
    default:
      return "Unknown WebHookType"
  }
}

export function WebHookSelectorClientItem() {
  const validWebHookType = [WebHookType.QDF, WebHookType["AdminShop"], WebHookType.Market, WebHookType.Event, WebHookType["ServeurStatus"]]

  const { setCurrentWebHookType, currentWebHookType } = useWebhookStore();

  return (
    <div className="flex flex-row justify-between">
      {validWebHookType.map((webhookType) => (
        <Button
          onClick={() => {
            setCurrentWebHookType(webhookType);
          }}
          disabled={webhookType === currentWebHookType}
        >
          {getTextFromWebHookType(webhookType)}
        </Button>))
      }
    </div>
  )
}