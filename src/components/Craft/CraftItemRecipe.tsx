import { CraftingRecipeKey, OptionType } from "@/types";
import { getCraft } from "@/lib/api/apiPalaTracker.ts";
import { redirect } from "next/navigation";
import Image from "next/image";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import { CraftingArrow } from "@/components/Craft/CraftingArrow.tsx";
import constants from "@/lib/constants.ts";
import React from "react";
import { CardContent } from "@/components/ui/card.tsx";

export async function CraftItemRecipe({ item, options }: { item: OptionType, options: OptionType[] }) {

  const craft_recipe = await getCraft(item.value);
  const slotAvailable: CraftingRecipeKey[] = ['item_name_slot1', 'item_name_slot2', 'item_name_slot3', 'item_name_slot4', 'item_name_slot5', 'item_name_slot6', 'item_name_slot7', 'item_name_slot8', 'item_name_slot9'] as const;

  const slotItemInfo = slotAvailable.map((slot) => {
    const t = options.find((option) => option.value === craft_recipe[slot]);
    if (t === undefined)
      redirect(`/error?message=${craft_recipe[slot]} not found in the list of all items`);
    return t;
  });

  return (
    <CardContent className="flex flex-row gap-4 pt-2">
      <div className="grid grid-cols-3 grid-rows-3 w-fit gap-1 bg-secondary">
        {slotItemInfo.map((slot, index) => {
          return (
            <a key={slot.label + index} href={constants.craftPath + `?item=${slot.value}`}
               className="">
              <div className="bg-primary grid justify-center items-center w-16 h-16">
                {
                  slot.value !== 'air' && <Image src={`/AH_img/${slot.img}`} alt={slot.value}
                                                 className="h-12 w-12 pixelated m-2 rounded-sm hover:scale-125 duration-300"
                                                 width={48} height={48}
                                                 unoptimized={true}/>
                }
              </div>
            </a>

          )
        })}
      </div>

      <div className="flex flex-row gap-2 items-center justify-center w-96">
        <CraftingArrow/>
        <SmallCardInfo title={craft_recipe.count + "x " + item.label} value={craft_recipe.count + "x " + item.label2}
                       img={`/AH_img/${item.img}`} unoptimized count={craft_recipe.count}/>
      </div>
    </CardContent>
  );
}