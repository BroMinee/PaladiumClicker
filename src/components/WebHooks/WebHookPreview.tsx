"use client";
import { getItemFromName, WebHookAlert, WebhookDiscord, WebHookType } from "@/types";
import "./WebHookMsg.css";
import { getIconNameFromEventType, getTextFromWebHookType } from "@/lib/misc.ts";
import { Button } from "@/components/ui/button.tsx";
import { FiEdit } from "react-icons/fi";
import React, { useState } from "react";
import Image from "next/image";
import { FaTrashCan } from "react-icons/fa6";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { useRouter } from "next/navigation";
import { deleteWebhookServerAction } from "@/lib/api/apiServerAction.ts";
import { toast } from "sonner";
import constants, { API_PALATRACKER } from "@/lib/constants.ts";
import { DisplayChannelBox, DisplayServerBox } from "@/components/WebHooks/WebHookDisplayServerInfo.tsx";
import { groupsType } from "@/app/webhook/page.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

export function WebHookPreviewPage({
  groupsArg,
  webHookDiscord,
  guildIdToServerName,
  channelIdToChannelName,
}:
                                     {
                                       groupsArg: groupsType,
                                       webHookDiscord: WebhookDiscord[],
                                       guildIdToServerName: Record<string, string>,
                                       channelIdToChannelName: Record<string, string>,
                                     }) {

  const [groups, setGroups] = useState(groupsArg);

  return (
    <div className="flex flex-col gap-12">
      <CreateNewWebHookButtonWithoutKnowing/>
      {
        groups && Object.keys(groups).map((guildId, index) => (
          <DisplayServerBox key={`${guildId}-${index}`} guildId={guildId} guildIdToServerName={guildIdToServerName}
            channelId={Object.keys(groups[guildId])[0]}
          >
            {
              Object.keys(groups[guildId]).map((channelId, index) => (
                <DisplayChannelBox key={`${guildId}-${channelId}-${index}`} channelId={channelId}
                  guildId={guildId}
                  channelIdToChannelName={channelIdToChannelName}
                >
                  {
                    groups[guildId][channelId] &&
                    groups[guildId][channelId].sort((w1, w2) => w1.type.localeCompare(w2.type)).map((webhook, index) => (
                      <WebHookPreview key={`webhook-${index}`} webHookAlert={webhook} groups={groups}
                        setGroups={setGroups}/>
                    ))
                  }
                  <CreateNewWebHookButtonKnowingUrl
                    text={"Créer une alerte sur ce channel."}
                    webhookDiscord={webHookDiscord.find(w => w.guild_id === guildId && w.channel_id === channelId)}/>
                </DisplayChannelBox>
              ))
            }
          </DisplayServerBox>
        ))
      }
    </div>
  );
}

