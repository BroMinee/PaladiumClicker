'use client'

import { WebHookType, } from "@/types";
import { Button } from "@/components/ui/button.tsx";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { getTextFromWebHookType } from "@/lib/misc.ts";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import constants from "@/lib/constants.ts";

export function WebHookSelectorClientItem() {
  const router = useRouter();
  const validWebHookType = [WebHookType.QDF, WebHookType["adminShop"], WebHookType.market, WebHookType.EventPvp, WebHookType["statusServer"]]

  const { setCurrentWebHookType, currentWebHookType } = useWebhookStore();

  return (

    <div className="flex flex-col gap-4">
      <Button onClick={() => router.push(constants.webhooksPath)} className="bg-red-500 w-fit">
        <IoMdArrowRoundBack/>
        Revenir à la liste des alertes
      </Button>
      <div className="flex flex-wrap justify-center items-center w-full gap-2">
      {
        validWebHookType.map((webhookType, index) => (
          <Button
            key={webhookType + index}
            onClick={() => {
              setCurrentWebHookType(webhookType);
            }}
            disabled={webhookType === currentWebHookType}
          >
            {getTextFromWebHookType(webhookType)}
          </Button>))
      }
      </div>

    </div>
  )
}