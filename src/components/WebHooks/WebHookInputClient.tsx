'use client';
import { AdminShopItem, adminShopItemsAvailable, OptionType, WebHookType } from "@/types";
import React, { useEffect, useState } from "react";
import {
  defaultWebHookContentFromType,
  defaultWebHookEmbedFromType,
  defaultWebhookEmbedImgFromType,
  defaultWebHookFieldsFromType,
  defaultWebHookTitleFromType,
  defaultWebhookTitleUrlFromType
} from "@/components/WebHooks/WebHookConstant.ts";
import { GenerateWebHookContent } from "@/components/WebHooks/WebHookMsg.tsx";
import { AdminShopSelectorClientItem } from "@/components/AdminShop/AdminShopSelectorClientItem.tsx";
import { SelectorItemClient } from "@/components/Items/SelectorItemClient.tsx";
import { getAllItemsServerAction } from "@/lib/api/apiServerAction.ts";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { Input } from "@/components/ui/input.tsx";


export function WebHookInputClientItem({ currentWebHookType }: {
  currentWebHookType: WebHookType
}) {

  const {
    setEmbed,
    setContent,
    setFields,
    setTitle,
    setTitleUrl,
    setEmbedImg,
    setItemSelected,
    setEventSelected
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
    else if(currentWebHookType === "QDF")
      setItemSelected({value: "glue", label: "Glue", img: "glue.png", label2: "Colle"});
    else
      setItemSelected(null);
  }, [currentWebHookType]);

  return (
    <div className="flex flex-row gap-2 justify-between items-center">
      <WebHookEditor currentWebHookType={currentWebHookType}/>
      {/*<WebHookRender content={content} embed={embed} currentWebHookType={currentWebHookType}/>*/}
      <GenerateWebHookContent currentWebHookType={currentWebHookType}/>
    </div>
  )
}

function WebHookEditor({ currentWebHookType }: {
  currentWebHookType: WebHookType,
}) {

  const { content, embed, setEmbed, setContent } = useWebhookStore();


  return (
    <div className="flex flex-col gap-2">
      <AdaptEditor currentWebHookType={currentWebHookType}/>
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

function AdaptEditor({ currentWebHookType }: { currentWebHookType: WebHookType }) {
  if (currentWebHookType === WebHookType.QDF)
    return null;
  if (currentWebHookType === WebHookType.ServeurStatus)
    return null;

  if (currentWebHookType === WebHookType.AdminShop) {
    return (
      <>
      <span>
        Choisissez un item de l'admin shop
      </span>
        <div className="grid grid-cols-6 sm:grid-cols-16 lg:grid-cols-16 items-center justify-between gap-2 pb-2 mt-0">
          {adminShopItemsAvailable.map((value: AdminShopItem, index: number) => {
            return <AdminShopSelectorClientItem key={value + index} item={value} periode={'day'}
                                                adminShopPage={false}/>
          })}
        </div>
      </>
    )
  }

  if (currentWebHookType === WebHookType.Market) {
    return (
      <>
      <span>
        Choisissez un item du market
      </span>
        <MarketSelectorClient/>
      </>
    )
  }

  return null;

}

function MarketSelectorClient() {
  const [options, setOptions] = useState<OptionType[]>([]);


  const { setItemSelected, setThreshold, threshold } = useWebhookStore();

  useEffect(() => {
    getAllItemsServerAction().then((items) => {
      setOptions(items);
    });

  }, []);

  if (options.length === 0)
    return <div>Loading...</div>;


  return (
    <div className="flex flex-row gap-2 pt-4 justify-center items-center w-full">
      <Input className="w-32" type="number" min="1" step="1"
             value={Number(threshold || 1)}
             onChange={(e) => {
               setThreshold(Number(e.target.value));
             }}/>
      <div className="flex-grow">
        <SelectorItemClient options={options}
                            url={"/error?msg=Heu... BroMine ce message d'erreur ne devrait pas exister..."}
                            setInputValueFunction={setItemSelected}
                            defaultValue={null}/>
      </div>
    </div>
  )
}