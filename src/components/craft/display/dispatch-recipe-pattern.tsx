import { CraftingTableName, NodeType } from "@/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/shared/hover";
import { CraftingArrow } from "@/components/shared/crafting-arrow.client";
import { DisplayItem } from "./display-item";
import { DisplayCraftingGrid } from "./display-crafting-grid";
import { DisplayPalamachineGrid } from "./display-palamachine-grid";
import { DisplayAlchemyCreatorGrid } from "./display-alchemy-creator-grid";
import { DisplayGrinderGrid } from "./display-grinder-grid";
import { DisplayCauldronGrid } from "./display-cauldron-grid";
import { DisplayFurnaceGrid } from "./display-furnace-grid";
import { UnOptimizedImage } from "@/components/ui/image-loading";

const TABLE_ICONS: Record<CraftingTableName, string> = {
  "crafting table":  "crafting_table_front.webp",
  "furnace":         "furnace_front_on.webp",
  "grinder":         "grinder_block_front.webp",
  "cauldron":        "cauldron.webp",
  "alchemy creator": "alchemy_creator_block.webp",
  "palamachine":     "paladium_machine_block_top.webp",
};

/**
 * Display the correct crafting recipe according to output.table type
 */
export function DispatchRecipePattern({ recipe, output }: { recipe: NodeType[], output: NodeType }) {
  const renderGrid = () => {
    switch (output.table) {
    case "palamachine":
      return <DisplayPalamachineGrid recipe={recipe} />;
    case "alchemy creator":
      return <DisplayAlchemyCreatorGrid recipe={recipe} />;
    case "grinder":
      return <DisplayGrinderGrid recipe={recipe} />;
    case "cauldron":
      return <DisplayCauldronGrid recipe={recipe} />;
    case "furnace":
      return <DisplayFurnaceGrid recipe={recipe} />;
    default: // crafting_table or undefined
      return <DisplayCraftingGrid recipe={recipe} />;
    }
  };

  const tableIcon = output.table ? TABLE_ICONS[output.table] : null;

  return (
    <div className="relative flex flex-row items-center gap-2">
      {tableIcon && (
        <HoverCard className="absolute -top-5 -left-5">
          <HoverCardTrigger asChild>
            <div className="w-8 h-8 rounded-full bg-card border border-secondary justify-center p-1">
              <UnOptimizedImage src={`/AH_img/${tableIcon}`} alt={output.table ?? ""} width={24} height={24} className="w-full h-full pixelated"/>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto px-3 py-2 text-sm font-medium capitalize">
            {output.table}
          </HoverCardContent>
        </HoverCard>
      )}
      {renderGrid()}
      <CraftingArrow />
      <DisplayItem index={0} slot={output} count={recipe[0].count} />
    </div>
  );
}
