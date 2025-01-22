'use client'

import { WebHookType, } from "@/types";
import { Button } from "@/components/ui/button.tsx";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { getTextFromWebHookType } from "@/lib/misc.ts";


export function WebHookSelectorClientItem() {
  const validWebHookType = [WebHookType.QDF, WebHookType["adminShop"], WebHookType.market, WebHookType.EventPvp, WebHookType["statusServer"]]

  const { setCurrentWebHookType, currentWebHookType } = useWebhookStore();

  return (
    <div className="flex flex-row justify-between">
      {validWebHookType.map((webhookType, index) => (
        <Button
          key={webhookType+index}
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