"use client";

import { useEffect, useRef, useState } from "react";
import { CraftGrid } from "@/components/wordle/wordle-ui";
import { SlotValue } from "@/components/wordle/wordle-utils";
import { useCraftFinderStore } from "@/stores/use-craft-finder-store";
import { useItemsStore } from "@/stores/use-items-store";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";
import { CraftingTableName } from "@/types";
import { Button } from "@/components/ui/button-v2";
import { ItemsBadgeList } from "./craft-finder-ui";
import { cn } from "@/lib/utils";
import { isCraftValid } from "@/lib/craft-finder-utils";
import { UnOptimizedImage } from "../ui/image-loading";

interface CraftFinderGameProps {
  onMatch: (slots: SlotValue[]) => void;
  table: CraftingTableName;
}

/**
 * Interactive craft-finder board.
 * Interaction: click a badge to select an item, then click a slot to place it.
 * Validates on every slot change — no submit button.
 */
export function CraftFinderGame({ onMatch, table }: CraftFinderGameProps) {
  const store = useCraftFinderStore();
  const { allItems } = useItemsStore();
  const { allCrafts } = useAllCraftsStore();

  const { currentSlots, items, gameState, isFlashing, isWaiting, flashingItem, alreadyCompleted } = store;
  const isFinished = gameState === "won" || alreadyCompleted;

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const isWaitingRef = useRef(isWaiting);
  isWaitingRef.current = isWaiting;

  // Auto-validate on every slot change (currentSlots only — avoids re-triggering on isWaiting flip)
  useEffect(() => {
    if (isFinished || isWaitingRef.current) {
      return;
    }
    if (currentSlots.every(s => s === null)) {
      return;
    }
    const itemSet = new Set(items);
    const slotsUseOnlySetItems = currentSlots.every(s => s === null || itemSet.has(s));
    if (slotsUseOnlySetItems && allCrafts.find(c => isCraftValid(c, currentSlots)) !== undefined) {
      onMatch([...currentSlots]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlots]);

  const isBlocked = isFinished || isWaiting || isFlashing;

  const handleBadgeSelect = (itemName: string) => {
    if (isBlocked) {
      return;
    }
    setSelectedItem(prev => prev === itemName ? null : itemName);
  };

  const handleSlotClick = (index: number) => {
    if (isBlocked) {
      return;
    }
    if (selectedItem !== null) {
      const next = [...currentSlots];
      next[index] = selectedItem;
      store.setCurrentSlots(next);
    }
  };

  const handleSlotRightClick = (index: number) => {
    if (isBlocked) {
      return;
    }
    if (currentSlots[index] !== null) {
      const next = [...currentSlots];
      next[index] = null;
      store.setCurrentSlots(next);
    }
  };

  const handleSlotMiddleClick = (index: number) => {
    if (isBlocked || currentSlots[index] === null) {
      return;
    }
    setSelectedItem(currentSlots[index]);
  };

  return (
    <>
      <ItemsBadgeList
        items={items}
        allItems={allItems}
        selectedItem={selectedItem}
        onItemSelect={isBlocked ? undefined : handleBadgeSelect}
      />

      <div className="flex gap-3">
        <div className={cn(
          "flex flex-col gap-1 relative rounded-lg transition-all duration-300",
          isFlashing && "ring-2 ring-green-500 shadow-lg shadow-green-500/30"
        )}>
          <CraftGrid
            table={table}
            slots={currentSlots}
            allItems={allItems}
            onSlotClick={handleSlotClick}
            onSlotRightClick={handleSlotRightClick}
            onSlotMiddleClick={handleSlotMiddleClick}
            activeSlot={null}
            readonly={false}
          />
          {isFlashing && (
            <div className="absolute inset-0 rounded-lg bg-green-500/10 pointer-events-none" />
          )}
          {flashingItem && (
            <div className="absolute inset-0 rounded-lg flex items-center justify-center pointer-events-none">
              <UnOptimizedImage
                src={`https://palatracker.bromine.fr/AH_img/${flashingItem.img}`}
                alt={flashingItem.name}
                className="animate-craft-pop w-20 h-20 pixelated drop-shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                width={0} height={0}
              />
            </div>
          )}
        </div>
        {!isFinished && (
          <div className="flex flex-col items-stretch self-stretch">
            <Button
              onClick={() => store.setCurrentSlots(currentSlots.map(() => null))}
              disabled={currentSlots.every(s => s === null) || isWaiting}
              className="px-4 py-2 rounded-lg font-semibold transition-colors text-xs"
              variant="secondary"
            >
              Tout effacer
            </Button>
          </div>
        )}
      </div>

      {selectedItem && (
        <p className="text-xs text-blue-400">
          {(() => {
            const opt = allItems.find(i => i.value === selectedItem);
            return opt ? `Clique sur un slot pour placer "${opt.label}"` : "Clique sur un slot";
          })()}
        </p>
      )}
    </>
  );
}
