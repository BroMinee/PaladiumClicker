"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { FaSave } from "react-icons/fa";
import {
  deleteWebhookChannelServerAction,
  deleteWebhookGuildServerAction,
  editWebhookChannelNameServerAction,
  editWebhookGuildNameServerAction
} from "@/lib/api/apiServerAction.ts";
import { toast } from "sonner";
import { FaTrashCan } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { IoIosWarning } from "react-icons/io";
import HoverText from "@/components/ui/hovertext.tsx";

export function DisplayServerBox({ guildId, channelId, guildIdToServerName, children }:
                                   {
                                     guildId: string,
                                     channelId: string,
                                     guildIdToServerName: Record<string, string>,
                                     children: React.ReactNode
                                   }) {

  const [defaultName, setDefaultName] = React.useState<string>("");
  const [guildName, setGuildName] = React.useState<string>("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleted, setDeleted] = React.useState<boolean>(false);

  useEffect(() => {
    setDefaultName(guildIdToServerName[guildId]);
    setGuildName(guildIdToServerName[guildId]);
  }, [guildId, guildIdToServerName]);

  async function handleEdit() {
    const res = await editWebhookGuildNameServerAction(guildId, channelId, guildName);
    console.log(res);
    if (res.succeeded) {
      setDefaultName(guildName);
      toast.success(res.msg);
    } else {
      toast.error(res.msg);
    }
  }

  async function handleDelete() {
    const res = await deleteWebhookGuildServerAction(guildId);
    if (!res.succeeded) {
      toast.error(res.msg);
    } else {
      setDeleted(true);
      toast.success(res.msg);
    }
  }

  const handleCancelReplacement = () => {
    setIsPopupOpen(false);
    toast.success("Suppression annulée");
  };

  if (deleted) {
    return null;
  }

  const hoverElement: ReactNode = (
    <p className="flex flex-col items-center justify-center border-black border-2 rounded-xl p-2 bg-primary">
      Renomme le serveur pour plus de clarté
    </p>
  );

  return (<div className="px-4 border-2 py-2 border-secondary-foreground rounded-xl">
    <div>
      <div className="flex flex-row gap-2 pb-2 items-center">
        <h2 className="font-bold text-xl">Serveur:</h2>
        <div className="flex flex-row gap-2">
          <input
            id="server_name"
            type="text"
            className="text-left pl-2 rounded-sm font-bold text-sm flex items-center justify-center w-fit [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={guildName}
            onChange={(e) => setGuildName(e.target.value)}
          />
          {guildName !== defaultName && <Button size="icon" onClick={handleEdit}><FaSave size={18}/></Button>}
          {defaultName.startsWith("server-") &&
            <HoverText text={hoverElement} className="rounded-sm h-9 w-9 bg-yellow-600">
              <IoIosWarning size="icon"/>
            </HoverText>
          }
          <Button size="icon" className="bg-red-600" onClick={() => setIsPopupOpen(true)}>
            <FaTrashCan/>
          </Button>
          <Dialog open={isPopupOpen} onOpenChange={handleCancelReplacement}>
            <DialogContent className="px-0 pb-0 max-w-4xl justify-items-center">
              <DialogHeader className="px-6">
                <DialogTitle className="text-primary">Confirmer la suppression</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-fit h-max-[80dvh] px-6 border-t">
                Etes vous sûr de vouloir supprimer toutes les notifications associés à ce serveur ?
                Aucun retour possible.
              </ScrollArea>
              <div className="flex flex-row gap-2 pb-2">
                <Button onClick={() => handleDelete()} className="bg-green-500">Oui</Button>
                <Button onClick={handleCancelReplacement} className="bg-red-500">Non</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {children}
    </div>
  </div>);
}

export function DisplayChannelBox({ channelId, channelIdToChannelName, guildId, children }: {
  channelId: string,
  guildId: string,
  channelIdToChannelName: Record<string, string>,
  children: React.ReactNode
}) {
  const [defaultName, setDefaultName] = React.useState<string>("");
  const [channelName, setChannelName] = React.useState<string>("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleted, setDeleted] = React.useState<boolean>(false);

  useEffect(() => {
    setDefaultName(channelIdToChannelName[channelId]);
    setChannelName(channelIdToChannelName[channelId]);
  }, [channelId, channelIdToChannelName]);

  async function handleEdit() {
    const res = await editWebhookChannelNameServerAction(guildId, channelId, channelName);
    console.log(res);
    if (res.succeeded) {
      setDefaultName(channelName);
      toast.success(res.msg);
    } else {
      toast.error(res.msg);
    }
  }

  async function handleDelete() {
    const res = await deleteWebhookChannelServerAction(guildId, channelId);
    if (!res.succeeded) {
      toast.error(res.msg);
    } else {
      setDeleted(true);
      toast.success(res.msg);
    }
  }

  const handleCancelReplacement = () => {
    setIsPopupOpen(false);
    toast.success("Suppression annulée");
  };

  const hoverElement: ReactNode = (
    <p className="flex flex-col items-center justify-center border-black border-2 rounded-xl p-2 bg-primary">
      Renomme le channel pour plus de clarté
    </p>
  );

  if (deleted) {
    return null;
  }

  return (<div className="px-4 border-2 py-2 mb-2 border-secondary-foreground rounded-xl">
    <div className="flex flex-row gap-2 pb-2 items-center">
      <h3 className="font-bold text-l">Channel:</h3>
      <div className="flex flex-row gap-2">
        <input
          id="server_name"
          type="text"
          value={channelName}
          className="text-left pl-2 rounded-sm font-bold text-sm flex items-center justify-center w-fit [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          onChange={(e) => setChannelName(e.target.value)}
        />
        {channelName !== defaultName && <Button size="icon" onClick={handleEdit}><FaSave size={18}/></Button>}
        {defaultName.startsWith("channel-") &&
          <HoverText text={hoverElement} className="rounded-sm h-9 w-9 bg-yellow-600">
            <IoIosWarning size="icon"/>
          </HoverText>
        }
        <Button size="icon" className="bg-red-600" onClick={() => setIsPopupOpen(true)}>
          <FaTrashCan/>
        </Button>
        <Dialog open={isPopupOpen} onOpenChange={handleCancelReplacement}>
          <DialogContent className="px-0 pb-0 max-w-4xl justify-items-center">
            <DialogHeader className="px-6">
              <DialogTitle className="text-primary">Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-fit h-max-[80dvh] px-6 border-t">
              Etes vous sûr de vouloir supprimer toutes les notifications associés à ce channel ?
              Aucun retour possible.
            </ScrollArea>
            <div className="flex flex-row gap-2 pb-2">
              <Button onClick={() => handleDelete()} className="bg-green-500">Oui</Button>
              <Button onClick={handleCancelReplacement} className="bg-red-500">Non</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {children}
    </div>
  </div>);
}