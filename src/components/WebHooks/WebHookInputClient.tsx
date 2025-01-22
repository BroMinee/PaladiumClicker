'use client';
import React, { useEffect } from "react";
import {
  defaultWebHookContentFromType,
  defaultWebHookEmbedFromType,
  defaultWebhookEmbedImgFromType,
  defaultWebHookFieldsFromType,
  defaultWebHookTitleFromType,
  defaultWebhookTitleUrlFromType,
  defaultWebhookValidFormatFromType
} from "@/components/WebHooks/WebHookConstant.ts";
import { GenerateWebHookContent } from "@/components/WebHooks/WebHookMsg.tsx";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { WebHookCreate, WebHookType } from "@/types";
import {
  RecapAdminShop,
  RecapEvent,
  RecapMarket,
  RecapQDF,
  RecapServeurStatus
} from "@/components/WebHooks/WebHookRecap.tsx";
import { MarketInput } from "@/components/WebHooks/WebHookMarket/WebHookClient.tsx";
import { AdminShopInput, EventInput } from "@/components/WebHooks/WebHookAdminShop/WebHookClient.tsx";
import { createWebHookServerAction } from "@/lib/api/apiServerAction.ts";
import { toast } from "sonner";


export function WebHookInputClientItem() {

  const {
    setEmbed,
    setContent,
    setFields,
    setTitle,
    setTitleUrl,
    setEmbedImg,
    setItemSelected,
    setAdminShopItemSelected,
    currentWebHookType,
    thresholdCondition,
    eventSelected,
    setThresholdCondition
  } = useWebhookStore();

  useEffect(() => {
    if (currentWebHookType !== WebHookType.market && thresholdCondition === 'aboveQuantity')
      setThresholdCondition('aboveThreshold');
  }, [currentWebHookType]);

  useEffect(() => {
    if (currentWebHookType === WebHookType.EventPvp && eventSelected === "A VOS MARQUES") {
      setItemSelected({ value: "beefCooked", label: "Steak", img: "steak.png", label2: "Steak" });
    }
  }, [currentWebHookType, eventSelected]);


  useEffect(() => {
    setContent(defaultWebHookContentFromType[currentWebHookType]);
    setEmbed(defaultWebHookEmbedFromType[currentWebHookType]);
    setFields(defaultWebHookFieldsFromType[currentWebHookType]);
    setTitle(defaultWebHookTitleFromType[currentWebHookType]);
    setTitleUrl(defaultWebhookTitleUrlFromType[currentWebHookType]);
    setEmbedImg(defaultWebhookEmbedImgFromType[currentWebHookType]);
    if (currentWebHookType === "market")
      setItemSelected({
        value: "endium-sword",
        label: "Endium Sword",
        img: "endium_sword.png",
        label2: "Épée d'Endium"
      });
    else if (currentWebHookType === "adminShop")
      setAdminShopItemSelected("bone");
    else if (currentWebHookType === "QDF")
      setItemSelected({ value: "glue", label: "Glue", img: "glue.png", label2: "Colle" });
    else
      setItemSelected(null);
  }, [currentWebHookType]);

  return (
    <div className="flex flex-row gap-2 justify-between">
      <WebHookEditor/>
      {/*<WebHookRender content={content} embed={embed} currentWebHookType={currentWebHookType}/>*/}
      <GenerateWebHookContent/>
    </div>
  )
}

function IsValidWebHookUrl(url: string): boolean {
  return url.startsWith("https://discord.com/api/webhooks/");
}

