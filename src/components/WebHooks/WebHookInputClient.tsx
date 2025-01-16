'use client';
import React, { useEffect } from "react";
import {
  defaultWebHookContentFromType,
  defaultWebHookEmbedFromType,
  defaultWebhookEmbedImgFromType,
  defaultWebHookFieldsFromType,
  defaultWebHookTitleFromType,
  defaultWebhookTitleUrlFromType, defaultWebhookValidFormatFromType
} from "@/components/WebHooks/WebHookConstant.ts";
import { GenerateWebHookContent } from "@/components/WebHooks/WebHookMsg.tsx";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { WebHookType } from "@/types";
import {
  RecapAdminShop,
  RecapEvent,
  RecapMarket,
  RecapQDF,
  RecapServeurStatus
} from "@/components/WebHooks/WebHookRecap.tsx";
import { MarketInput } from "@/components/WebHooks/WebHookMarket/WebHookClient.tsx";
import { AdminShopInput } from "@/components/WebHooks/WebHookAdminShop/WebHookClient.tsx";


export function WebHookInputClientItem() {

  const {
    setEmbed,
    setContent,
    setFields,
    setTitle,
    setTitleUrl,
    setEmbedImg,
    setItemSelected,
    setEventSelected,
    setAdminShopItemSelected,
    currentWebHookType
  } = useWebhookStore();


  useEffect(() => {
    setContent(defaultWebHookContentFromType[currentWebHookType]);
    setEmbed(defaultWebHookEmbedFromType[currentWebHookType]);
    setFields(defaultWebHookFieldsFromType[currentWebHookType]);
    setTitle(defaultWebHookTitleFromType[currentWebHookType]);
    setTitleUrl(defaultWebhookTitleUrlFromType[currentWebHookType]);
    setEmbedImg(defaultWebhookEmbedImgFromType[currentWebHookType]);
    if(currentWebHookType === "Market")
      setItemSelected({value: "endium_sword", label: "Endium Sword", img: "endium_sword.png", label2: "Épée d'Endium"});
    else if (currentWebHookType === "AdminShop")
      setAdminShopItemSelected("bone");
    else if (currentWebHookType === "Event")
      setEventSelected("A VOS MARQUES");
    else if(currentWebHookType === "QDF")
      setItemSelected({value: "glue", label: "Glue", img: "glue.png", label2: "Colle"});
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

function WebHookEditor() {

  const {
    currentWebHookType,
    webHookUrl,
    content,
    embed,
    setEmbed,
    setContent,
    setWebHookUrl,
    helpFormat,
    setHelpFormat
  } = useWebhookStore();
  return (
    <div className="flex flex-col gap-2">
      <Recap/>
      <AdaptEditor/>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="url">URL du WebHook</label>
        <div className="flex flex-row gap-2 h-fit">
          <input
            id="url"
            value={webHookUrl}
            className="w-full message-input"
            placeholder={"https://discord.com/api/webhooks/..."}
            onChange={(e) => setWebHookUrl(e.target.value)}
          />
          <Button onClick={() => alert("TODO")} className="h-full">
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
        <label htmlFor="embed">Contenu de l'embed <span
          className={cn("text-gray-500", embed.length === 4096 && "animate-blink")}>{embed.length}/4096</span></label>
        <textarea
          className="message-input"
          id="embed"
          value={embed}
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
  if (currentWebHookType === WebHookType.ServeurStatus)
    return null;

  if (currentWebHookType === WebHookType.AdminShop) {
    return <AdminShopInput/>
  }

  if (currentWebHookType === WebHookType.Market) {
    return <MarketInput/>
  }
  return null;
}

export function Recap() {
  const { currentWebHookType } = useWebhookStore();
  switch (currentWebHookType) {
    case WebHookType.QDF:
      return <RecapQDF/>;
    case WebHookType.Market:
      return <RecapMarket/>
    case WebHookType.AdminShop:
      return <RecapAdminShop/>
    case WebHookType.Event:
      return <RecapEvent/>
    case WebHookType.ServeurStatus:
      return <RecapServeurStatus/>
    default:
      return null;
  }
}
