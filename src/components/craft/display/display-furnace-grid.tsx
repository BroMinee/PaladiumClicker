import { useItemsStore } from "@/stores/use-items-store";
import { DisplayItem } from "./display-item";
import Image from "next/image";
import { OptionType } from "@/types";

/**
 * Display the recipe as furnace pattern (ingredient on top, coal fuel below)
 */
export function DisplayFurnaceGrid({ recipe }: { recipe: OptionType[] }) {
  const { allItems } = useItemsStore();

  const ingredient = (() => {
    const item = recipe.at(0);
    return item ? allItems.find((it) => it.value === item.value) : undefined;
  })();

  return (
    <div className="flex flex-col items-center gap-1 bg-background rounded-md p-1">
      <DisplayItem index={0} slot={ingredient} />
      <div className="w-12 aspect-square bg-secondary border border-gray-600 rounded-sm p-1 flex items-center justify-center opacity-60">
        <Image src="/AH_img/coal.webp" alt="coal" className="w-full h-full object-contain pixelated" width={48} height={48} unoptimized />
      </div>
    </div>
  );
}
