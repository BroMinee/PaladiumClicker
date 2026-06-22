import { CraftGrid, ItemPickerPanel, useItemSearch } from "@/components/wordle/wordle-ui";
import { SlotValue, filterItemsUsedInCrafts } from "@/components/wordle/wordle-utils";
import { useItemsStore } from "@/stores/use-items-store";
import { useWordleStore } from "@/stores/use-wordle-store";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button-v2";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";

interface GameProps {
  handleSubmitPreCheck: () => [boolean, string],
  handleSubmitCallback: () => void,
  pendingAttemptRef: React.RefObject<SlotValue[] | null>,
}

/**
 * Interactive wordle game board: manages slot selection, item search, auto-fill, and guess submission.
 * Delegates pre-check and result handling to the parent via callbacks.
 */
export function WordleGame({ pendingAttemptRef, handleSubmitPreCheck, handleSubmitCallback }: GameProps) {
  const store = useWordleStore();
  const { allCrafts } = useAllCraftsStore();

  const { attempts, currentSlots, gameState, alreadyCompleted, isWaiting, setIsWaiting, table } = store;
  const { allItems } = useItemsStore();
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const craftItems = useMemo(() => filterItemsUsedInCrafts(allItems, allCrafts), [allItems, allCrafts]);
  const filteredItems = useItemSearch(craftItems, searchTerm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const isFinished = gameState === "won" || alreadyCompleted;

  useEffect(() => {
    if (activeSlot !== null) {
      searchRef.current?.focus();
    }
  }, [activeSlot]);

  const handleSlotClick = (index: number) => {
    if (isFinished || isWaiting) {
      return;
    }
    setActiveSlot(prev => prev === index ? null : index);
  };

  const handleSlotMiddleClick = (index: number) => {
    if (isFinished || isWaiting || activeSlot === null || activeSlot === index) {
      return;
    }
    const item = currentSlots[index];
    if (item === null) {
      return;
    }
    const newSlots = [...currentSlots];
    newSlots[activeSlot] = item;
    store.setCurrentSlots(newSlots);
  };

  const handleSlotRightClick = (index: number) => {
    if (isFinished || isWaiting) {
      return;
    }
    if (currentSlots[index] !== null) {
      const newSlots = [...currentSlots];
      newSlots[index] = null;
      store.setCurrentSlots(newSlots);
    }
    setActiveSlot(index);
  };

  const handleItemSelect = (itemName: SlotValue) => {
    if (activeSlot === null || isWaiting) {
      return;
    }
    const newSlots = [...currentSlots];
    newSlots[activeSlot] = itemName;
    store.setCurrentSlots(newSlots);
    const nextEmpty = newSlots.findIndex((s, i) => i > activeSlot && s === null);
    setActiveSlot(nextEmpty !== -1 ? nextEmpty : null);
  };

  const handleAutoFill = () => {
    const filled = [...currentSlots];
    for (let i = 0; i < filled.length; i++) {
      for (const attempt of attempts) {
        if (attempt.result[i] === "correct") {
          filled[i] = attempt.slots[i];
          break;
        }
      }
    }
    store.setCurrentSlots(filled);
  };

  const handleSubmit = () => {
    if (gameState !== "playing" || isWaiting) {
      return;
    }
    const [isValid, errorMsg] = handleSubmitPreCheck();
    if (!isValid) {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      setSubmitError(errorMsg);
      setErrorVisible(true);
      errorTimerRef.current = setTimeout(() => setErrorVisible(false), 5000);
      return;
    }
    setErrorVisible(false);
    setSubmitError(null);
    pendingAttemptRef.current = [...currentSlots];
    setIsWaiting(true);
    handleSubmitCallback();
    setActiveSlot(null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Tentative {attempts.length + 1}
          {isWaiting && <span className="ml-2 text-xs text-gray-500 animate-pulse">Vérification...</span>}
        </p>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-1">
          <CraftGrid
            table={table}
            slots={currentSlots}
            allItems={allItems}
            onSlotClick={handleSlotClick}
            onSlotRightClick={handleSlotRightClick}
            onSlotMiddleClick={handleSlotMiddleClick}
            activeSlot={activeSlot} readonly={false}/>
        </div>
        <div className="flex flex-col items-stretch justify-evenly self-stretch">
          <Button
            onClick={handleSubmit}
            disabled={currentSlots.every(s => s === null) || isWaiting}
            className="px-4 py-2 rounded-lg font-semibold transition-colors"
            variant={!isWaiting && currentSlots.some(s => s !== null) ? "primary" : "secondary"}
          >
            {isWaiting ? "…" : "Valider"}
          </Button>
          {!isFinished && (
            <Button
              onClick={handleAutoFill}
              disabled={!attempts.some(a => a.result.some(r => r === "correct"))}
              className="px-4 py-2 rounded-lg font-semibold transition-colors text-xs"
              variant="secondary"
            >
              Auto-fill
            </Button>
          )}
          {!isFinished && (
            <Button
              onClick={() => store.setCurrentSlots(currentSlots.map(() => null))}
              disabled={currentSlots.every(s => s === null) || isWaiting}
              className="px-4 py-2 rounded-lg font-semibold transition-colors text-xs"
              variant="secondary"
            >
              Tout effacer
            </Button>
          )}
        </div>
      </div>
      {submitError && (
        <div
          className={`flex items-center gap-2 px-3 py-2 bg-red-900/40 border border-red-600 rounded-md transition-opacity duration-500 ${errorVisible ? "opacity-100" : "opacity-0"}`}
          onTransitionEnd={() => {
            if (!errorVisible) {
              setSubmitError(null);
            }
          }}
        >
          <span className="text-red-400 text-base shrink-0">✕</span>
          <p className="text-sm text-red-300 font-medium">{submitError}</p>
        </div>
      )}

      {activeSlot !== null && !isWaiting && (
        <ItemPickerPanel
          allItems={craftItems}
          attempts={attempts}
          currentSlots={currentSlots}
          activeSlot={activeSlot}
          searchTerm={searchTerm}
          searchRef={searchRef}
          filteredItems={filteredItems}
          onSearchChange={setSearchTerm}
          onItemSelect={handleItemSelect}
          onActiveSlotChange={setActiveSlot}
        />
      )}
    </>
  );
}