import { CraftingRecipeType, NodeType, OptionType } from "@/types";
import React, { Suspense } from "react";
import { BuildTreeRecursively } from "@/components/Craft/CraftingInformationFetcher.tsx";
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { CraftRecipeFallback } from "@/app/craft/page.tsx";
import { CraftItemRecipe } from "@/components/Craft/CraftItemRecipe.tsx";

function createNodeType(item: OptionType, count: number): NodeType {
  return { ...item, count };
}

export default async function Page() {
  const map: Map<string, string> = new Map<string, string>();

  const options = await getAllItems();


  for (const option of options) {
    // wait 2 sec between each craft
    await BuildTreeRecursively(createNodeType(option, 1), options, new Map<string, CraftingRecipeType>()).catch((e) => { map.set(option.value, e.message) });
  }

  if (map.size > 0) {
    return (
      <div>
        <div>
          Error during crafting:
        </div>
        {Array.from(map).map(([key, value]) => (
          <div key={key}>
            {key} : {value}
          </div>
        ))}
      </div>
    )
  }


  return (
    <div>
      All crafts are good
      {options.map((option, index) => (
        <Suspense key={option.value + index} fallback={<CraftRecipeFallback item={option}/>}>
          <CraftItemRecipe item={option} options={options}/>
        </Suspense>))
      }
    </div>
  );
}