import { CraftingRecipeKey, CraftingRecipeType, OptionType } from "@/types";
import { getCraft } from "@/lib/api/apiPalaTracker";
import { redirect } from "next/navigation";
import { CraftingArrow } from "@/components/Craft/CraftingArrow";
import React from "react";
import { CardContent } from "@/components/ui/card";
import { DisplayItem, DisplayItemProduce } from "@/components/Craft/CraftingDisplayItem";

/**
 * Display the crafting table with the corresponding item in each slot.
 * @param item - The item we want to craft.
 * @param options - A list of all available craft.
 */
export async function CraftItemRecipe({ item, options }: { item: OptionType, options: OptionType[] }) {

  const craft_recipe = await getCraft(item.value);
  const slotAvailable: CraftingRecipeKey[] = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9"] as const;

  const slotItemInfo = slotAvailable.map((slot) => {
    const t = options.find((option) => option.value === craft_recipe[slot]?.item_name);
    if (t === undefined) {
      redirect(`/error?message=${craft_recipe[slot]} not found in the list of all items`);
    }
    return t;
  });

  return (
    <CardContent className="flex flex-row gap-4 pt-2">
      <ShowCraft item={item} craft_recipe={craft_recipe} slotItemInfo={slotItemInfo}/>
    </CardContent>
  );
}

function ShowCraftDispatcher({ craft_recipe, slotItemInfo }: {
  craft_recipe: any,
  slotItemInfo: OptionType[]
}) {

  switch (craft_recipe.table) {
  case "crafting table":
    return <ShowCraftingTable slotItemInfo={slotItemInfo}/>;
  case "furnace":
    return <ShowFurnace slotItemInfo={slotItemInfo}/>;
  case "grinder":
    return <ShowGrinder slotItemInfo={slotItemInfo}/>;
  case "palamachine":
    return <ShowPalamachine slotItemInfo={slotItemInfo}/>;
  case "cauldron":
    return <ShowCauldron slotItemInfo={slotItemInfo}/>;
  case "alchemy creator":
    return <ShowAlchemyCreator slotItemInfo={slotItemInfo}/>;
  default:
    return <ShowCraftingTable slotItemInfo={slotItemInfo}/>;
  }
}

function ShowCraft({ item, craft_recipe, slotItemInfo }: {
  item: OptionType,
  craft_recipe: CraftingRecipeType,
  slotItemInfo: OptionType[]
}) {
  function tableTypeToName(table: string) {
    switch (table) {
    case "crafting table":
      return "Crafting Table";
    case "furnace":
      return "Furnace";
    case "grinder":
      return "Grinder";
    case "palamachine":
      return "Palamachine";
    case "cauldron":
      return "Cauldron";
    case "alchemy creator":
      return "Alchemy Creator";
    default:
      return table;
    }
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <p>{tableTypeToName(craft_recipe.table)}</p>
        <div className="flex flex-row w-full justify-between gap-4">
          <div className="min-w-fit">
            <ShowCraftDispatcher craft_recipe={craft_recipe} slotItemInfo={slotItemInfo}/>
          </div>
          <div className="flex flex-row gap-4 items-center w-full">
            <CraftingArrow/>
            <DisplayItemProduce item={item} title={craft_recipe.count + "x " + item.label} value={craft_recipe.count + "x " + item.label2} count={craft_recipe.count}/>
            {/*<SmallCardInfo title={craft_recipe.count + "x " + item.label} value={craft_recipe.count + "x " + item.label2}*/}
            {/*               img={`/AH_img/${item.img}`} unoptimized count={craft_recipe.count}/>*/}
          </div>
        </div>
      </div>

    </>
  );
}

function ShowCraftingTable({ slotItemInfo }: {
  slotItemInfo: OptionType[]
}) {
  return (
    <div
      className="grid grid-cols-3 grid-rows-3 w-fit gap-1">
      {slotItemInfo.map((slot, index) => {
        return (
          <DisplayItem key={slot.value + index + "-craft"} item={slot}/>
        );
      })}
    </div>
  );
}

function ShowPalamachine({ slotItemInfo }: {
  slotItemInfo: OptionType[]
}) {
  return (
    <div className="relative w-[12.5rem] h-[12.5rem] mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-fit h-fit">
        <DisplayItem item={slotItemInfo[0]}/>
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-fit h-fit">
        <DisplayItem item={slotItemInfo[1]}/>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-fit h-fit">
        <DisplayItem item={slotItemInfo[2]}/>
      </div>
      <div className="absolute bottom-0 left-[15%] w-fit h-fit">
        <DisplayItem item={slotItemInfo[3]}/>
      </div>
      <div className="absolute bottom-0 right-[15%] w-fit h-fit">
        <DisplayItem item={slotItemInfo[4]}/>
      </div>
    </div>

  );
}

function ShowFurnace({ slotItemInfo }: {
  slotItemInfo: OptionType[]
}) {
  return (
    <div className="w-[12.5rem] h-fit mx-auto">
      <div className="w-fit h-fit">
        <DisplayItem item={slotItemInfo[0]}/>
      </div>
    </div>

  );
}

function ShowGrinder({ slotItemInfo }: {
  slotItemInfo: OptionType[]
}) {
  return (
    <div className="flex flex-col w-[12.5rem] h-fit mx-auto gap-1">
      <div className="w-fit h-fit">
        <DisplayItem item={slotItemInfo[0]}/>
      </div>
      <div className="w-fit h-fit">
        <DisplayItem item={slotItemInfo[1]}/>
      </div>
    </div>

  );
}

function ShowCauldron({ slotItemInfo }: {
  slotItemInfo: OptionType[]
}) {
  return (
    <div className="flex flex-row w-[12.5rem] h-fit mx-auto gap-1">
      <div className="w-fit h-fit">
        <DisplayItem item={slotItemInfo[0]}/>
      </div>
      <div className="w-fit h-fit">
        <DisplayItem item={slotItemInfo[1]}/>
      </div>
    </div>

  );
}

function ShowAlchemyCreator({ slotItemInfo }: {
  slotItemInfo: OptionType[]
}) {
  return (
    <div
      className="grid grid-cols-3 w-fit h-fit gap-1">
      <DisplayItem item={slotItemInfo[0]}/>
      <DisplayItem item={slotItemInfo[1]}/>
      <DisplayItem item={slotItemInfo[2]}/>
      <DisplayItem item={slotItemInfo[3]} className="col-start-2"/>
    </div>
  );
}