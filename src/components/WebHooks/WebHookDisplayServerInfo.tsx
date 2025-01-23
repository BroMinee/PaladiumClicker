'use client';
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { FaSave } from "react-icons/fa";
import { editWebhookChannelNameServerAction, editWebhookGuildNameServerAction } from "@/lib/api/apiServerAction.ts";
import { toast } from "sonner";

export function DisplayServerBox({ guildId, channelId, guildIdToServerName, children }:
                                   {
                                     guildId: string,
                                      channelId: string,
                                     guildIdToServerName: Record<string, string>,
                                     children: React.ReactNode
                                   }) {

  const [defaultName, setDefaultName] = React.useState<string>("");
  const [guildName, setGuildName] = React.useState<string>("");

  useEffect(() => {
    setDefaultName(guildIdToServerName[guildId]);
    setGuildName(guildIdToServerName[guildId]);
  }, [])

  async function handleEdit() {
    const res = await editWebhookGuildNameServerAction(guildId, channelId,guildName);
    console.log(res);
    if(res.succeeded)
    {
      setDefaultName(guildName);
      toast.success(res.msg);
    }
    else
    {
      toast.error(res.msg);
    }
  }

  return (<div className="px-4 border-2 py-2 border-secondary-foreground">
    <div>
      <div className="flex flex-row gap-2 pb-2">
        <h2 className="font-bold text-xl">Serveur:</h2>
        <input
          id="server_name"
          type="text"
          className="text-left pl-2 rounded-sm font-bold text-sm flex items-center justify-center w-fit [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={guildName}
          onChange={(e) => setGuildName(e.target.value)}
        />
        {guildName !== defaultName && <Button size="icon" onClick={handleEdit}><FaSave size={18}/></Button>}
      </div>

      {children}
    </div>
  </div>)
}

export function DisplayChannelBox({ channelId, channelIdToChannelName, guildId, children }: {
  channelId: string,
  guildId: string,
  channelIdToChannelName: Record<string, string>,
  children: React.ReactNode
}) {
  const [defaultName, setDefaultName] = React.useState<string>("");
  const [channelName, setChannelName] = React.useState<string>("");

  useEffect(() => {
    setDefaultName(channelIdToChannelName[channelId]);
    setChannelName(channelIdToChannelName[channelId]);
  }, [])

  async function handleEdit() {
    const res = await editWebhookChannelNameServerAction(guildId,channelId,channelName);
    console.log(res);
    if(res.succeeded)
    {
      setDefaultName(channelName);
      toast.success(res.msg);
    }
    else
      toast.error(res.msg);
  }

  return (<div className="px-4 border-2 py-2 mb-2 border-secondary-foreground">
    <div className="flex flex-row gap-2 pb-2">
    <h3 className="font-bold text-l">Channel:</h3>
      <input
        id="server_name"
        type="text"
        value={channelName}
        className="text-left pl-2 rounded-sm font-bold text-sm flex items-center justify-center w-fit [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        onChange={(e) => setChannelName(e.target.value)}
      />
      {channelName !== defaultName && <Button size="icon" onClick={handleEdit} ><FaSave size={18}/></Button>}
    </div>
    <div className="grid grid-cols-2 gap-2">
      {children}
    </div>
  </div>)
}