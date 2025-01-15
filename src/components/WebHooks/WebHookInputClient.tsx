'use client';
import { EventType, OptionType, WebHookType } from "@/types";
import { useEffect, useState } from "react";
import {
  defaultWebHookContentFromType,
  defaultWebHookEmbedFromType, defaultWebhookEmbedImgFromType,
  defaultWebHookFieldsFromType, defaultWebHookTitleFromType, defaultWebhookTitleUrlFromType
} from "@/components/WebHooks/WebHookConstant.ts";
import { GenerateWebHookContent } from "@/components/WebHooks/WebHookMsg.tsx";

export function WebHookInputClientItem({ currentWebHookType }: {
  currentWebHookType: WebHookType
}) {
  const [embed, setEmbed] = useState("");
  const [content, setContent] = useState("");
  const [fields, setFields] = useState<{value: string, name: string, inline?: boolean}[]>([]);
  const [title, setTitle] = useState("");
  const [titleUrl, setTitleUrl] = useState("");
  const [embedImg, setEmbedImg] = useState("");
  const [itemSelected, setItemSelected] = useState<OptionType | null>({value: "test", label: "testUs", img: "https://palatracker.bromine.fr/AH_img/endium_sword.png", label2: "testFr"});
  const [eventSelected, setEventSelected] = useState<EventType>("BOSS");

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
      <WebHookEditor content={content} embed={embed} currentWebHookType={currentWebHookType} setEmbed={setEmbed}
                     setContent={setContent}/>
      {/*<WebHookRender content={content} embed={embed} currentWebHookType={currentWebHookType}/>*/}
      <GenerateWebHookContent content={content} embed={embed} title={title} titleUrl={titleUrl} fields={fields} embedImg={embedImg} currentWebHookType={currentWebHookType} itemSelected={itemSelected} eventSelected={eventSelected}/>
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