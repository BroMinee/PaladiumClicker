import React from "react";
import { PlayerConnectionHistory } from "@/components/status/player-connection-history.client";
import { PlayerCountHistory } from "@/components/status/player-count-history.client";
import { getPlayerInfo, getPlayerOnlineCount, isApiDown } from "@/lib/api/apiPala";
import { isMyApiDown } from "@/lib/api/apiPalaTracker";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc";

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | Statut";
  const apiDownPaladium = await isApiDown();
  const apiDownPalaTracker = await isMyApiDown().catch(() => true);
  const apiImportProfil = await getPlayerInfo("BroMine__").then(() => {
    return false;
  }).catch(() => {
    return true;
  });
  let description = `${await getPlayerOnlineCount()} joueurs connectés sur Paladium.\n\n`;

  if (apiDownPaladium) {
    description += "🚨 L'API de Paladium est actuellement hors service.\n";
  } else {
    description += "🟢 L'API de Paladium est actuellement en ligne.\n";
  }

  if (apiDownPalaTracker) {
    description += "🚨 Notre API est actuellement hors service.\n";
  } else {
    description += "🟢 Notre API est actuellement en ligne.\n";
  }

  if (apiImportProfil) {
    description += "🚨 L'import de profil est actuellement hors service.\n";
  } else {
    description += "🟢 L'import de profil est actuellement en ligne.\n";
  }

  try {
    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
      },
    };
  } catch (_) {
    return {
      title: title,
      description: "Une erreur est survenue lors de la génération des métadonnées.",
      openGraph: {
        title: title,
        description: "Une erreur est survenue lors de la génération des métadonnées.",
      },
    };
  }

}

/**
 * [Status page](http://palatracker.bromine.fr/status)
 */
export default function StatusPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("Statut des °Services°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          {"Consultez l'historique du nombre de joueurs connectés sur Paladium."}
        </PageHeaderDescription>
      </PageHeader>

      <PlayerConnectionHistory/>
      <PlayerCountHistory/>
    </div>
  );
}