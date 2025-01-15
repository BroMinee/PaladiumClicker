import { WebHookType } from "@/types";

export const defaultWebHookContentFromType : Record<WebHookType, string> = {
  [WebHookType.QDF]: "",
  [WebHookType.AdminShop]: "C'est le moment de vendre {item}.",
  [WebHookType.Market]: "",
  [WebHookType.Event]: "",
  [WebHookType.ServeurStatus]: "",
}

export const defaultWebHookEmbedFromType : Record<WebHookType, string> = {
  [WebHookType.QDF]: "",
  [WebHookType.AdminShop]: "Le prix des {item} sont en train de varier, ils sont maintenant à **{price}**$ donc **{previousPrice}**$ avant.",
  [WebHookType.Market]: "",
  [WebHookType.Event]: "",
  [WebHookType.ServeurStatus]: "",
}