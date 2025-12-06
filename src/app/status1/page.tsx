import React from "react";
import { PlayerConnectionHistory } from "@/components/status1/player-connection-history.client";
import { PlayerCountHistory } from "@/components/status1/player-count-history.client";

/**
 * [Status page](http://palatracker.bromine.fr/status)
 */
export default function StatusPage() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-4xl font-bold mb-4">
        Historique du serveur
      </h1>

      <PlayerConnectionHistory/>
      <PlayerCountHistory/>
    </div>
  );
}