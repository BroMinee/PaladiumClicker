import { EventType, WebHookType } from "@/types";

export function getTextFromWebHookType(webHookType: WebHookType) {
  switch (webHookType) {
  case WebHookType.QDF:
    return "QDF";
  case WebHookType.adminShop:
    return "AdminShop";
  case WebHookType.market:
    return "Market";
  case WebHookType.EventPvp:
    return "Event";
  case WebHookType.statusServer:
    return "Status serveur";
  case WebHookType.vote:
    return "Vote";
  default:
    return `Unknown WebHookType ${webHookType}`;
  }
}

export function getIconNameFromEventType(eventType: EventType) {
  switch (eventType) {
  case "A VOS MARQUES":
    return "/EventIcon/a_vos_marques.png";
  case "BOSS":
    return "/EventIcon/boss.png";
  case "BLACKMARKET":
    return "/EventIcon/blackmarket.png";
  case "EGGHUNT":
    return "/EventIcon/egghunt.png";
  case "KOTH":
    return "/EventIcon/koth.png";
  case "TOTEM":
    return "/EventIcon/totem.png";
  default:
    return "/EventIcon/unknown.png";
  }
}
