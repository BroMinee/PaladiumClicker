"use client";

import React, { useState } from "react";
import {  Trash2,  Edit2, } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { WebHookAlert, WebHookType } from "@/types";
import { useWebhookStore } from "@/stores/use-webhook-store";
import { constants } from "@/lib/constants";
import { getIconNameFromEventType, getTextFromWebHookType, getItemFromName } from "@/lib/misc";

import {  deleteWebhookServerAction } from "@/lib/api/api-server-action.server";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { ConfirmDeleteModal } from "./input.client";
import { Button } from "@/components/ui/button-v2";
import { Card } from "../ui/card";

const AlertStyles = {
  [WebHookType.QDF]: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  [WebHookType.adminShop]: { color: "bg-green-500/10 text-green-400 border-green-500/20" },
  [WebHookType.market]: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  [WebHookType.EventPvp]: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  [WebHookType.statusServer]: { color: "bg-red-500/10 text-red-400 border-red-500/20" },
  [WebHookType.vote]: { color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
};

/**
 * Displays a single alert item with options to edit or delete it.
 * @param alert The webhook alert to display.
 */
export function AlertItem({ alert }: { alert: WebHookAlert }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const {
    setCurrentWebHookType, setWebHookUrl, setUsername, setTitle, setEmbed,
    setItemSelected, setAdminShopItemSelected, setEventSelected, setContent,
    setThresholdCondition, setThreshold, setIdAlert, setEdit
  } = useWebhookStore();

  const style = AlertStyles[alert.type] || AlertStyles[WebHookType.EventPvp];

  const displayTitle = getTextFromWebHookType(alert.type);
  let displayImage = "";

  if (alert.type === WebHookType.adminShop || alert.type === WebHookType.market) {
    if (alert.item) {
      displayImage = `/AH_img/${alert.item.img}`;
    } else {
      displayImage = "/EventIcon/unknown.png";
    }
  } else if (alert.type === WebHookType.EventPvp) {
    if (alert.enumEvent) {
      displayImage = `https://palatracker.bromine.fr${getIconNameFromEventType(alert.enumEvent)}`;
    }
  } else if (alert.type === WebHookType.statusServer) {
    displayImage = "https://palatracker.bromine.fr/EventIcon/status.png";
  } else if (alert.type === WebHookType.QDF) {
    displayImage = "https://palatracker.bromine.fr/EventIcon/qdf.png";
  } else if (alert.type === WebHookType.vote) {
    displayImage = "https://palatracker.bromine.fr/img/MarketUI/pb_icon.png";
  }

  const handleEditAlert = () => {
    setCurrentWebHookType(alert.type);
    setWebHookUrl(alert.webhook.url);
    setUsername(alert.username ?? "");
    if (alert.title) {
      setTitle(alert.title);
    }
    if (alert.embed) {
      setEmbed(alert.embed);
    }
    if (alert.content) {
      setContent(alert.content);
    }

    if (alert.type === WebHookType.market && alert.item) {
      setItemSelected({
        value: alert.item.item_name,
        img: alert.item.img,
        label: alert.item.us_trad,
        label2: alert.item.fr_trad
      });
    }
    if (alert.type === WebHookType.adminShop && alert.item) {
      setAdminShopItemSelected(getItemFromName(alert.item.item_name));
    }
    if ((alert.type === WebHookType.adminShop || alert.type === WebHookType.market)) {
      if (alert.thresholdCondition) {
        setThresholdCondition(alert.thresholdCondition);
      }
      if (alert.threshold) {
        setThreshold(alert.threshold);
      }
    }

    if (alert.type === WebHookType.EventPvp && alert.enumEvent) {
      setEventSelected(alert.enumEvent);
    }

    setIdAlert(alert.id);
    setEdit(true);
    router.push(`${constants.webhooksPath}/edit`);
  };

  const handleDeleteAlert = async () => {
    const res = await deleteWebhookServerAction(alert.id);
    if (res.succeeded) {
      toast.success("Alerte supprimée");
      setIsDeleted(true);
    } else {
      toast.error(res.msg);
    }
    setShowDeleteConfirm(false);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <Card className="group relative flex flex-col sm:flex-row gap-3 bg-[#7d7979] dark:bg-[#232730] p-3 rounded-xl border transition-all">
      <div className="flex-shrink-0 relative items-center flex">
        <div className="w-12 h-12 rounded-lg bg-card overflow-hidden border border-secondary flex items-center justify-center">
          <UnOptimizedImage
            src={displayImage}
            alt={displayTitle}
            width={48}
            height={48}
            unoptimized
            className="w-[75%] h-[75%] object-cover opacity-80 group-hover:opacity-100 transition-opacity pixelated"
          />
        </div>

      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${style.color}`}>
            {displayTitle}
          </span>
        </div>
        <p className="text-xs text-card-foreground line-clamp-2 leading-tight">
          {alert.title}
        </p>
      </div>

      <div className="flex sm:flex-col gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity justify-center sm:border-l sm:border-gray-800 sm:pl-2">
        <Button onClick={handleEditAlert} className="p-1.5 rounded bg-card hover:bg-primary text-card-foreground hover: transition-colors"
          variant="primary"
          size="icon"
        >
          <Edit2 size={14} />
        </Button>
        <Button
          variant="none"
          size="icon"
          onClick={() => setShowDeleteConfirm(true)}
          className="p-1.5 rounded bg-card hover:bg-red-600 text-card-foreground hover: transition-colors"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAlert}
        title="Supprimer l'alerte ?"
        desc="Cette action est irréversible."
      />
    </Card>
  );
}