function WebHookEditor() {


  const {
    currentWebHookType,
    webHookUrl,
    content,
    embed,
    eventSelected,
    itemSelected,
    threshold,
    thresholdCondition,
    title,
    adminShopItemSelected,
    setEmbed,
    setContent,
    setWebHookUrl,
    helpFormat,
    setHelpFormat
  } = useWebhookStore();


  async function createWebHook() {
    const body: WebHookCreate = {
      url: webHookUrl,
      content: content,
      embed: embed,
      enumEvent: eventSelected,
      itemName: currentWebHookType === WebHookType.market ? itemSelected?.value || null : (currentWebHookType === WebHookType.adminShop ? adminShopItemSelected : null),
      threshold: threshold,
      thresholdCondition: thresholdCondition,
      title: title,
      type: currentWebHookType,
    }
    const [b, msg] = await createWebHookServerAction(body);
    if (!b) {
      toast.error(msg);
    } else {
      toast.success("WebHook créé avec succès");
    }

  }

  return (
    <div className="flex flex-col gap-2">
      <Recap/>
      <AdaptEditor/>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="url">URL du WebHook <span
          className={cn("text-gray-500", !IsValidWebHookUrl(webHookUrl) && "animate-blink")}>
          {IsValidWebHookUrl(webHookUrl) ? "URL possiblement valide" : "URL Invalide"}
                </span></label>
        <div className="flex flex-row gap-2 h-fit">
          <input
            id="url"
            value={webHookUrl}
            className="w-full message-input"
            placeholder={"https://discord.com/api/webhooks/..."}
            onChange={(e) => setWebHookUrl(e.target.value)}
          />
          <Button onClick={createWebHook} className="h-full">
            Enregistrer
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="next-building-visibility"
          className="h-6 w-6"
          checked={helpFormat}
          onCheckedChange={() => setHelpFormat(!helpFormat)}
        />
        <label htmlFor="next-building-visibility" className="text-primary-foreground">
          Afficher les formats possibles
        </label>
      </div>

      {helpFormat &&
        <div className="w-full alert-container">
          <div className="alert-header flex flex-col">
            <div className="header-text">
              <span className="title">Vous pouvez utiliser les mentions suivantes:</span>
            </div>
            <div className="message-content ml-2">
              <li>{"<@&roleId> pour mentionner un rôle (aucun effet dans l'embed)"}</li>
              <li>{"<@userId> pour mentionner un utilisateur (aucun effet dans l'embed)"}
              </li>
              <li>{"{here} Pour mentionner toutes personnes dans le channel (aucun effet dans l'embed)"}
              </li>
              {defaultWebhookValidFormatFromType[currentWebHookType].map((format, index) => {
                return <li key={index}>{format}</li>
              })}
            </div>
          </div>
        </div>
      }

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row gap-2 items-center">
          <label htmlFor="content">Contenu du message <span
            className={cn("text-gray-500", content.length === 2000 && "animate-blink")}>{content.length}/2000
                </span>
          </label>
        </div>
        <textarea
          className="message-input"
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="embed">Contenu de l&apos;embed <span
          className={cn("text-gray-500", embed.length === 4096 && "animate-blink")}>{embed.length}/4096{currentWebHookType === WebHookType.statusServer && " - Désactivé"}</span></label>
        <textarea
          className="message-input"
          id="embed"
          value={embed}
          disabled={currentWebHookType === WebHookType.statusServer}
          onChange={(e) => setEmbed(e.target.value)}
        />
      </div>
    </div>
  )
}

function AdaptEditor() {
  const { currentWebHookType } = useWebhookStore();
  if (currentWebHookType === WebHookType.QDF)
    return null;
  if (currentWebHookType === WebHookType.statusServer)
    return null;

  if (currentWebHookType === WebHookType.adminShop) {
    return <AdminShopInput/>
  }

  if (currentWebHookType === WebHookType.market) {
    return <MarketInput/>
  }

  if (currentWebHookType === WebHookType.EventPvp) {
    return <EventInput/>
  }
  return null;
}

export function Recap() {
  const { currentWebHookType } = useWebhookStore();
  switch (currentWebHookType) {
    case WebHookType.QDF:
      return <RecapQDF/>;
    case WebHookType.market:
      return <RecapMarket/>
    case WebHookType.adminShop:
      return <RecapAdminShop/>
    case WebHookType.EventPvp:
      return <RecapEvent/>
    case WebHookType.statusServer:
      return <RecapServeurStatus/>
    default:
      return null;
  }
}
