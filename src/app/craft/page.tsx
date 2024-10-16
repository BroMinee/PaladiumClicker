import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { FaHeart } from "react-icons/fa";
import GradientText from "@/components/shared/GradientText.tsx";
import React, { Suspense } from "react";

import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import MarketSelector from "@/components/AhTracker/MarketSelector.tsx";
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { OptionType } from "@/types";
import constants from "@/lib/constants.ts";
import CraftingInformationFetcher from "@/components/Craft/CraftingInformationFetcher.tsx";
import { CountSelector } from "@/components/Craft/CountSelector.tsx";

export async function generateMetadata(
  { searchParams }: { searchParams: { item: string | undefined } },
) {

  const itemListJson = await getAllItems().catch(() => {
    return [] as OptionType[];
  })

  const item = itemListJson.find((item) => item.value === searchParams.item);

  if (!item) {
    return {
      title: "PalaTracker - Craft Optimizer",
      description: "Optimisez vos crafts sur Paladium",
      openGraph: {
        title: "PalaTracker - Craft Optimizer",
        description: "Optimisez vos crafts sur Paladium"
      },
    }
  }


  const title = `PalaTracker - Craft Optimizer  - ${item.value}`;
  const description = "Optimisez vos crafts sur Paladium";
  return {
    title: title,
    description: description,
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

export default async function AhTrackerPage({ searchParams }: {
  searchParams: { item: string | undefined, count: number | undefined }
}) {
  const options = await getAllItems();

  const item = options.find((item) => item.value === searchParams.item);
  const count = searchParams.count || 1;



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
            <GradientText className="font-extrabold">l&apos;optimiseur de Craft</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          Cet outil permet de lister les ressources nécessaires pour fabriquer un item en fonction de la quantité.
          <br/>
          Il permet également d&apos;avoir une indication du prix de fabrication de l&apos;item.
        </CardContent>
      </Card>
      <Card className="md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-3 row-span-3">
        <CardHeader>
          <CardTitle>
            Sélection un item à crafter
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row gap-2 pt-4 justify-center items-center w-full">
          <CountSelector item={item} count={count}/>
          <div className="flex-grow">
            <MarketSelector url={`${constants.craftPath}?count=${count || 1}&item=`} item={item || null}/>
          </div>
        </CardContent>
        {/*{item ?*/}
        {/*  <Suspense fallback={<QuantitySelectorDisplayFallBack item={item}/>}>*/}
        {/*    <QuantitySelectorDisplay item={item}/>*/}
        {/*  </Suspense>*/}
        {/*  :*/}
        {/*  null}*/}
      </Card>
      <div className="grid grid-cols-2 gap-2 w-full">
        {item &&
          <Suspense fallback={<CraftRecipeFallback item={item}/>}>
            <CraftingInformationFetcher item={item} options={options} count={count}/>
          </Suspense>
        }
        {/*{item &&*/}
        {/*  <Suspense fallback={<CraftRecipeFallback item={item}/>}>*/}
        {/*    <CraftItemRecipe item={item} options={options}/>*/}
        {/*  </Suspense>*/}
        {/*}*/}
        {/*{item &&*/}
        {/*  <MyTreeView/>*/}
        {/*}*/}
        {/*<CraftResourceList list={itemList}/>*/}
      </div>

    </div>)
}

export function CraftRecipeFallback({ item }: { item: OptionType }) {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement des crafts de l&apos;item :{" "}
        <GradientText
          className="font-extrabold">{item.label || "Not Found"}
        </GradientText>
      </CardTitle>
    </CardHeader>
  </Card>)
}