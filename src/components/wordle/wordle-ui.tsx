"use client";

import { useRef, useEffect, useMemo, RefObject, useState } from "react";
import Image from "next/image";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { CraftingTableName, OptionType } from "@/types";
import { cn } from "@/lib/utils";
import { SlotValue, TileStatus, Attempt, searchDistance } from "./wordle-utils";
import { useItemsStore } from "@/stores/use-items-store";
import { useWordleStore } from "@/stores/use-wordle-store";
import { TABLE_ICONS } from "@/components/craft/display/dispatch-recipe-pattern";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/shared/hover";
import { ChevronDown, Reply } from "lucide-react";

export const CANVAS_SIZE = 160;
const GRID_COLS = 10;
const GRID_ROWS = 10;
const TILE_W = CANVAS_SIZE / GRID_COLS;
const TILE_H = CANVAS_SIZE / GRID_ROWS;

/**
 * Renders a pixelated item image from /AH_img/.
*/
export function ItemImage({ img, alt }: { img: string; alt: string }) {
  return (
    <Image
      src={`/AH_img/${img}`}
      alt={alt}
      width={40}
      height={40}
      className="w-full h-full object-contain pixelated"
      unoptimized={true}
    />
  );
}

export interface SlotProps {
  itemName: SlotValue;
  allItems: OptionType[];
  status?: TileStatus;
  onClick?: () => void;
  onRightClick?: () => void;
  onMiddleClick?: () => void;
  isActive?: boolean;
  readonly: boolean;
}

/**
 * Single craft grid slot with color-coded status.
 */
export function Slot({ itemName, allItems, status, onClick, onRightClick, onMiddleClick, isActive, readonly }: SlotProps) {
  const item = itemName ? allItems.find(i => i.value === itemName) : undefined;

  const bgClass =
    status === "correct" ? "bg-green-700 border-green-500" :
      status === "present" ? "bg-yellow-600 border-yellow-400" :
        status === "absent" ? "bg-gray-800 border-gray-600" :
          "bg-secondary border-gray-600";

  return (
    <button
      onClick={onClick}
      onContextMenu={onRightClick ? (e) => {
        e.preventDefault(); onRightClick();
      } : undefined}
      onMouseDown={onMiddleClick ? (e) => {
        if (e.button === 1) {
          e.preventDefault();
          onMiddleClick();
        }
      } : undefined}
      disabled={readonly}
      className={cn(
        "aspect-square border rounded-sm p-1 flex items-center justify-center transition-all duration-150 w-12",
        bgClass,
        isActive && "ring-2 ring-blue-400",
        !readonly && "hover:border-gray-400 cursor-pointer",
        readonly && "cursor-default"
      )}
    >
      {item && <ItemImage img={item.img} alt={item.value} />}
    </button>
  );
}

export interface CraftGridProps {
  slots: SlotValue[];
  allItems: OptionType[];
  results?: TileStatus[];
  onSlotClick?: (index: number) => void;
  onSlotRightClick?: (index: number) => void;
  onSlotMiddleClick?: (index: number) => void;
  activeSlot?: number | null;
  readonly: boolean;
  table: CraftingTableName;
}

/**
 * Builds Slot props for a given index - shared by all grid layout variants.
 */
function makeSlotProps(
  i: number,
  { slots, allItems, results, onSlotClick, onSlotRightClick, onSlotMiddleClick, activeSlot, readonly }: Omit<CraftGridProps, "table">,
): SlotProps {
  return {
    itemName: slots[i] ?? null,
    allItems,
    status: results?.[i],
    onClick: () => onSlotClick?.(i),
    onRightClick: onSlotRightClick ? () => onSlotRightClick(i) : undefined,
    onMiddleClick: onSlotMiddleClick ? () => onSlotMiddleClick(i) : undefined,
    isActive: activeSlot === i,
    readonly,
  };
}

function FurnaceWordleGrid(props: Omit<CraftGridProps, "table">) {
  return (
    <div className="flex flex-col items-center gap-1 bg-background rounded-md p-2 w-fit">
      <Slot {...makeSlotProps(0, props)} />
      <div className="w-12 aspect-square bg-secondary border border-gray-600 rounded-sm p-1 flex items-center justify-center opacity-60">
        <Image src="/AH_img/coal.webp" alt="coal" className="w-full h-full object-contain pixelated" width={48} height={48} unoptimized />
      </div>
    </div>
  );
}

function GrinderWordleGrid(props: Omit<CraftGridProps, "table">) {
  return (
    <div className="flex flex-col gap-1 bg-background rounded-md p-2 w-fit">
      <Slot {...makeSlotProps(0, props)} />
      <Slot {...makeSlotProps(1, props)} />
    </div>
  );
}

