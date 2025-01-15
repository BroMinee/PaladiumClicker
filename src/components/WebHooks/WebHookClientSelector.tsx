'use client'

import { WebHookType, } from "@/types";
import { useRouter } from "next/navigation";
import { generateWebHookUrl, } from "@/lib/misc.ts";
import { Button } from "@/components/ui/button.tsx";

export function WebHookSelectorClientItem({ currentWebHookType }: {
  currentWebHookType: WebHookType
}) {
  const router = useRouter();
  const validWebHookType = [WebHookType.QDF, WebHookType["AdminShop"], WebHookType.Market, WebHookType.Event, WebHookType["ServeurStatus"]]

  return (
    <div className="flex flex-row justify-between">
      {validWebHookType.map((webhookType) => (
        <Button
          onClick={() => router.push(generateWebHookUrl(webhookType), { scroll: false })}
          disabled={webhookType === currentWebHookType}
        >
          {webhookType}
        </Button>))
      }
    </div>
  )
}