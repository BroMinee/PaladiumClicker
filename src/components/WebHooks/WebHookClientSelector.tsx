'use client'

import { WebHookType, } from "@/types";
import { Button } from "@/components/ui/button.tsx";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";

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
          {webhookType}
        </Button>))
      }
    </div>
  )
}