function CauldronWordleGrid(props: Omit<CraftGridProps, "table">) {
  return (
    <div className="flex flex-row gap-1 bg-background rounded-md p-2 w-fit">
      <Slot {...makeSlotProps(0, props)} />
      <Slot {...makeSlotProps(1, props)} />
    </div>
  );
}

const ALCHEMY_ITEM_SIZE = 48;
const ALCHEMY_PAD = 4;
const ALCHEMY_GAP = 4;
const ALCHEMY_H_LINE_Y = ALCHEMY_PAD + ALCHEMY_ITEM_SIZE + 16;
const ALCHEMY_SLOT4_TOP = ALCHEMY_H_LINE_Y + 16;
const ALCHEMY_W = 160;
const ALCHEMY_H = ALCHEMY_SLOT4_TOP + ALCHEMY_ITEM_SIZE + ALCHEMY_PAD;
const ALCHEMY_CX = [0, 1, 2].map(n => ALCHEMY_PAD + n * (ALCHEMY_ITEM_SIZE + ALCHEMY_GAP) + ALCHEMY_ITEM_SIZE / 2);

function AlchemyCreatorWordleGrid(props: Omit<CraftGridProps, "table">) {
  return (
    <div className="relative bg-background rounded-md" style={{ width: ALCHEMY_W, height: ALCHEMY_H }}>
      <svg className="absolute inset-0 pointer-events-none text-gray-500" width={ALCHEMY_W} height={ALCHEMY_H}>
        {ALCHEMY_CX.map(cx => (
          <line key={cx} x1={cx} y1={ALCHEMY_PAD + ALCHEMY_ITEM_SIZE} x2={cx} y2={ALCHEMY_H_LINE_Y} stroke="currentColor" strokeWidth={2} />
        ))}
        <line x1={ALCHEMY_CX[0]} y1={ALCHEMY_H_LINE_Y} x2={ALCHEMY_CX[2]} y2={ALCHEMY_H_LINE_Y} stroke="currentColor" strokeWidth={2} />
        <line x1={ALCHEMY_CX[1]} y1={ALCHEMY_H_LINE_Y} x2={ALCHEMY_CX[1]} y2={ALCHEMY_SLOT4_TOP} stroke="currentColor" strokeWidth={2} />
      </svg>
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute" style={{ top: ALCHEMY_PAD, left: ALCHEMY_PAD + i * (ALCHEMY_ITEM_SIZE + ALCHEMY_GAP) }}>
          <Slot {...makeSlotProps(i, props)} />
        </div>
      ))}
      <div className="absolute" style={{ top: ALCHEMY_SLOT4_TOP, left: (ALCHEMY_W - ALCHEMY_ITEM_SIZE) / 2 }}>
        <Slot {...makeSlotProps(3, props)} />
      </div>
    </div>
  );
}

const PALAMACHINE_POSITIONS = [
  { top: 5,   left: 55  },
  { top: 50,  left: 105 },
  { top: 105, left: 85  },
  { top: 105, left: 25  },
  { top: 50,  left: 5   },
];

function PalamachineWordleGrid(props: Omit<CraftGridProps, "table">) {
  return (
    <div className="relative w-40 h-40 p-3 bg-background rounded-md">
      <div className="absolute rounded-full border-2 pointer-events-none border-bg-card" style={{ width: 112, height: 112, top: 24, left: 24 }} />
      {PALAMACHINE_POSITIONS.map((pos, i) => (
        <div key={i} className="absolute" style={{ top: pos.top, left: pos.left }}>
          <Slot {...makeSlotProps(i, props)} />
        </div>
      ))}
    </div>
  );
}

/**
 * 3×3 or dispatched crafting grid - adapts layout to the craft table type.
 */