export function WebHookPreview({ webHookAlert, groups, setGroups }: {
  webHookAlert: WebHookAlert,
  groups: groupsType,
  setGroups: (groups: groupsType) => void
}) {

  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
    setIdAlert,
    setUsername,
  } = useWebhookStore();
  const router = useRouter();

  function handleEdit(webHookAlert: WebHookAlert) {
    setCurrentWebHookType(webHookAlert.type);
    setWebHookUrl(webHookAlert.webhook.url);
    setUsername(webHookAlert.username ?? "");
    if (webHookAlert.title) {
      setTitle(webHookAlert.title);
    }
    if (webHookAlert.item && webHookAlert.type === WebHookType.market) {
      setItemSelected({
        value: webHookAlert.item.item_name,
        img: webHookAlert.item.img,
        label: webHookAlert.item.us_trad,
        label2: webHookAlert.item.fr_trad
      });
    }

    if (webHookAlert.embed) {
      setEmbed(webHookAlert.embed);
    }
    if (webHookAlert.item && webHookAlert.type === WebHookType.adminShop) {
      setAdminShopItemSelected(getItemFromName(webHookAlert.item.item_name));
    }
    if (webHookAlert.type === WebHookType.EventPvp && webHookAlert.enumEvent) {
      setEventSelected(webHookAlert.enumEvent);
    }
    if (webHookAlert.content) {
      setContent(webHookAlert.content);
    }
    if ((webHookAlert.type === WebHookType.adminShop || webHookAlert.type === WebHookType.market)) {
      if (webHookAlert.thresholdCondition) {
        setThresholdCondition(webHookAlert.thresholdCondition);
      }
      if (webHookAlert.threshold) {
        setThreshold(webHookAlert.threshold);
      }
    }

    setIdAlert(webHookAlert.id);

    setEdit(true);

    router.push(`${constants.webhooksPath}/edit`);
  }

  async function handleDelete(webHookAlert: WebHookAlert) {
    const res = await deleteWebhookServerAction(webHookAlert.id);
    if (!res.succeeded) {
      toast.error(res.msg);
    } else {
      let newGroups = { ...groups };
      newGroups[webHookAlert.webhook.guild_id][webHookAlert.webhook.channel_id] = newGroups[webHookAlert.webhook.guild_id][webHookAlert.webhook.channel_id].filter((w) => w.id !== webHookAlert.id);
      setGroups(newGroups);
      toast.success(res.msg);
    }
  }

  const handleCancelReplacement = () => {
    setIsPopupOpen(false);
    toast.success("Suppression annulée");
  };

  return (
    <div className="alert-container w-full !border-0">
      <div className="header-text flex flex-row">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-start">
          {(webHookAlert.type === WebHookType.market || webHookAlert.type === WebHookType.adminShop) && webHookAlert.item &&
            <Image src={`/AH_img/${webHookAlert.item.img}`} className="object-cover pixelated" alt="item icon"
              width={32}
              height={32} unoptimized/>
          }
          {webHookAlert.type === WebHookType.EventPvp && webHookAlert.enumEvent &&
            <Image src={`https://palatracker.bromine.fr/${getIconNameFromEventType(webHookAlert.enumEvent)}`} alt="icon"
              height={32} width={32} unoptimized/>
          }
          {webHookAlert.type === WebHookType.QDF &&
            <Image src={"https://palatracker.bromine.fr/EventIcon/qdf.png"} alt="icon"
              height={32} width={32} unoptimized/>
          }
          {webHookAlert.type === WebHookType.statusServer &&
            <Image src={"https://palatracker.bromine.fr/EventIcon/status.png"} alt="icon"
              height={32} width={32} unoptimized/>
          }
          {webHookAlert.type === WebHookType.vote &&
            <Image src={"https://palatracker.bromine.fr/img/MarketUI/pb_icon.png"} alt="icon"
              height={32} width={32} unoptimized/>
          }
          <span className="app-badge">{getTextFromWebHookType(webHookAlert.type)}</span>
          <span className="title">{webHookAlert.title}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1">
          <Button size="icon" onClick={() => handleEdit(webHookAlert)}>
            <FiEdit/>
          </Button>
          <Button size="icon" className="bg-red-600" onClick={() => setIsPopupOpen(true)}>
            <FaTrashCan/>
          </Button>
          <Dialog open={isPopupOpen} onOpenChange={handleCancelReplacement}>
            <DialogContent className="px-0 pb-0 max-w-4xl justify-items-center">
              <DialogHeader className="px-6">
                <DialogTitle className="text-primary">Confirmer la suppression l&apos;alerte</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-fit h-max-[80dvh] px-6 border-t">
                Etes vous sûr de vouloir supprimer cette notification ?
              </ScrollArea>
              <div className="flex flex-row gap-2 pb-2">
                <Button onClick={() => handleDelete(webHookAlert)} className="bg-green-500">Oui</Button>
                <Button onClick={handleCancelReplacement} className="bg-red-500">Non</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
    router.push(`${constants.webhooksPath}/create`);
  }

  return (
    <Button onClick={handleNew}>
      {text}
    </Button>
  );
}

export function CreateNewWebHookButtonWithoutKnowing() {
  return (
    <div className="alert-container w-full flex flex-col !border-0 justify-center items-center">
      <a href={`${API_PALATRACKER}/v1/auth/webhook/create`}>
        <Button>
          {"Créer une alerte sur un autre serveur ou channel."}
        </Button>
      </a>
    </div>
  );
}