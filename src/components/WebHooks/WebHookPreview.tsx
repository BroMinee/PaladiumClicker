'use client'; // TODO remove this
import { WebHookAlert, WebHookType } from "@/types";
import './WebHookMsg.css';
import { getIconNameFromEventType, getTextFromWebHookType } from "@/lib/misc.ts";
import { Button } from "@/components/ui/button.tsx";
import { FiEdit } from "react-icons/fi";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils.ts";
import { FaTrashCan } from "react-icons/fa6";

export function WebHookPreview({ webHookAlert }: { webHookAlert: WebHookAlert }) {

  const displayIcon = (webHookAlert.type === WebHookType.market || webHookAlert.type === WebHookType.adminShop) || (webHookAlert.type === WebHookType.EventPvp && webHookAlert.enumEvent)

  return (
    <div className="alert-container w-full !border-0">
      <div className={cn("header-text flex flex-row !justify-start", !displayIcon && "ml-[32px]")}>
        {(webHookAlert.type === WebHookType.market || webHookAlert.type === WebHookType.adminShop) && webHookAlert.item &&
          <Image src={`/AH_img/${webHookAlert.item.img}`} className="object-cover pixelated" alt="item icon" width={32}
                 height={32} unoptimized/>
        }
        {webHookAlert.type === WebHookType.EventPvp && webHookAlert.enumEvent &&
          <Image src={`https://palatracker.bromine.fr/${getIconNameFromEventType(webHookAlert.enumEvent)}`} alt="icon"
                 height={32} width={32} unoptimized/>
        }
        <span className="app-badge">{getTextFromWebHookType(webHookAlert.type)}</span>
        <span className="title">{webHookAlert.title}</span>
        <Button size="icon" onClick={() => alert("TODO")}>
          <FiEdit/>
        </Button>
        <Button size="icon" className="bg-red-600" onClick={() => alert("TODO delete")}>
          <FaTrashCan/>
        </Button>
      </div>
      <span className="embed-footer">
        Serveur id: {webHookAlert.webhook.guild_id} • Channel id: {webHookAlert.webhook.channel_id}
      </span>

    </div>
  );
}