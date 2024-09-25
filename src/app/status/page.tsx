import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import { Suspense } from "react";
import GraphStatus, { GraphStatusFallback } from "@/components/Status/GraphStatus.tsx";
import { isMyApiDown } from "@/lib/api/apiPalaTracker.ts";
import { getPlayerInfo } from "@/lib/api/apiPala.ts";


export async function generateMetadata() {
  const title = "PalaTracker - Status du serveur Paladium et de nos services";
  // const apiDownPaladium = await isApiDown();
  const apiDownPaladium = true;
  const apiDownPalaTracker = await isMyApiDown().catch(() => true);
  const apiImportProfil = await getPlayerInfo("BroMine__").then(() => {
    return false
  }).catch(() => { return true });
  // let description = `${await getPlayerOnlineCount()} joueurs connectés sur Paladium.\n\n`;
  let description = "0 joueurs connectés sur Paladium.\n\n";

  if (apiDownPaladium)
    description += "🚨 L'API de Paladium est actuellement hors service.\n";
  else
    description += "🟢 L'API de Paladium est actuellement en ligne.\n";

  if (apiDownPalaTracker)
    description += "🚨 Notre API est actuellement hors service.\n";
  else
    description += "🟢 Notre API est actuellement en ligne.\n";

  if (apiImportProfil)
    description += "🚨 L'import de profil est actuellement hors service.\n";
  else
    description += "🟢 L'import de profil est actuellement en ligne.\n";


  try {
    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
      },
    }
  } catch (error) {
    return {
      title: title,
      description: "Une erreur est survenue lors de la génération des métadonnées.",
      openGraph: {
        title: title,
        description: "Une erreur est survenue lors de la génération des métadonnées.",
      },
    }
  }

}

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bienvenue sur le visualisateur du{" "}
            <GradientText className="font-extrabold">Status</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart
            className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-between gap-2 h-[calc(100vh-30vh)]">
          Cette page n&apos;est pas encore finie, mais vous pouvez déjà voir le graphique des joueurs connectés sur
          Paladium.
          <Suspense fallback={<GraphStatusFallback/>}>
            <GraphStatus/>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}