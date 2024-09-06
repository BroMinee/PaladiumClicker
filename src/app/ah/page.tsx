// import Plot from "react-plotly.js";
// import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
// import { getPaladiumAhItemFullHistory, getPaladiumAhItemStats } from "@/lib/apiPala.ts";
// import { AhItemHistory, AhPaladium } from "@/types";
// import Selector from "@/components/shared/Selector.tsx";
// import { LuCalendarClock } from "react-icons/lu";
// import { formatPrice, GetAllFileNameInFolder, levensteinDistance } from "@/lib/misc.ts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { FaHeart } from "react-icons/fa";
import GradientText from "@/components/shared/GradientText.tsx";
import GraphItem from "@/components/AhTracker/GraphItem.tsx";
import { Suspense } from "react";

import itemListJson from "@/assets/items_list.json";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import MarketSelector from "@/components/AhTracker/MarketSelector.tsx";
import QuantitySelectorDisplay from "@/components/AhTracker/QuantitySelectorDisplay.tsx";
import { GetAllFileNameInFolder, levenshteinDistance } from "@/lib/misc.ts";

export function generateMetadata(
  { searchParams }: { searchParams: { item: string | undefined } },
) {
  const itemName = itemListJson.find((item) => item.value === searchParams.item)?.label as string | undefined;

  if (!itemName) {
    return {
      title: "AH Tracker",
      description: "Suivez les historiques de vente de vos items préférés sur Paladium",
      openGraph: {
        title: "AH Tracker",
        description: "Suivez les historiques de vente de vos items préférés sur Paladium"
      },
    }
  }

  let closestItemName = searchParams.item === undefined ? "" : GetAllFileNameInFolder().reduce((acc, curr) => {
    if (levenshteinDistance(curr, searchParams.item!) < levenshteinDistance(acc, searchParams.item!)) {
      return curr;
    } else {
      return acc;
    }
  });

  const title = `AH Tracker  - ${itemName}`;
  const description = "Suivez les historiques de vente de vos items préférés sur Paladium";
  return {
    title: title,
    description: "Suivez les historiques de vente de vos items préférés sur Paladium",
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: `https://dev.bromine.fr/AH_img/${closestItemName}.png`,
          width: 500,
          height: 500,
        }
      ]
    },
  }
}

export default function AhTrackerPage({ searchParams }: { searchParams: { item: string | undefined } }) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bienvenue sur{" "}
            <GradientText className="font-extrabold">l&apos;AH Tracker</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="bg-red-700">
        <CardHeader>
          <CardTitle className="text-primary-foreground">
            Le prix de vente en $ journalier est inexact, il est calculé en divisant la somme des prix de vente
            en $ par
            le nombre de ventes journalières, or le nombre de ventes journalières contient aussi les ventes en pbs.
            Il y a
            donc une surévaluation du vrai prix.
            Cela sera corrigé après une mise à jour de l&apos;API de Paladium.
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-3 row-span-3">
        <CardContent className="gap-2 flex flex-col pt-4">
          <MarketSelector/>
        </CardContent>
        {searchParams.item ?
          <Suspense fallback={<QuantitySelectorDisplayFallBack selectedItem={searchParams.item}/>}>
            <QuantitySelectorDisplay selectedItem={searchParams.item}/>
          </Suspense>
          :
          null}
      </Card>
      <div className="w-full">
        {searchParams.item ?
          <Suspense fallback={<GraphItemFallback selectedItem={searchParams.item}/>}>
            <GraphItem selectedItem={searchParams.item}/>
          </Suspense>
          :
          <Card className="col-start-1 col-span-4 w-full">
            <CardHeader>
              <CardTitle>
                Veuillez sélectionner un item
              </CardTitle>
            </CardHeader>
          </Card>}
      </div>
    </div>)
}


function QuantitySelectorDisplayFallBack({ selectedItem }: { selectedItem: string }) {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement des informations de :{" "}
        <GradientText
          className="font-extrabold">{itemListJson.find((item) => item.value === selectedItem)?.label}
        </GradientText>
      </CardTitle>
    </CardHeader>
  </Card>)
}

function GraphItemFallback({ selectedItem }: { selectedItem: string }) {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement du graphique de prix de :{" "}
        <GradientText
          className="font-extrabold">{itemListJson.find((item) => item.value === selectedItem)?.label}
        </GradientText>
      </CardTitle>
    </CardHeader>
  </Card>)
}