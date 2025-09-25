import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleH1 } from "@/components/ui/card.tsx";
import { FaHeart } from "react-icons/fa";
import GradientText from "@/components/shared/GradientText.tsx";
import React, { Suspense } from "react";

import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import MarketSelector from "@/components/AhTracker/MarketSelector.tsx";
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { OptionType } from "@/types";
import constants from "@/lib/constants";
import { MarketServerFetcher } from "@/components/AhTracker/MarketServerFetcher.tsx";
import { redirect } from "next/navigation";

export async function generateMetadata(props: { searchParams: Promise<{ item: string | undefined }> }) {
  const searchParams = await props.searchParams;

  const itemListJson = await getAllItems().catch(() => {
    return [] as OptionType[];
  });

  const item = itemListJson.find((item) => item.value === searchParams.item);

  if (!item) {
    return {
      title: "PalaTracker | AH Tracker",
      description: "Suivez les historiques de vente de vos items préférés sur Paladium",
      openGraph: {
        title: "PalaTracker | AH Tracker",
        description: "Suivez les historiques de vente de vos items préférés sur Paladium"
      },
    };
  }

  const title = `PalaTracker | AH Tracker | ${item.label}`;
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
  };
}

export default async function AhTrackerPage(props: { searchParams: Promise<{ item: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const options = await getAllItems().catch(() => {
    return redirect("/error?message=Impossible de charger la liste des items");
  });

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
    </div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitleH1>
            Bienvenue sur{" "}
            <GradientText className="font-extrabold">l&apos;AH Tracker</GradientText>
          </CardTitleH1>
          <CardDescription>
            Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="bg-red-700">
        <CardHeader>
          <CardTitle className="text-primary-foreground">
            Le prix de vente en $ et en pb journalier n&apos;est pas identique à celui de Paladium car il y a une erreur
            dans la formule utilisée dans le Market Stats de Paladium.
            Ils considèrent une vente en plus journalière ce qui fait reduire le prix de vente moyen surtout lors que
            l&apos;objet est vendu en très faible quantité.
            Le bug a été reporté à Paladium et sera corrigé dans une prochaine mise à jour.
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-3 row-span-3">
        <CardHeader className="pb-2">
          <CardTitle>
            Sélection un item pour voir son historique de vente
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-2 flex flex-col pt-4">
          <MarketSelector url={`${constants.ahPath}?item=`} item={item ?? null}/>
        </CardContent>
      </Card>
      <div className="w-full">
        {item ?
          <Suspense fallback={<GraphItemFallback item={item}/>}>
            <MarketServerFetcher item={item}/>
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
    </div>);
}

function GraphItemFallback({ item }: { item: OptionType }) {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement du graphique de prix de :{" "}
        <GradientText
          className="font-extrabold">{item.label ?? "Not Found"}
        </GradientText>
      </CardTitle>
    </CardHeader>
  </Card>);
}