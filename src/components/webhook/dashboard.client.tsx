"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

import {  API_PALATRACKER } from "@/lib/constants";

import { useWebhookAlertStore } from "@/stores/use-webhook-alert-store";
import { DiscordProfilPicture } from "../account/discord-profil-picture.client";
import { WebhookServerSection } from "./webhook-server.client";
import { Button } from "@/components/ui/button-v2";
import { useProfileStore } from "@/stores/use-profile-store";

/**
 * Dashboard component for managing webhook alert.
 */
export function DashboardRefonteMultipleChannels() {
  const { groupedServer } = useWebhookAlertStore();
  const { profileInfo } = useProfileStore();

  return (
    <Card>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#a8a8a8] dark:bg-[#1a1d24] p-6 rounded-2xl border border-gray-800 ">
        <div className="flex items-center gap-4">
          <DiscordProfilPicture className="w-16 h-16 border-2 border-green-500 shadow-[0_0_15px_rgba(33,194,93,0.7)]" />
          <div>
            <h1 className="text-2xl font-bold ">Bonjour, <span className="text-primary">{profileInfo?.global_name}</span></h1>
            <p className="text-card-foreground text-sm">Gérez vos alertes discord</p>
          </div>
        </div>

        <a href={`${API_PALATRACKER}/v1/auth/webhook/create`} className="w-full md:w-auto">
          <Button
            variant="primary"
            className="w-full md:w-auto flex px-6 py-3 rounded-xl">
            <Plus size={20} />
            Nouvelle alerte
          </Button>
        </a>
      </header>

      <div className="lg:col-span-2 space-y-8 mt-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold ">Liste de vos alertes</h2>
        </div>

        {groupedServer.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-[#1a1d24] rounded-xl border border-dashed border-gray-800">
            <p>Aucune alertes trouvées.</p>
            <p className="text-sm">Commencez par créer un webhook.</p>
          </div>
        ) : (
          groupedServer.map(server => (
            <WebhookServerSection
              key={server.serverId}
              server={server}
            />
          ))
        )}
      </div>
    </Card>
  );
}
