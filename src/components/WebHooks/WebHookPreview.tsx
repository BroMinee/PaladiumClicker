'use client';
import { getItemFromName, WebHookAlert, WebhookDiscord, WebHookType } from "@/types";
import './WebHookMsg.css';
import { getIconNameFromEventType, getTextFromWebHookType } from "@/lib/misc.ts";
import { Button } from "@/components/ui/button.tsx";
import { FiEdit } from "react-icons/fi";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils.ts";
import { FaTrashCan } from "react-icons/fa6";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { useRouter } from "next/navigation";
import { deleteWebhookServerAction } from "@/lib/api/apiServerAction.ts";
import { toast } from "sonner";

export function WebHookPreview({ webHookAlert }: { webHookAlert: WebHookAlert }) {

  const displayIcon = (webHookAlert.type === WebHookType.market || webHookAlert.type === WebHookType.adminShop) || (webHookAlert.type === WebHookType.EventPvp && webHookAlert.enumEvent)

  const {
    setCurrentWebHookType,
    setWebHookUrl,
    setTitle,
    setEmbed,
    setItemSelected,
    setAdminShopItemSelected,
    setEventSelected,
    setContent,
    setThresholdCondition,
    setThreshold,
    setEdit,
    setIdAlert
  } = useWebhookStore();
  const router = useRouter();


  function handleEdit(webHookAlert: WebHookAlert) {
    setCurrentWebHookType(webHookAlert.type);
    setWebHookUrl(webHookAlert.webhook.url);
    if (webHookAlert.title)
      setTitle(webHookAlert.title);
    if (webHookAlert.item && webHookAlert.type === WebHookType.market)
      setItemSelected({
        value: webHookAlert.item.item_name,
        img: webHookAlert.item.img,
        label: webHookAlert.item.us_trad,
        label2: webHookAlert.item.fr_trad
      });

    if (webHookAlert.embed)
      setEmbed(webHookAlert.embed);
    if (webHookAlert.item && webHookAlert.type === WebHookType.adminShop)
      setAdminShopItemSelected(getItemFromName(webHookAlert.item.item_name));
    if (webHookAlert.type === WebHookType.EventPvp && webHookAlert.enumEvent)
      setEventSelected(webHookAlert.enumEvent);
    if (webHookAlert.content)
      setContent(webHookAlert.content);
    if ((webHookAlert.type === WebHookType.adminShop || webHookAlert.type === WebHookType.market)) {
      if (webHookAlert.thresholdCondition)
        setThresholdCondition(webHookAlert.thresholdCondition);
      if (webHookAlert.threshold)
        setThreshold(webHookAlert.threshold);
    }

    setIdAlert(webHookAlert.id);

    setEdit(true);

    router.push("/webhooks/edit")
  }


  async function handleDelete(webHookAlert: WebHookAlert) {
    const confirm = window.confirm("Etes-vous sûr de vouloir supprimer cette alerte ?");
    if (confirm) {
      const res = await deleteWebhookServerAction(webHookAlert.id);
      if (!res.succeeded) {
        toast.error(res.msg);
      } else {
        toast.success(res.msg);
      }
    }
  }


  return (
    <div className="alert-container w-full !border-0">
      <div className={cn("header-text flex flex-row !justify-start", !displayIcon && "ml-[32px]")}>
        {(webHookAlert.type === WebHookType.market || webHookAlert.type === WebHookType.adminShop) && webHookAlert.item &&
          <Image src={`/AH_img/${webHookAlert.item.img}`} className="object-cover pixelated" alt="item icon" width={32}
                 height={32} unoptimized/>
        }
        {webHookAlert.type === WebHookType.EventPvp && webHookAlert.enumEvent &&
          <Image src={`https://palatracker.bromine.fr/${getIconNameFromEventType(webHookAlert.enumEvent)}`} alt="icon"
                 height={32} width={32} unoptimized/>
        }
        <span className="app-badge">{getTextFromWebHookType(webHookAlert.type)}</span>
        <span className="title">{webHookAlert.title}</span>
        <Button size="icon" onClick={() => handleEdit(webHookAlert)}>
          <FiEdit/>
        </Button>
        <Button size="icon" className="bg-red-600" onClick={() => handleDelete(webHookAlert)}>
          <FaTrashCan/>
        </Button>
      </div>
      <span className="embed-footer">
        Serveur id: {webHookAlert.webhook.guild_id} • Channel id: {webHookAlert.webhook.channel_id}
      </span>

    </div>
  );
}

export function CreateNewWebHookButtonKnowingUrl({ webhookDiscord, text }: {
  webhookDiscord: WebhookDiscord | undefined
  text: string,
}) {
  const router = useRouter();
  const { setWebHookUrl, setEdit } = useWebhookStore();

  function handleNew() {
    if (!webhookDiscord) {
      console.error("Unable to find webhookDiscord for this channel. Please contact an admin");
      return;
    }
    setWebHookUrl(webhookDiscord.url);
    setEdit(false);
    router.push("/webhooks/create")
  }

  return (
    <div className="alert-container w-full flex flex-col !border-0 justify-center items-center">
      <Button onClick={handleNew}>
        {text}
      </Button>
    </div>

  )
}

export function CreateNewWebHookButtonWithoutKnowing() {
  return (
    <div className="alert-container w-full flex flex-col !border-0 justify-center items-center">
      <a href="http://localhost:3001/v1/auth/webhook/create">
        <Button>
          {"Créer une alerte sur un autre serveur ou channel."}
        </Button>
      </a>
    </div>
  )
}