export function CraftGrid({ table, ...props }: CraftGridProps) {

  const renderGrid = () => {
    switch (table) {
    case "furnace":
      return <FurnaceWordleGrid {...props} />;
    case "grinder":
      return <GrinderWordleGrid {...props} />;
    case "cauldron":
      return <CauldronWordleGrid {...props} />;
    case "alchemy creator":
      return <AlchemyCreatorWordleGrid {...props} />;
    case "palamachine":
      return <PalamachineWordleGrid {...props} />;
    default:
      return (
        <div className={"grid grid-cols-3 bg-background rounded-md w-fit gap-1 p-2"}>
          {Array.from({ length: 9 }).map((_, i) => (
            <Slot key={i} {...makeSlotProps(i, props)} />
          ))}
        </div>
      );
    }
  };

  const tableIcon = table ? TABLE_ICONS[table] : null;
  return (
    <div className="relative flex flex-row items-center gap-2">
      {tableIcon && (
        <HoverCard className="absolute -top-5 -left-5 z-10">
          <HoverCardTrigger asChild>
            <div className="w-8 h-8 rounded-full bg-card border border-secondary justify-center p-1">
              <UnOptimizedImage src={`/AH_img/${tableIcon}`} alt={table ?? ""} width={24} height={24} className="w-full h-full pixelated"/>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto px-3 py-2 text-sm font-medium capitalize">
            {table}
          </HoverCardContent>
        </HoverCard>
      )}
      {renderGrid()}
    </div>
  );
}

/** Canvas-based progressive image reveal: tiles are uncovered in seeded-shuffle order. */
export function ProgressiveItemReveal({ src, revealPercent, tileOrder }: { src: string; revealPercent: number; tileOrder: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.fillStyle = "#111118";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const revealCount = Math.floor(GRID_COLS * GRID_ROWS * revealPercent / 100);
    for (let k = 0; k < revealCount; k++) {
      const idx = tileOrder[k];
      const col = idx % GRID_COLS;
      const row = Math.floor(idx / GRID_COLS);
      ctx.clearRect(col * TILE_W, row * TILE_H, TILE_W, TILE_H);
    }
  }, [revealPercent, tileOrder]);

  return (
    <div className="relative rounded-lg border border-secondary overflow-hidden" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
      <UnOptimizedImage src={src} width={CANVAS_SIZE} height={CANVAS_SIZE} alt="item" className="pixelated w-full h-full object-contain" />
      <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="absolute inset-0" />
    </div>
  );
}

/**
 * Filters and ranks items by relevance to a search term.
 */
export function useItemSearch(allItems: OptionType[], searchTerm: string): OptionType[] {
  return useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return allItems.slice(0, 36);
    }
    const threshold = Math.max(1, Math.floor(term.length / 3));
    return allItems
      .map(item => {
        const en = item.label.toLowerCase();
        const fr = item.label2.toLowerCase();
        const val = item.value.toLowerCase();
        const candidates = [en, fr, val, ...en.split(/\s+/), ...fr.split(/\s+/)];
        const prefixMatch = candidates.some(c => c.startsWith(term));
        const minDist = Math.min(...candidates.map(c => searchDistance(term, c)));
        if (!prefixMatch && minDist > threshold) {
          return null;
        }
        const fullDist = Math.min(searchDistance(term, en), searchDistance(term, fr));
        return { item, minDist, fullDist };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .sort((a, b) => a.minDist !== b.minDist ? a.minDist - b.minDist : a.fullDist - b.fullDist)
      .slice(0, 36)
      .map(e => e.item);
  }, [searchTerm, allItems]);
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  color?: "orange" | "blue";
}

/**
 * Labelled toggle switch.
 */
export function ToggleSwitch({ checked, onChange, label, color = "orange" }: ToggleSwitchProps) {
  const activeColor = color === "blue" ? "bg-blue-500" : "bg-orange-500";
  const activeLabelColor = color === "blue" ? "text-blue-400" : "text-orange-400";
  return (
    <button onClick={onChange} className="flex items-center justify-between gap-2 text-sm select-none w-full">
      <span className={cn("text-xs font-medium", checked ? activeLabelColor : "text-gray-400")}>{label}</span>
      <div className={cn("relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0", checked ? activeColor : "bg-gray-600")}>
        <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200", checked ? "translate-x-5" : "translate-x-0.5")} />
      </div>
    </button>
  );
}

interface ItemPickerPanelProps {
  allItems: OptionType[];
  attempts: Attempt[];
  currentSlots: SlotValue[];
  activeSlot: number;
  searchTerm: string;
  searchRef: RefObject<HTMLInputElement | null>;
  filteredItems: OptionType[];
  onSearchChange: (term: string) => void;
  onItemSelect: (item: SlotValue) => void;
  onActiveSlotChange: (index: number) => void;
}

/**
 * Search + reuse panel shown when a slot is active.
 */
