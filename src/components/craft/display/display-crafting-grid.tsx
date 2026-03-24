import { OptionType } from "@/types";
import { useItemsStore } from "@/stores/use-items-store";
import { DisplayItem } from "./display-item";

/**
 * Display the recipe as default crafting table pattern
 */
export function DisplayCraftingGrid({ recipe }: { recipe: OptionType[] }) {
  const { allItems } = useItemsStore();

  return (
    <div className="w-40 grid grid-cols-3 gap-1 p-1 bg-background rounded-md">
      {Array.from({ length: 9 }).map((_, index) => {
        const item = recipe.at(index);
        const gridItem = item ? allItems.find((it) => it.value === item.value) : undefined;
        return (
          <DisplayItem key={index} index={index} slot={gridItem} />
        );
      })}
    </div>
  );
}
