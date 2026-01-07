import "server-only";
import { getAllItems, getItemAlias } from "@/lib/api/apiPalaTracker";
import { redirect } from "next/navigation";
import { generateCraftUrl } from "@/lib/misc";
import { CraftSectionEnum, searchParamsCraftPage } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountSelector } from "@/components/Craft/CountSelector";
import MarketSelector from "@/components/AhTracker/MarketSelector";
import { constants } from "@/lib/constants";
import React, { Suspense } from "react";
import { CraftingInformationFetcher } from "@/components/Craft/CraftingInformationFetcher";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GradientText } from "@/components/shared/GradientText";

/**
 * Server component for displaying the crafting recipe page.
 * Loads all items, validates the selected item from URL search params,
 * handles automatic redirection on alias name item, and renders the UI to
 * select an item and view its crafting recipe.
 *
 * Redirects when:
 * - The selected item does not exist but an alias is found (redirects to alias)
 *
 * Shows an error card when:
 * - The selected item does not exist and no alias is available in the DB.
 *
 * @param searchParams - Search params of the crafting page
 */
export async function CraftRecipeDisplay({ searchParams }: { searchParams: searchParamsCraftPage }) {
  const options = await getAllItems();

  const item = options.find((item) => item.value === searchParams.item);
  const count = searchParams.count ?? 1;

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
              <MarketSelector url={`${constants.craftingCalculatorPath}?section=recipe&count=${count ?? 1}&item=`} item={item ?? null}/>
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

/**
 * Fallback UI displayed while the market item selector is loading.
 * Shows a loading spinner.
 */
function MarketSelectFallback() {
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
          className="font-extrabold">{label ?? "Not Found"}
        </GradientText>
      </CardTitle>
    </CardHeader>
  </Card>);
}