import { OptionType } from "@/types";
import { useItemsStore } from "@/stores/use-items-store";
import { DisplayItem } from "./display-item";

/**
 * Display the recipe as alchemy creator pattern
 */
export function DisplayAlchemyCreatorGrid({ recipe }: { recipe: OptionType[] }) {
  const { allItems } = useItemsStore();

  const slots = [0, 1, 2, 3].map(index => {
    const item = recipe.at(index);
    return item ? allItems.find((it) => it.value === item.value) : undefined;
  });

  const itemSize = 48;
  const pad = 4;
  const gap = 4;
  const hLineY = pad + itemSize + 16;
  const slot4Top = hLineY + 16;
  const containerW = 160;
  const containerH = slot4Top + itemSize + pad;

  const cx1 = pad + itemSize / 2;
  const cx2 = pad + itemSize + gap + itemSize / 2;
  const cx3 = pad + 2 * (itemSize + gap) + itemSize / 2;

  return (
    <div className="relative bg-background rounded-md" style={{ width: containerW, height: containerH }}>
      <svg className="absolute inset-0 pointer-events-none text-gray-500" width={containerW} height={containerH}>
        <line x1={cx1} y1={pad + itemSize} x2={cx1} y2={hLineY} stroke="currentColor" strokeWidth={2} />
        <line x1={cx2} y1={pad + itemSize} x2={cx2} y2={hLineY} stroke="currentColor" strokeWidth={2} />
        <line x1={cx3} y1={pad + itemSize} x2={cx3} y2={hLineY} stroke="currentColor" strokeWidth={2} />
        <line x1={cx1} y1={hLineY} x2={cx3} y2={hLineY} stroke="currentColor" strokeWidth={2} />
        <line x1={cx2} y1={hLineY} x2={cx2} y2={slot4Top} stroke="currentColor" strokeWidth={2} />
      </svg>

      <div className="absolute" style={{ top: pad, left: pad }}><DisplayItem index={0} slot={slots[0]} /></div>
      <div className="absolute" style={{ top: pad, left: pad + itemSize + gap }}><DisplayItem index={1} slot={slots[1]} /></div>
      <div className="absolute" style={{ top: pad, left: pad + 2 * (itemSize + gap) }}><DisplayItem index={2} slot={slots[2]} /></div>

      <div className="absolute" style={{ top: slot4Top, left: (containerW - itemSize) / 2 }}>
        <DisplayItem index={3} slot={slots[3]} />
      </div>
    </div>
  );
}
