"use client";

import { OptionType } from "@/types";
import { cn } from "@/lib/utils";
import { ItemImage, CraftGrid } from "@/components/wordle/wordle-ui";
import { useItemsStore } from "@/stores/use-items-store";
import { FoundCraft } from "@/stores/use-craft-finder-store";

interface ItemsBadgeListProps {
  items: string[];
  allItems: OptionType[];
  selectedItem?: string | null;
  onItemSelect?: (item: string) => void;
}

/**
 * Displays the distinct items of the set as clickable badges.
 * When onItemSelect is provided, clicking a badge selects/deselects it.
 */
export function ItemsBadgeList({ items, allItems, selectedItem, onItemSelect }: ItemsBadgeListProps) {
  if (items.length === 0) {
    return null;
  }
  const distinct = [...new Set(items)];

  return (
    <div className="flex flex-wrap gap-2">
      {distinct.map((itemName) => {
        const opt = allItems.find(i => i.value === itemName);
        if (!opt) {
          return null;
        }
        const isSelected = selectedItem === itemName;
        return (
          <button
            key={itemName}
            onClick={() => onItemSelect?.(itemName)}
            disabled={!onItemSelect}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 bg-card border rounded-md transition-all",
              onItemSelect ? "cursor-pointer" : "cursor-default",
              isSelected
                ? "border-blue-400 ring-2 ring-blue-400/50 bg-blue-900/20"
                : "border-secondary hover:border-gray-400"
            )}
          >
            <div className="w-6 h-6 shrink-0">
              <ItemImage img={opt.img} alt={opt.value} />
            </div>
            <span className="text-xs text-gray-300 font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface CraftFinderCounterProps {
  found: number;
  total: number;
}

/**
 * "X / N crafts trouvés" counter.
 */
export function CraftFinderCounter({ found, total }: CraftFinderCounterProps) {
  const done = found >= total && total > 0;
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-sm font-semibold tabular-nums",
      done ? "text-green-400" : "text-gray-300"
    )}>
      <span>{found}</span>
      <span className="text-gray-500">/</span>
      <span>{total}</span>
      <span className="text-xs font-normal text-gray-400 ml-1">craft{total > 1 ? "s" : ""} trouvé{found > 1 ? "s" : ""}</span>
    </div>
  );
}

interface FoundCraftsHistoryProps {
  foundCrafts: FoundCraft[];
}

/**
 * Shows a grid of found crafts, each with a readonly CraftGrid.
 */
export function FoundCraftsHistory({ foundCrafts }: FoundCraftsHistoryProps) {
  const { allItems } = useItemsStore();

  if (foundCrafts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {foundCrafts.map((craft, i) => {
        const outputItem = allItems.find(it => it.value === craft.outputItemName);
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <CraftGrid
              slots={craft.slots}
              allItems={allItems}
              readonly
              table={craft.table}
            />
            {outputItem && (
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-4 h-4 shrink-0">
                  <ItemImage img={outputItem.img} alt={outputItem.value} />
                </div>
                <span className="text-xs text-gray-400">{outputItem.label}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
