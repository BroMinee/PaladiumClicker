import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { FaHeart } from "react-icons/fa";
import GradientText from "@/components/shared/GradientText.tsx";
import GraphItem from "@/components/AhTracker/GraphItem.tsx";
import React, { Suspense } from "react";

import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import MarketSelector from "@/components/AhTracker/MarketSelector.tsx";
import QuantitySelectorDisplay from "@/components/AhTracker/QuantitySelectorDisplay.tsx";
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { OptionType } from "@/types";
import constants from "@/lib/constants";

export async function generateMetadata(
  { searchParams }: { searchParams: { item: string | undefined } },
) {

  const itemListJson = await getAllItems().catch(() => {
    return [] as OptionType[];
  })

  const item = itemListJson.find((item) => item.value === searchParams.item);

  if (!item) {
    return {
      title: "PalaTracker - AH Tracker",
      description: "Suivez les historiques de vente de vos items préférés sur Paladium",
      openGraph: {
        title: "PalaTracker - AH Tracker",
        description: "Suivez les historiques de vente de vos items préférés sur Paladium"
      },
    }
  }


  const title = `PalaTracker - AH Tracker  - ${item.value}`;
  const description = "Suivez les historiques de vente de vos items préférés sur Paladium";
  return {
    title: title,
    description: "Suivez les historiques de vente de vos items préférés sur Paladium",
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: `https://palatracker.bromine.fr/AH_img/${item.img}`,
          width: 500,
          height: 500,
        }
      ]
    },
  }
}

export default async function AhTrackerPage({ searchParams }: { searchParams: { item: string | undefined } }) {
  const options = await getAllItems();

  const item = options.find((item) => item.value === searchParams.item);

  if (item === undefined && searchParams.item !== undefined) {
    return <div>
      <Card className="bg-red-700">
        <CardHeader>
          <CardTitle className="text-primary-foreground">
            L&apos;item sélectionné n&apos;existe pas
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  }

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
        <CardHeader>
          <CardTitle>
            Sélection un item à pour voir son historique de vente
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-2 flex flex-col pt-4">
          <MarketSelector url={`${constants.ahPath}?item=`} item={item || null}/>
        </CardContent>
        {item ?
          <Suspense fallback={<QuantitySelectorDisplayFallBack item={item}/>}>
            <QuantitySelectorDisplay item={item}/>
          </Suspense>
          :
          null}
      </Card>
      <div className="w-full">
        {item ?
          <Suspense fallback={<GraphItemFallback item={item}/>}>
            <GraphItem item={item}/>
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


function QuantitySelectorDisplayFallBack({ item }: { item: OptionType }) {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement des informations de :{" "}
        <GradientText
          className="font-extrabold">{item.label}
        </GradientText>
      </CardTitle>
    </CardHeader>
  </Card>)
}

function GraphItemFallback({ item }: { item: OptionType }) {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement du graphique de prix de :{" "}
        <GradientText
          className="font-extrabold">{item.label || "Not Found"}
        </GradientText>
      </CardTitle>
    </CardHeader>
  </Card>)
}