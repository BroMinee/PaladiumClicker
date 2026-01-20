"use client";
import React, { useEffect } from "react";
import {
  defaultWebHookContentFromType,
  defaultWebHookEmbedFromType,
  defaultWebhookEmbedImgFromType,
  defaultWebHookFieldsFromType,
  defaultWebHookTitleFromType,
  defaultWebhookTitleUrlFromType,
  defaultWebhookValidFormatFromType
} from "@/components/webHooks/webhook-constant";
import { GenerateWebHookContent } from "@/components/webHooks/webhook-msg";
import { useWebhookStore } from "@/stores/use-webhook-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { AhItemHistory, WebHookCreate, WebHookType } from "@/types";
import {
  RecapAdminShop,
  RecapEvent,
  RecapMarket,
  RecapQDF,
  RecapServerStatus,
  RecapVote
} from "@/components/webHooks/webhook-recap.client";
import { MarketInput } from "@/components/webHooks/market/webkook-client";
import { AdminShopInput, EventInput, VoteInput } from "@/components/webHooks/admin-shop/webhook-client";
import {
  createWebHookServerAction,
  editWebHookServerAction,
  getMarketHistoryServerAction
} from "@/lib/api/api-server-action.server";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { constants } from "@/lib/constants";
// import PlotAdminShopChart from "@/components/AdminShop/PlotAdminShopChart";
import { PlotHistoricChart } from "@/components/ah/plot-historic-chart.client";
import { AdminShopGraph } from "../admin-shop/admin-shop-page.client";

/**
 * Handles the setup or configuration of a webhook.
 *
 * Features:
 * - Updates default webhook fields (title, content, embed, image, URL) when type changes.
 * - Sets specific default items for Market, AdminShop, and QDF webhook types.
 * - Adjusts threshold conditions depending on webhook type.
 * - Handles special defaults for EventPvp when a specific event is selected.
 * - Renders the editor and controls for generating webhook content.
 */
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
    edit,
    setThresholdCondition
  } = useWebhookStore();

  useEffect(() => {
    if (currentWebHookType !== WebHookType.market && thresholdCondition === "aboveQuantity") {
      setThresholdCondition("aboveThreshold");
    }
  }, [currentWebHookType, thresholdCondition, setThresholdCondition]);

  useEffect(() => {
    if (currentWebHookType === WebHookType.EventPvp && eventSelected === "A VOS MARQUES") {
      setItemSelected({ value: "beefCooked", label: "Steak", img: "steak.png", label2: "Steak" });
    }
  }, [currentWebHookType, eventSelected, setItemSelected]);

  useEffect(() => {
    setTitleUrl(defaultWebhookTitleUrlFromType[currentWebHookType]);
    setEmbedImg(defaultWebhookEmbedImgFromType[currentWebHookType]);
    setFields(defaultWebHookFieldsFromType[currentWebHookType]);

    if (edit) {
      return;
    }

    setContent(defaultWebHookContentFromType[currentWebHookType]);
    setEmbed(defaultWebHookEmbedFromType[currentWebHookType]);
    setTitle(defaultWebHookTitleFromType[currentWebHookType]);
    if (currentWebHookType === "market") {
      setItemSelected({
        value: "endium-sword",
        label: "Endium Sword",
        img: "endium_sword.webp",
        label2: "Épée d'Endium"
      });
    } else if (currentWebHookType === "adminShop") {
      setAdminShopItemSelected("bone");
    } else if (currentWebHookType === "QDF") {
      setItemSelected({ value: "glue", label: "Glue", img: "glue.webp", label2: "Colle" });
    } else {
      setItemSelected(null);
    }
  }, [currentWebHookType, edit, setEmbed, setContent, setTitle, setItemSelected, setAdminShopItemSelected, setFields, setTitleUrl, setEmbedImg]);

  return (
    <div className="grid grid-cols-2 xl:flex-row gap-2 justify-between">
      <WebHookEditor/>
      {/*<WebHookRender content={content} embed={embed} currentWebHookType={currentWebHookType}/>*/}
      <div className="flex flex-col gap-2 h-full">
        <GenerateWebHookContent/>
        <AdaptEditorFooter/>
      </div>

    </div>
  );
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
    edit,
    idAlert,
    username,
    setEmbed,
    setContent,
    setTitle,
    helpFormat,
    setHelpFormat,
  } = useWebhookStore();

  const router = useRouter();

  if (!IsValidWebHookUrl(webHookUrl)) {
    toast.error("L'URL du webhook est invalide");
    router.push(constants.webhooksPath);
  }

  async function createWebHook() {
    const body: WebHookCreate = {
      id: edit ? idAlert : null,
      url: webHookUrl,
      content: content,
      embed: embed,
      enumEvent: eventSelected,
      itemName: currentWebHookType === WebHookType.market ? itemSelected?.value ?? null : (currentWebHookType === WebHookType.adminShop ? adminShopItemSelected : null),
      threshold: threshold,
      thresholdCondition: thresholdCondition,
      title: title,
      type: currentWebHookType,
      username: currentWebHookType === WebHookType.vote ? username : "",
    };

    let res: { succeeded: boolean, msg: string };
    if (edit) {
      res = await editWebHookServerAction(body);
    } else {
      res = await createWebHookServerAction(body);
    }

    if (!res.succeeded) {
      toast.error(res.msg);
    } else {
      window.location.href = constants.webhooksPath;
      toast.success(res.msg);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Recap/>
      <AdaptEditor/>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="url">URL du WebHook</label>
        <div className="flex flex-row gap-2 h-fit">
          <input
            id="url"
            value={webHookUrl.slice(0, 60) + "..."}
            className="w-full message-input"
            placeholder={"Ceci ne devrait pas être vide :/"}
            disabled={true}
          />
          <Button onClick={createWebHook} className="h-full">
            {edit ? "Enregister les modifications" : "Créer"}
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
                return <li key={index}>{format}</li>;
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
        <label htmlFor="embed">Contenu du titre{" "}<span
          className={cn("text-gray-500", title.length === 256 && "animate-blink")}>{title.length}/256</span></label>
        <textarea
          className="message-input"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="embed">Contenu de l&apos;embed <span
          className={cn("text-gray-500", embed.length === 4096 && "animate-blink")}>{embed.length}/4096</span></label>
        <textarea
          className="message-input"
          id="embed"
          value={embed}
          onChange={(e) => setEmbed(e.target.value)}
        />
      </div>
    </div>
  );
}

