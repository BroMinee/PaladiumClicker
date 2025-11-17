import "server-only";
import { CraftingHelperPage } from "@/components/craft1/craft-recipe.client";
import { getAllItems, getCraftRecipe } from "@/lib/api/apiPalaTracker";
import { searchParamsCraftPage } from "@/types";
import { CraftingSetLocal } from "@/components/craft1/setSearchParams.client";

/**
 * [Crafting recipe page](https://palatracker.bromine.fr/craft)
 */
export default async function CraftRecipeDisplay(props: { searchParams: Promise<searchParamsCraftPage> }) {
  const searchParams = await props.searchParams;
  const options = await getAllItems();
  const item = searchParams === undefined ? undefined : options.find(item => item.value === (searchParams.item ?? ""));
  const craftingTree = item ? await getCraftRecipe(item.value, searchParams.count ?? 1) : undefined;

  return (
    <CraftingSetLocal allItems={options} root={craftingTree}>
      <CraftingHelperPage />
    </CraftingSetLocal>
  );
}