import { OptionType } from "@/types";
import { useItemsStore } from "@/stores/use-items-store";
import { DisplayItem } from "./display-item";

/**
 * Display the recipe as grinder pattern
 */
export function DisplayGrinderGrid({ recipe }: { recipe: OptionType[] }) {
  const { allItems } = useItemsStore();

  const slots = [0, 1].map(index => {
    const item = recipe.at(index);
    return item ? allItems.find((it) => it.value === item.value) : undefined;
  });

  return (
    <div className="flex flex-col gap-1 bg-background rounded-md p-1">
      <DisplayItem index={0} slot={slots[0]} />
      <DisplayItem index={1} slot={slots[1]} />
    </div>
  );
}
