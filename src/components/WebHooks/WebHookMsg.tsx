import "./WebHookMsg.css";
import { AdminShopItem, EventType, OptionType, WebHookThresholdCondition, WebHookType } from "@/types";
import { defaultWebhookFooterFromType } from "@/components/WebHooks/WebHookConstant.ts";
import {
  adminShopItemToUserFriendlyText,
  formatPrice,
  getIconNameFromEventType,
  getImagePathFromAdminShopType
} from "@/lib/misc.ts";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import React from "react";
import Image from "next/image";


export function GenerateEmbedPreview(footer: string) {

  const {
    title,
    titleUrl,
    itemSelected,
    eventSelected,
    currentWebHookType,
    adminShopItemSelected,
    threshold,
    thresholdCondition
  } = useWebhookStore();

  const embedNode = GenerateEmbedDescription(footer);

  return (
    <div className="embed"
      // style={{ background: "yellow" }}
    >
      {itemSelected && (currentWebHookType === WebHookType.market || currentWebHookType === WebHookType.QDF) &&
        <div className="top-right">
          <Image src={`https://palatracker.bromine.fr/AH_img/${itemSelected.img}`} alt="icon" height={24} width={24}
                 unoptimized/>
        </div>
      }
      {currentWebHookType === WebHookType.EventPvp && <div className="top-right">
        <Image src={`https://palatracker.bromine.fr/${getIconNameFromEventType(eventSelected)}`} alt="icon" height={24}
               width={24} unoptimized/>
      </div>
      }
      {adminShopItemSelected && currentWebHookType === WebHookType.adminShop && <div className="top-right">
        <Image src={`https://palatracker.bromine.fr/${getImagePathFromAdminShopType(adminShopItemSelected)}`} alt="icon"
               height={24} width={24} unoptimized/>
      </div>
      }
      <div className="embed-header">
        <a href={parseUrlFormatting(titleUrl, itemSelected, eventSelected, adminShopItemSelected, threshold)}
           target="_blank" className="embed-title">
          {parseTextFormatting(title, itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}
        </a>
      </div>
      {embedNode}
    </div>
  );
}

export function parseTextFormatting(
  text: string,
  itemSelected: OptionType | null,
  eventSelected: EventType,
  currentWebHookType: WebHookType,
  adminShopItemSelected: AdminShopItem | null,
  threshold: number,
  thresholdCondition: WebHookThresholdCondition
): React.JSX.Element {
  const parts = text.split(
    /(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~|{here}|{item}|{itemFr}|{itemUs}|{event}|{price}|{previousPrice}|{quantityAvailable}|{quantity}|{earningXp}|{earningMoney}|{seller}|{start}|{end}|{startRelative}|{rewardElo}|{servers}|{server}|{thresholdCondition}|{goal}|\n|<@&[^>]*>|<@[^>]*>|{TODO}|{username})/g
  );

  function getTextFromThresholdCondition(thresholdCondition: WebHookThresholdCondition) {
    switch (thresholdCondition) {
      case "aboveThreshold":
        return "supérieur";
      case "aboveQuantity":
        return "supérieur ou égal (en quantité)";
      case "underThreshold":
        return "inférieur";
      case "increasingAboveThreshold":
        return "en hausse et supérieur";
      case "decreaseAboveThreshold":
        return "en baisse et supérieur";
      case "decreasing":
        return "en baisse";
      case "increasing":
        return "en hausse";
      default:
        return "Bonne question j'ai pas prévu ce cas";
    }
  }

  function getTodoCount(): string | number {
    switch (currentWebHookType) {
      case WebHookType.market:
        return -1;
      case WebHookType.QDF:
        return 1;
      case WebHookType.adminShop:
        return -1;
      case WebHookType.EventPvp:
        switch (eventSelected) {
          case "BOSS":
            return 4 * 7;
          case "A VOS MARQUES":
            return 7;
          case "TOTEM":
            return 1;
          case "EGGHUNT":
            return 7;
          case "KOTH":
            return 1;
          case "BLACKMARKET":
            return 3 * 7;
          default:
            return -1;
        }

      case WebHookType.statusServer:
        return "0 ou 2";
      default:
        return -1;
    }
  }

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong
            key={index}>{parseTextFormatting(part.slice(2, -2), itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em
            key={index}>{parseTextFormatting(part.slice(1, -1), itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}</em>;
        }
        if (part.startsWith("__") && part.endsWith("__")) {
          return <u
            key={index}>{parseTextFormatting(part.slice(2, -2), itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}</u>;
        }
        if (part.startsWith("~~") && part.endsWith("~~")) {
          return <s
            key={index}>{parseTextFormatting(part.slice(2, -2), itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}</s>;
        }
        if (part === "{here}") {
          return (
            <span key={index} className="mention-here">
              @here
            </span>
          );
        }
        if (part === "{item}" && (currentWebHookType === WebHookType.market || currentWebHookType === WebHookType.QDF || (currentWebHookType === WebHookType.EventPvp && eventSelected === "A VOS MARQUES"))) {
          return (
            <span key={index}>
              {itemSelected?.value || "undefined"}
            </span>
          );
        }
        if (part === "{item}" && currentWebHookType === WebHookType.adminShop) {
          return (
            <span key={index}>
              {adminShopItemSelected ? adminShopItemToUserFriendlyText(adminShopItemSelected) : "undefined"}
            </span>
          );
        }
        if (part === "{itemFr}") {
          return (
            <span key={index}>
              {itemSelected?.label || "undefined"}
            </span>
          );
        }
        if (part === "{itemUs}") {
          return (
            <span key={index}>
              {itemSelected?.label2 || "undefined"}
            </span>
          );
        }
        if (part === "{event}") {
          return (
            <span key={index}>
              {eventSelected}
            </span>
          );
        }
        if (part === "{price}") {
          return <span key={index}>{formatPrice(threshold)}</span>;
        }
        if (part === "{previousPrice}") {
          let oldPrice = threshold;
          if (thresholdCondition === "increasing" || thresholdCondition === "increasingAboveThreshold" || thresholdCondition === "aboveThreshold") {
            oldPrice -= 1;
          } else
            oldPrice += 1;
          return <span key={index}>{formatPrice(oldPrice)}</span>;
        }
        if (part === "{quantityAvailable}") {
          return <span key={index}>{Math.floor(Math.random() * 1000)}</span>;
        }
        if (part === "{quantity}") {
          return <span key={index}>{formatPrice(10000)}</span>;
        }
        if (part === "{earningXp}") {
          return <span key={index}>{formatPrice(1250000)}</span>;
        }
        if (part === "{earningMoney}") {
          return <span key={index}>{formatPrice(200000)}</span>;
        }
        if(part === "{seller}" && currentWebHookType === WebHookType.market) {
          return <span key={index}>LeVraiFuze</span>;
        }
        if (part === "{start}") {
          return <span key={index}>{new Date().toLocaleString()}</span>;
        }
        if (part === "{end}") {
          return <span key={index}>{new Date(new Date().getTime() + 60 * 60 * 1000).toLocaleString()}</span>;
        }
        if (part === "{startRelative}") {
          return <span key={index}>dans 42 minutes</span>;
        }
        if (part === "{rewardElo}") {
          return <span key={index}>{formatPrice(7)}</span>;
        }
        if (part === "{servers}") {
          return <span key={index}>Paladium, Aeloria, Egopolis</span>;
        }
        if (part === "{server}") {
          return <span key={index}>Minage</span>;
        }
        if (part === "{goal}") {
          return <span key={index}>fondre</span>;
        }
        if (part === "{thresholdCondition}") {
          return <span key={index}>{getTextFromThresholdCondition(thresholdCondition)}</span>;
        }
        if (part === "\n") {
          return <br key={index}/>;
        }
        if (part.startsWith("<@&") && part.endsWith(">")) {
          return <span key={index} className="mention-here">
              @role
            </span>;
        }
        if (part.startsWith("<@") && part.endsWith(">")) {
          return <span key={index} className="mention-here">
              @user
            </span>;
        }
        if (part === "{TODO}") {
          return <span key={index}>{getTodoCount()}</span>;
        }
        if (part === "{username}") {
          return <span key={index}>LeVraiFuze</span>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function parseUrlFormatting(
  url: string,
  itemSelected: OptionType | null,
  event: EventType,
  adminShopItemSelected: AdminShopItem | null,
  threshold: number
): string {

  function eventTypeToImgName(event: EventType) {
    switch (event) {
      case "BOSS":
        return "boss";
      case "TOTEM":
        return "totem";
      case "EGGHUNT":
        return "egg";
      case "A VOS MARQUES":
        return "avm";
      case "KOTH":
        return "koth";
      case "BLACKMARKET":
        return "blackmarket";
      default:
        return "undefined";
    }
  }

  const itemName = itemSelected ? (itemSelected.value || "undefined") : (adminShopItemSelected ? adminShopItemToUserFriendlyText(adminShopItemSelected) : "undefined");

  let result = url.replaceAll("{item}", itemName);
  result = result.replaceAll("{quantity}", threshold.toString());
  result = result.replaceAll("{event}", eventTypeToImgName(event));
  return result;
}

function GenerateEmbedDescription(footer: string): React.JSX.Element {
  const {
    embed,
    fields,
    embedImg,
    itemSelected,
    eventSelected,
    currentWebHookType,
    adminShopItemSelected,
    threshold,
    thresholdCondition
  } = useWebhookStore();

  return (
    <div className="embed-description">
      <p>{parseTextFormatting(embed, itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}</p>
      {fields.map((field, index) => (
        <div key={index} className={`embed-field ${field.inline ? "inline" : ""}`}>
          <p
            className="embed-field-name">{parseTextFormatting(field.name, itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}</p>
          <p
            className="embed-field-value">{parseTextFormatting(field.value, itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}</p>
        </div>
      ))}
      <br/>
      <p>Plus d&apos;informations sur le site <a href="https://palatracker.bromine.fr/webhook"
                                                 target="_blank">palatracker</a>.</p>
      {embedImg &&
        <Image src={parseUrlFormatting(embedImg, itemSelected, eventSelected, adminShopItemSelected, threshold)}
               alt="Embed Image"
               width={0}
               height={0}
               sizes="100vw"
               style={{ width: '100%', height: 'auto' }}
               className="embed-image" unoptimized/>}
      <div className="embed-footer">
        <Image className="footer-icon"
               src="https://palatracker.bromine.fr/favicon.png"
               width={16}
               height={16}

               alt="" unoptimized/>
        <span suppressHydrationWarning>{footer} • {new Date().toLocaleString()}</span>
      </div>
    </div>
  );
}

export function GenerateWebHookContent() {
  const {
    content,
    itemSelected,
    eventSelected,
    currentWebHookType,
    adminShopItemSelected,
    threshold,
    thresholdCondition
  } = useWebhookStore();
  const embedNode = GenerateEmbedPreview(defaultWebhookFooterFromType[currentWebHookType]);
  return (
    <div>
      <div className="alert-container  !border-0">
        <div className="alert-header">
          <Image className="avatar"
                 height={40}
                 width={40}
                 src="https://palatracker.bromine.fr/stonks_clic.png"
                 alt="" unoptimized/>
          <div className="header-text">
            <span className="title">PalaTracker Alert</span>
            <span className="app-badge">APP</span>
            <time className="timestamp" dateTime="2025-01-13T18:54:47.235Z"
                  suppressHydrationWarning>{new Date().toLocaleString()}</time>
          </div>
        </div>
        <div className="message-content">
          <p>{parseTextFormatting(content, itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}</p>
        </div>
        {embedNode}
      </div>
    </div>);
}