'use client';
import { WebHookType } from "@/types";
import React, { useEffect } from "react";
import {
  defaultWebHookContentFromType,
  defaultWebHookEmbedFromType,
  defaultWebhookEmbedImgFromType,
  defaultWebHookFieldsFromType,
  defaultWebHookTitleFromType,
  defaultWebhookTitleUrlFromType
} from "@/components/WebHooks/WebHookConstant.ts";
import { GenerateWebHookContent } from "@/components/WebHooks/WebHookMsg.tsx";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { MarketInput, } from "@/components/WebHooks/WebHookMarket/WebHookClient.tsx";
import { AdminShopInput } from "@/components/WebHooks/WebHookAdminShop/WebHookClient.tsx";
import {
  RecapAdminShop,
  RecapEvent,
  RecapMarket,
  RecapQDF,
  RecapServeurStatus
} from "@/components/WebHooks/WebHookRecap.tsx";


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
    <div className="flex flex-row gap-2 justify-between items-center">
      <WebHookEditor/>
      {/*<WebHookRender content={content} embed={embed} currentWebHookType={currentWebHookType}/>*/}
      <GenerateWebHookContent/>
    </div>
  )
}

function WebHookEditor() {

  const { content, embed, setEmbed, setContent } = useWebhookStore();


  return (
    <div className="flex flex-col gap-2">
      <Recap/>
      <AdaptEditor/>
      <div className="flex flex-col gap-2">
        <label htmlFor="content">Contenu du message</label>
        <textarea
          id="content"
          value={content}
          className="w-96"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="embed">Contenu de l'embed</label>
        <textarea
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
