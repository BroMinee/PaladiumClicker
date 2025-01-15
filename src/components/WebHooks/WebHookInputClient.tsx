'use client';
import { AdminShopItem, WebHookType } from "@/types";
import { useEffect, useState } from "react";
import { defaultWebHookContentFromType, defaultWebHookEmbedFromType } from "@/components/WebHooks/WebHookConstant.ts";
import { adminShopItemToUserFriendlyText } from "@/lib/misc.ts";

export function WebHookInputClientItem({ currentWebHookType }: {
  currentWebHookType: WebHookType
}) {
  const [embed, setEmbed] = useState("");
  const [content, setContent] = useState("");


  useEffect(() => {
    setContent(defaultWebHookContentFromType[currentWebHookType]);
    setEmbed(defaultWebHookEmbedFromType[currentWebHookType])
  }, [currentWebHookType]);

  return (
    <div className="flex flex-row gap-2 justify-between items-center">
      <WebHookEditor content={content} embed={embed} currentWebHookType={currentWebHookType} setEmbed={setEmbed}
                     setContent={setContent}/>
      <WebHookRender content={content} embed={embed} currentWebHookType={currentWebHookType}/>
    </div>
  )
}

function WebHookEditor({ content, embed, currentWebHookType, setContent, setEmbed }: {
  content: string,
  embed: string,
  currentWebHookType: WebHookType,
  setContent: (content: string) => void,
  setEmbed: (embed: string) => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          className="w-96"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="embed">Embed</label>
        <textarea
          id="embed"
          value={embed}
          onChange={(e) => setEmbed(e.target.value)}
        />
      </div>
    </div>
  )
}

function WebHookRender({ currentWebHookType, embed, content }: {
  currentWebHookType: WebHookType,
  embed: string,
  content: string
}) {
  const [contentDisplay, setContentDisplay] = useState("");
  const [embedDisplay, setEmbedDisplay] = useState("");

  useEffect(() => {
    console.log(currentWebHookType);
    formatContent(content, currentWebHookType, null).then((content) => setContentDisplay(content))
    formatContent(embed, currentWebHookType, null).then((embed) => setEmbedDisplay(embed))
  }, [content, embed, currentWebHookType]);

  return (
    <div>
      <div>
        {contentDisplay}
      </div>
      <div>
        {embedDisplay}
      </div>
    </div>
  )
}

async function formatContent(content: string, currentWebHookType: WebHookType, itemName: AdminShopItem | null) {
// TODO remove | null on itemName
  function formatQDF(content: string) {
    return content;
  }

  function formatAdminShop(content: string, itemName: AdminShopItem) {
    console.log(content);
    let res = content.replaceAll("{item}", adminShopItemToUserFriendlyText(itemName));
    res = res.replaceAll("{price}", 0.5.toString());
    res = res.replaceAll("{here}", "@here");
    res = res.replaceAll("{previousPrice}", 0.4.toString());
    return res;
  }

  async function formatMarket(content: string) {
    return content;
  }

  function formatEvent(content: string) {
    return content;
  }

  function formatServeurStatus(content: string) {
    return content;
  }


  switch (currentWebHookType) {
    case WebHookType.QDF:
      return formatQDF(content);
    case WebHookType.AdminShop:
      return formatAdminShop(content, itemName || "feather");
    case WebHookType.Market:
      return formatMarket(content);
    case WebHookType.Event:
      return formatEvent(content);
    case WebHookType.ServeurStatus:
      return formatServeurStatus(content);
    default:
      return content;
  }
}