function AdaptEditor() {
  const { currentWebHookType } = useWebhookStore();
  if (currentWebHookType === WebHookType.QDF) {
    return null;
  }
  if (currentWebHookType === WebHookType.statusServer) {
    return null;
  }

  if (currentWebHookType === WebHookType.adminShop) {
    return <AdminShopInput/>;
  }

  if (currentWebHookType === WebHookType.market) {
    return <MarketInput/>;
  }

  if (currentWebHookType === WebHookType.EventPvp) {
    return <EventInput/>;
  }

  if (currentWebHookType === WebHookType.vote) {
    return <VoteInput/>;
  }
  return null;
}

function AdaptEditorFooter() {
  const { currentWebHookType, itemSelected, adminShopItemSelected } = useWebhookStore();
  if (currentWebHookType === WebHookType.QDF) {
    return null;
  }
  if (currentWebHookType === WebHookType.statusServer) {
    return null;
  }

  if (currentWebHookType === WebHookType.adminShop && adminShopItemSelected) {
    return <AdminShopGraph currentItem={adminShopItemSelected}/>;
  }

  if (currentWebHookType === WebHookType.market && itemSelected) {
    return <MarketGraphClient/>;
  }

  if (currentWebHookType === WebHookType.EventPvp) {
    return null;
  }
  return null;
}

function Recap() {
  const { currentWebHookType } = useWebhookStore();
  switch (currentWebHookType) {
  case WebHookType.QDF:
    return <RecapQDF/>;
  case WebHookType.market:
    return <RecapMarket/>;
  case WebHookType.adminShop:
    return <RecapAdminShop/>;
  case WebHookType.EventPvp:
    return <RecapEvent/>;
  case WebHookType.statusServer:
    return <RecapServerStatus/>;
  case WebHookType.vote:
    return <RecapVote/>;
  default:
    return null;
  }
}

function MarketGraphClient() {
  const { itemSelected } = useWebhookStore();
  const [data, setData] = React.useState<AhItemHistory[]>([]);

  useEffect(() => {
    if (!itemSelected) {
      return;
    }
    try {
      getMarketHistoryServerAction(itemSelected.value).then((res) => {
        setData(res);
      });
    } catch (error) {
      console.error(error);
    }
  }, [itemSelected]);

  return (
    <div className="h-[100vh] pb-0">
      <PlotHistoricChart data={data} webhook/>
    </div>
  );
}