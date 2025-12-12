
import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Hash,
  Edit2,
  ChevronDown,
  Save,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { GroupedChannel } from "@/types";
import { useWebhookStore } from "@/stores/use-webhook-store";
import { constants } from "@/lib/constants";

import {
  deleteWebhookChannelServerAction,
  editWebhookChannelNameServerAction,
} from "@/lib/api/apiServerAction";
import { AlertItem } from "./alert-card.client";
import { ConfirmDeleteModal } from "./input.client";
import { Button } from "@/components/ui/button-v2";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

/**
 * Displays all webhook associated to a channel.
 * @param channel The grouped channel data.
 * @param serverId The ID of the server the channel belongs to.
 */
export function WebhookChannelCard({ channel, serverId }: { channel: GroupedChannel, serverId: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [channelName, setChannelName] = useState(channel.channelName);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const router = useRouter();
  const { setWebHookUrl, setEdit } = useWebhookStore();

  const showWarning = channelName.startsWith("channel-");

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  const handleSaveName = async (e: React.MouseEvent) => {
    stopProp(e);

    if (channelName === channel.channelName) {
      setIsEditing(false);
      return;
    }

    const res = await editWebhookChannelNameServerAction(serverId, channel.channelId, channelName);
    if (res.succeeded) {
      toast.success("Nom du channel mis à jour");
      setIsEditing(false);
    } else {
      toast.error(res.msg);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName(e as unknown as React.MouseEvent);
    }
  };

  const handleDeleteChannel = async () => {
    const res = await deleteWebhookChannelServerAction(serverId, channel.channelId);
    if (res.succeeded) {
      toast.success("Canal supprimé");
      setIsDeleted(true);
    } else {
      toast.error(res.msg);
    }
    setShowDeleteConfirm(false);
  };

  const handleCreateAlert = (e: React.MouseEvent) => {
    stopProp(e);
    if (!channel.discordData) {
      toast.error("Impossible de récupérer l'URL du webhook pour ce canal.");
      return;
    }
    setWebHookUrl(channel.discordData.url);
    setEdit(false);
    router.push(`${constants.webhooksPath}/create`);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <Card className="overflow-hidden bg-transparent">
      <div
        onClick={() => !isEditing && setIsOpen(!isOpen)}
        className={cn("bg-[#7d7979] dark:bg-[#232730] rounded-t-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between cursor-pointer hover:bg-[#8f8d8d] dark:hover:bg-[#2a2e38] transition-colors", isOpen ? "rounded-b-none" : "rounded-b-xl")}
      >
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}
          />

          <div className="flex items-center gap-2 font-semibold text-lg">
            <Hash size={18} className="text-primary flex-shrink-0" />

            {isEditing ? (
              <input
                autoFocus
                value={channelName}
                onClick={stopProp}
                onChange={(e) => setChannelName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-card px-2 py-1 rounded border border-indigo-500 outline-none text-base w-full md:w-64"
              />
            ) : (
              <span>{channelName}</span>
            )}

            {!isEditing && showWarning && (
              <div className="text-yellow-500" title="Ce nom semble être un nom par défaut. Pensez à le renommer.">
                <AlertTriangle size={16} />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center gap-4 ml-auto md:ml-0">
          <div className="flex items-center gap-1" onClick={stopProp}>
            {isEditing ? (
              <Button
                onClick={handleSaveName}
                className="p-1.5 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
                variant="none"
                size="icon">
                <Save size={16} />
              </Button>
            ) : (

              <Button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-card-foreground rounded transition-colors hover:bg-primary"
                variant="none"
                size="icon"
              >
                <Edit2 size={14} />
              </Button>
            )}
            <Button
              variant="none"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 hover:bg-red-900/20 text-card-foreground hover:text-red-400 rounded transition-colors"
            >
              <Trash2 size={14} />
            </Button>
          </div>

          <div className="h-4 w-px bg-secondary mx-1 hidden md:block"></div>

          <div className="flex flex-col items-end gap-1">
            <Button
              variant="primary"
              onClick={handleCreateAlert}
              className="flex items-center gap-2 font-bold px-3 py-1.5 border-none rounded-lg "
            >
              <Plus size={14} />
              Ajouter
            </Button>
            <div className="text-[10px] md:block">
              {isOpen ? `Channel id: ${channel.channelId}` : `${channel.alerts.length} alertes`}
            </div>
          </div>
        </div>
      </div>

      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#6b6a6a] dark:bg-[#16181d] rounded-b-xl">
            {channel.alerts.sort((a, b) => a.type.localeCompare(b.type)).map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteChannel}
        title="Supprimer le canal ?"
        desc="Toutes les alertes associées à ce canal seront définitivement supprimées."
      />
    </Card>
  );
}