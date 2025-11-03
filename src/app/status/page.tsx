import { Card, CardContent, CardDescription, CardHeader, CardTitleH1 } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import { Suspense } from "react";
import GraphStatus, { GraphStatusFallback } from "@/components/Status/GraphStatus.tsx";
import { isMyApiDown } from "@/lib/api/apiPalaTracker.ts";
import { getPlayerInfo, getPlayerOnlineCount, isApiDown } from "@/lib/api/apiPala.ts";
import { StatusSelectorClientPeriode } from "@/components/Status/StatusSelectorClient.tsx";
import { redirect } from "next/navigation";
import { generateStatusUrl } from "@/lib/misc.ts";
import { AdminShopPeriod } from "@/types";
import GraphPlayerCount from "@/components/Status/GraphPlayerCount.tsx";

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

export type searchParamsStatusPage = {
  periode: string,
}

export default async function Home(
  props: {
    searchParams: Promise<searchParamsStatusPage>
  }
) {
  const searchParams = await props.searchParams;
  let periode = searchParams.periode;
  let periodeEnum = searchParams.periode as AdminShopPeriod;

  if (periode === undefined) {
    periode = "day";
  }

  if (periode !== "day" && periode !== "week" && periode !== "month" && periode !== "season") {
    redirect(generateStatusUrl("day"));
    return null;
  } else {
    periodeEnum = periode as AdminShopPeriod;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitleH1>
            Bienvenue sur le visualisateur du{" "}
            <GradientText className="font-extrabold">Statut</GradientText>
          </CardTitleH1>
          <CardDescription>
            Made with <FaHeart
              className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-between gap-2 h-[calc(100vh-30vh)]">
          <Suspense fallback={<GraphStatusFallback/>}>
            <GraphStatus periode={periodeEnum}/>
          </Suspense>
        </CardContent>
        <CardHeader className='w-full flex flex-col sm:flex-row gap-2 justify-center items-center p-0 mb-2'>
          <StatusSelectorClientPeriode periode="day"/>
          <StatusSelectorClientPeriode periode="week"/>
          <StatusSelectorClientPeriode periode="month"/>
          <StatusSelectorClientPeriode periode="season"/>
        </CardHeader>
      </Card>
      <Card className="flex flex-col gap-4">
        <CardContent className="flex flex-col items-center justify-between gap-2 w-full">
          <Suspense fallback={<GraphStatusFallback/>}>
            <GraphPlayerCount />
          </Suspense>
          {/*<Suspense fallback={<GraphStatusFallback/>}>*/}
          {/*  <GraphMoneySum />*/}
          {/*</Suspense>*/}
        </CardContent>
      </Card>
    </div>
  );
}