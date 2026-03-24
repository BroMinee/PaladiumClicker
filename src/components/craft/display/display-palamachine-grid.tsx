import { OptionType } from "@/types";
import { useItemsStore } from "@/stores/use-items-store";
import { DisplayItem } from "./display-item";

// Slots 0–4 placed clockwise starting from the top (regular pentagon vertices)
const PALAMACHINE_POSITIONS = [
  { top: 5,   left: 55  }, // slot1 – top
  { top: 50,  left: 105 }, // slot2 – top-right
  { top: 105, left: 85  }, // slot3 – bottom-right
  { top: 105, left: 25  }, // slot4 – bottom-left
  { top: 50,  left: 5   }, // slot5 – top-left
];

/**
 * Display the recipe as palamachine pattern
 */
export function DisplayPalamachineGrid({ recipe }: { recipe: OptionType[] }) {
  const { allItems } = useItemsStore();

  return (
    <div className="relative w-40 h-40 p-3 bg-background rounded-md">
      {/* Ring centered on the div, radius ≈ 56px (passes through slot centers) */}
      <div
        className="absolute rounded-full border-2 pointer-events-none border-bg-card"
        style={{ width: 112, height: 112, top: 24, left: 24 }}
      />
      {PALAMACHINE_POSITIONS.map((pos, index) => {
        const item = recipe.at(index);
        const gridItem = item ? allItems.find((it) => it.value === item.value) : undefined;
        return (
          <div key={index} className="absolute" style={{ top: pos.top, left: pos.left }}>
            <DisplayItem index={index} slot={gridItem} />
          </div>
        );
      })}
    </div>
  );
}