export function ItemPickerPanel({ allItems, attempts, currentSlots, activeSlot, searchTerm, searchRef, filteredItems, onSearchChange, onItemSelect, onActiveSlotChange }: ItemPickerPanelProps) {
  const setCurrentSlots = useWordleStore(s => s.setCurrentSlots);
  const hasHistory = attempts.length > 0 || currentSlots.some(s => s !== null);
  const historyScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyScrollRef.current) {
      historyScrollRef.current.scrollTop = historyScrollRef.current.scrollHeight;
    }
  }, [attempts.length]);
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("wordle-history-open") !== "false";
  });

  const toggleOpen = (open: boolean) => {
    setIsOpen(open);
    localStorage.setItem("wordle-history-open", String(open));
  };

  return (
    <div className="bg-card border border-secondary rounded-lg overflow-hidden">
      {hasHistory && (
        <details open={isOpen} className="border-b border-secondary" onToggle={e => toggleOpen(e.currentTarget.open)}>
          <summary className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-200 cursor-pointer select-none list-none flex items-center gap-1">
            <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}/>
            Réutiliser les tentatives
          </summary>
          <div ref={historyScrollRef} className="px-3 pb-3 pt-1 space-y-2 max-h-32 overflow-y-auto">
            {attempts.map((attempt, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4 shrink-0 text-center">{i + 1}</span>
                <div className="flex gap-0.5">
                  {attempt.slots.map((slot, j) => {
                    const item = slot ? allItems.find(it => it.value === slot) : undefined;
                    return (
                      <button
                        key={j}
                        onClick={() => slot && onItemSelect(slot)}
                        disabled={!slot}
                        title={item ? `${item.label} / ${item.label2}` : undefined}
                        className={cn(
                          "w-8 h-8 border rounded-sm p-0.5 flex items-center justify-center transition-colors",
                          attempt.result[j] === "correct" ? "bg-green-700/40 border-green-600" :
                            attempt.result[j] === "present" ? "bg-yellow-600/40 border-yellow-500" :
                              "bg-gray-800/40 border-gray-700",
                          slot ? "hover:border-blue-400 cursor-pointer" : "cursor-default opacity-25"
                        )}
                      >
                        {item && <ItemImage img={item.img} alt={item.value} />}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentSlots([...attempt.slots])}
                  className="ml-1 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                >
                  <Reply />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary w-4 shrink-0 text-center font-bold">+</span>
              <div className="flex gap-0.5">
                {currentSlots.map((slot, j) => {
                  const item = slot ? allItems.find(it => it.value === slot) : undefined;
                  return (
                    <button
                      key={j}
                      onClick={() => slot ? onItemSelect(slot) : onActiveSlotChange(j)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        const next = [...currentSlots];
                        next[j] = null;
                        setCurrentSlots(next);
                        onActiveSlotChange(j);
                      }}
                      title={item ? `${item.label} / ${item.label2}` : undefined}
                      className={cn(
                        "w-8 h-8 border rounded-sm p-0.5 flex items-center justify-center transition-colors cursor-pointer",
                        j === activeSlot ? "border-blue-400 bg-blue-900/30" : "border-gray-600 bg-secondary hover:border-blue-400",
                        !slot && "opacity-25"
                      )}
                    >
                      {item && <ItemImage img={item.img} alt={item.value} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </details>
      )}
      <div className="p-3 space-y-2">
        <input
          ref={searchRef}
          type="text"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Rechercher un item... (EN ou FR)"
          className="w-full bg-background border border-secondary rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <div className="max-h-44 overflow-y-auto space-y-px">
          <button
            onClick={() => onItemSelect(null)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors text-left"
          >
            <span className="w-7 h-7 shrink-0 flex items-center justify-center text-base">✕</span>
            <span>Vider la case</span>
          </button>
          {filteredItems.map(item => (
            <button
              key={item.value}
              onClick={() => onItemSelect(item.value)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary transition-colors text-left"
            >
              <div className="w-7 h-7 shrink-0 p-0.5">
                <ItemImage img={item.img} alt={item.value} />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-xs text-gray-400 ml-0.5">/ {item.label2}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AttemptsHistoryProps {
  attempts: Attempt[];
  maxAttempts?: number;
  gridLayout?: boolean;
  table: CraftingTableName;
}

/**
 * History strip of past attempt grids shown at the bottom.
 */
export function AttemptsHistory({ attempts, maxAttempts, gridLayout, table }: AttemptsHistoryProps) {
  const { allItems } = useItemsStore();
  if (attempts.length === 0 && !maxAttempts) {
    return null;
  }
  return (
    <div className="shrink-0">
      <div className={cn(gridLayout ? "grid grid-cols-6 gap-3" : "flex flex-wrap gap-3")}>
        {attempts.map((attempt, i) => {
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">Tentative {i + 1}</span>
              <CraftGrid
                slots={attempt.slots}
                allItems={allItems}
                results={attempt.result}
                readonly
                table={table}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
