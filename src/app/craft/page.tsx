import "server-only";
import { CraftingHelperPage } from "@/components/craft1/craft-recipe.client";
import { getAllItems, getCraftRecipe } from "@/lib/api/apiPalaTracker";
import { OptionType, searchParamsCraftPage } from "@/types";
import { SetCraftingState } from "@/components/craft1/set-crafting-state";
import { SetItemsStats } from "@/components/shared/set-items-state.client";

/**
 * Generate Metadata
 * @param props.searchParams - Craft search params
 */
export async function generateMetadata(props: { searchParams: Promise<searchParamsCraftPage> }) {
  const searchParams = await props.searchParams;

  const itemListJson = await getAllItems().catch(() => {
    return [] as OptionType[];
  });

  const item = itemListJson.find((item) => item.value === searchParams.item);

  if (!item) {
    return {
      title: "PalaTracker | Craft Optimizer",
      description: "Calcule les ressources nécessaires pour tes crafts sur Paladium, en fonction de tes besoins, obtient une évoluation du prix avec le market en temps réel.",
      openGraph: {
        title: "PalaTracker | Craft Optimizer",
        description: "Calcule les ressources nécessaires pour tes crafts sur Paladium, en fonction de tes besoins, obtient une évoluation du prix avec le market en temps réel."
      },
    };
  }

  const title = `PalaTracker | Craft Optimizer | ${item.label}`;
  const description = "Calcule les ressources nécessaires pour tes crafts sur Paladium, en fonction de tes besoins, obtient une évoluation du prix avec le market en temps réel.";
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
  };
}

/**
 * [Crafting recipe page](https://palatracker.bromine.fr/craft)
 */
export default async function CraftRecipeDisplay(props: { searchParams: Promise<searchParamsCraftPage> }) {
  const searchParams = await props.searchParams;
  const options = await getAllItems();
  const item = searchParams === undefined ? undefined : options.find(item => item.value === (searchParams.item ?? ""));
  const craftingTree = item ? await getCraftRecipe(item.value, searchParams.count ?? 1) : undefined;

  return (
    <SetItemsStats allItems={options}>
      <SetCraftingState root={craftingTree}>
        <CraftingHelperPage />
      </SetCraftingState>
    </SetItemsStats>
  );
}