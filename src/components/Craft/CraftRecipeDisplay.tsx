import 'server-only';
import { getAllItems, getItemAlias } from "@/lib/api/apiPalaTracker.ts";
import { redirect } from "next/navigation";
import { generateCraftUrl } from "@/lib/misc.ts";
import { CraftSectionEnum, searchParamsCraftPage } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { CountSelector } from "@/components/Craft/CountSelector.tsx";
import MarketSelector from "@/components/AhTracker/MarketSelector.tsx";
import constants from "@/lib/constants.ts";
import React, { Suspense } from "react";
import { CraftingInformationFetcher } from "@/components/Craft/CraftingInformationFetcher.tsx";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import GradientText from "@/components/shared/GradientText.tsx";

export async function CraftRecipeDisplay({ searchParams }: { searchParams: searchParamsCraftPage }) {
  const options = await getAllItems();


  const item = options.find((item) => item.value === searchParams.item);
  const count = searchParams.count || 1;


  if (item === undefined && searchParams.item !== undefined) {
    const aliasName = await getItemAlias(searchParams.item);
    if (aliasName !== null) {
      redirect(generateCraftUrl(aliasName, count, searchParams.section! as CraftSectionEnum));
    }
    return <div>
      <Card className="rounded-b-xl rounded-t-none bg-red-700">
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
      <Card className="rounded-b-xl rounded-t-none md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-3 row-span-3">
        <CardHeader>
          <CardTitle>
            Sélection un item à crafter
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row gap-2 pt-4 justify-center items-center w-full">
          <CountSelector item={item} count={count}/>
          <div className="flex-grow">
            <Suspense fallback={<MarketSelectFallback/>}>
              <MarketSelector url={`${constants.craftPath}?section=recipe&count=${count ?? 1}&item=`} item={item ?? null}/>
            </Suspense>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-2 w-full">
        {item &&
          <Suspense fallback={<CraftRecipeFallback label={item.label}/>}>
            <CraftingInformationFetcher item={item} options={options} count={count}/>
          </Suspense>
        }
      </div>
    </div>);
}

export function MarketSelectFallback()
{
  return <div className="flex flex-row gap-2 m-4 w-96 items-center">
    <LoadingSpinner size={4}/>
    <h2 className="font-bold">Chargement des items...</h2>
  </div>;
}

function CraftRecipeFallback({ label }: { label: string }) {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement des crafts de l&apos;item :{" "}
        <GradientText
          className="font-extrabold">{label || "Not Found"}
        </GradientText>
      </CardTitle>
    </CardHeader>
  </Card>);
}