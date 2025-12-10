"use client";

import { deleteWebhookGuildServerAction, editWebhookGuildNameServerAction } from "@/lib/api/apiServerAction";
import { GroupedServer } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ChevronDown, Edit2, Save, Server, Trash2 } from "lucide-react";
import { WebhookChannelCard } from "./webhook-channel.client";
import { ConfirmDeleteModal } from "./input.client";
import { Button } from "../ui/button-v2";

/**
 * Displays a server section with its channels and alerts.
 * @param server The grouped server data.
 */
export function WebhookServerSection({ server }: { server: GroupedServer }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [serverName, setServerName] = useState(server.serverName);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    setServerName(server.serverName);
  }, [server.serverName]);

  const showWarning = serverName.startsWith("server-");

  const handleSaveName = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const channelIdTarget = server.channels[0]?.channelId ?? "";

    if (serverName === server.serverName) {
      setIsEditing(false);
      return;
    }

    const res = await editWebhookGuildNameServerAction(server.serverId, channelIdTarget, serverName);
    if (res.succeeded) {
      toast.success("Nom du serveur mis à jour");
      setIsEditing(false);
    } else {
      toast.error(res.msg);
    }
  };

  const handleDeleteServer = async () => {
    const res = await deleteWebhookGuildServerAction(server.serverId);
    if (res.succeeded) {
      toast.success("Serveur et alertes supprimés");
      setIsDeleted(true);
    } else {
      toast.error(res.msg);
    }
    setShowDeleteConfirm(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName(e as unknown as React.MouseEvent);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <Card className="space-y-4 dark:bg-[#1a1d24]">
      <div className="flex items-center justify-between pr-2">
        <div
          onClick={() => !isEditing && setIsOpen(!isOpen)}
          className="flex items-center gap-3 text-xl font-bold text-blue-400 cursor-pointer select-none group flex-1"
        >
          <div className="p-1 rounded-md bg-blue-500/10">
            <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}/>
          </div>

          <div className='flex flex-col'>
            <div className="flex items-center gap-2">
              <Server size={20} />
              {isEditing ? (
                <input
                  autoFocus
                  value={serverName}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setServerName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-gray-800 text-white px-2 py-1 rounded border border-indigo-500 outline-none text-base w-full md:w-auto"
                />
              ) : (
                <h3>{serverName}</h3>
              )}

              {!isEditing && showWarning && (
                <div className="text-yellow-500" title="Ce nom semble être un nom par défaut. Pensez à le renommer.">
                  <AlertTriangle size={18} />
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-600 font-mono">
              Serveur id: {server.serverId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <Button onClick={handleSaveName} className="p-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors">
              <Save size={18} />
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="p-2 hover:bg-gray-800 text-gray-400 rounded transition-colors">
              <Edit2 size={16} />
            </Button>
          )}
          <Button onClick={() => setShowDeleteConfirm(true)} className="p-2 hover:bg-red-900/20 text-gray-400 hover:text-red-400 rounded transition-colors">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 m-0"}`}>
        <div className="overflow-hidden">
          <div className="space-y-6 pl-2 md:pl-4 border-l-2 border-gray-800 ml-3 md:ml-3.5 py-2">
            {server.channels.map((channel) => (
              <WebhookChannelCard
                key={channel.channelId}
                serverId={server.serverId}
                channel={channel}
              />
            ))}
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteServer}
        title="Supprimer le serveur ?"
        desc="Toutes les alertes associées à ce serveur seront définitivement supprimées."
      />
    </Card>
  );
}