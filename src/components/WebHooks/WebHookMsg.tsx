import "./WebHookMsg.css";
import { EventType, OptionType, StatusType, WebHookType } from "@/types";
import { defaultWebhookFooterFromType } from "@/components/WebHooks/WebHookConstant.ts";
import { formatPrice } from "@/lib/misc.ts";


export function GenerateEmbedPreview(titleEmbed: string,
                                     titleUrl: string,
                                     content: string,
                                     embed: string,
                                     footer: string,
                                     fields: {
                                       name: string,
                                       value: string,
                                       inline?: boolean
                                     }[],
                                     embedImg: string,
                                     itemSelected: OptionType | null,
                                     eventSelected: EventType) {

  const embedNode = GenerateEmbedDescription(embed, footer, fields, embedImg, itemSelected, eventSelected);

  return (
    <div className="embed"
      // style={{ background: "yellow" }}
    >
      {itemSelected && <div className="top-right">
        <img src={`https://palatracker.bromine.fr/AH_img/${itemSelected.img}`} alt="icon"/>
      </div>
      }
      <div className="embed-header">
        <a href={parseUrlFormatting(titleUrl, itemSelected, eventSelected)} target="_blank" className="embed-title">
          {parseTextFormatting(titleEmbed, itemSelected, eventSelected)}
        </a>
      </div>
      {embedNode}
    </div>
  );
}

export function parseTextFormatting(
  text: string,
  itemSelected: OptionType | null,
  eventSelected: EventType
): JSX.Element {
  const parts = text.split(
    /(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~|{here}|{item}|{itemFr}|{itemUs}|{event}|{price}|{previousPrice}|{quantityAvailable}|{quantity}|{earningXp}|{earningMoney}|{start}|{end}|{startRelative}|{rewardElo}|{servers}|{server})/g
  );

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{parseTextFormatting(part.slice(2, -2), itemSelected, eventSelected)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={index}>{parseTextFormatting(part.slice(1, -1), itemSelected, eventSelected)}</em>;
        }
        if (part.startsWith("__") && part.endsWith("__")) {
          return <u key={index}>{parseTextFormatting(part.slice(2, -2), itemSelected, eventSelected)}</u>;
        }
        if (part.startsWith("~~") && part.endsWith("~~")) {
          return <s key={index}>{parseTextFormatting(part.slice(2, -2), itemSelected, eventSelected)}</s>;
        }
        if (part === "{here}") {
          return (
            <span key={index} className="mention-here">
              @here
            </span>
          );
        }
        if (part === "{item}") {
          return (
            <span key={index}>
              {itemSelected?.value || "undefined"}
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
          return <span key={index}>{formatPrice(10000)}</span>;
        }
        if (part === "{previousPrice}") {
          return <span key={index}>{formatPrice(4999)}</span>;
        }
        if (part === "{quantityAvailable}") {
          return <span key={index}>{16}</span>;
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
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function parseUrlFormatting(
  url: string,
  itemSelected: OptionType | null,
  event: EventType
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

  let result = url.replaceAll("{item}", itemSelected?.value || "undefined");
  result = result.replaceAll("{quantity}", "10000");
  result = result.replaceAll("{event}", eventTypeToImgName(event));
  return result;
}

function GenerateEmbedDescription(embed: string, footer: string, fields: {
  name: string,
  value: string,
  inline?: boolean,
}[], embedImg: string, itemSelected: OptionType | null, eventSelected: EventType): JSX.Element {
  return (
    <div className="embed-description">
      <p>{parseTextFormatting(embed, itemSelected, eventSelected)}</p>
      {fields.map((field, index) => (
        <div key={index} className={`embed-field ${field.inline ? "inline" : ""}`}>
          <p className="embed-field-name">{parseTextFormatting(field.name, itemSelected, eventSelected)}</p>
          <p className="embed-field-value">{parseTextFormatting(field.value, itemSelected, eventSelected)}</p>
        </div>
      ))}
      {embedImg && <img src={parseUrlFormatting(embedImg, itemSelected, eventSelected)} alt="Embed Image"
                        className="embed-image"/>}
      <p>Plus d'informations sur le site <a href="https://palatracker.bromine.fr/webhooks"
                                            target="_blank">palatracker</a>.</p>
      <div className="embed-footer">
        <img className="footer-icon"
             src="https://palatracker.bromine.fr/favicon.png"
             width={16}
             height={16}
             alt=""/>
        <span suppressHydrationWarning>{footer} • {new Date().toLocaleString()}</span>
      </div>
    </div>
  );
}

function getStatusText(status: StatusType) {
  switch (status) {
    case "online":
    case "running":
    case "whitelist":
      return ":notepad_spiral: Sous whitelist";
    case "restart":
      return "";
    case "offline":
      return "";
    case "starting":
      return
    case "stopping":
      return "";
    case "unknown":
      return "";
  }
}

export function GenerateWebHookContent({
                                         content,
                                         embed,
                                         title,
                                         titleUrl,
                                         fields,
                                         embedImg,
                                         currentWebHookType,
                                         itemSelected,
                                         eventSelected
                                       }: {
  content: string,
  embed: string,
  title: string,
  titleUrl: string,
  fields: { name: string, value: string, inline?: boolean }[],
  embedImg: string,
  currentWebHookType: WebHookType,
  itemSelected: OptionType | null,
  eventSelected: EventType
}) {

  const embedNode = GenerateEmbedPreview(title, titleUrl, content, embed, defaultWebhookFooterFromType[currentWebHookType], fields, embedImg, itemSelected, eventSelected);
  return (
    <div>
      <div className="alert-container">
        <div className="header">
          <img className="avatar"
               src="https://cdn.discordapp.com/avatars/1326985714629345311/df9807160558a49c4aa45eab94230471.webp?size=80"
               alt=""/>
          <div className="header-text">
            <span className="title">PalaTracker Alert</span>
            <span className="app-badge">APP</span>
            <time className="timestamp" dateTime="2025-01-13T18:54:47.235Z" suppressHydrationWarning>{new Date().toLocaleString()}</time>
          </div>
        </div>
        <div className="message-content">
          <p>{parseTextFormatting(content, itemSelected, eventSelected)}</p>
        </div>
        {embedNode}
      </div>
    </div>);
}