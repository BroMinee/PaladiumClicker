import { CraftSectionEnum, OptionType } from "@/types";
import { generateCraftUrl } from "@/lib/misc";
import { useCraftRecipeStore } from "@/stores/use-craft-store";
import { ClickableLink } from "@/components/ui/clickable-link";
import { UnOptimizedImage } from "@/components/ui/image-loading";

/**
 * Display a simple item slot
 */
export function DisplayItem({ index, slot, count }: { index: number; slot: OptionType | undefined, count?: number }) {
  const { language } = useCraftRecipeStore();
  return (
    <div
      key={slot ? slot.value + index : "empty-" + index}
      title={(language === "fr" ? slot?.label2 : slot?.label) ?? "(Vide)"}
      className="w-12 aspect-square bg-secondary border border-gray-600 rounded-sm p-1 flex items-center justify-center"
    >
      <div className="w-full h-full text-blue-300 relative">
        {slot && slot.value !== "air" &&
          <ClickableLink href={generateCraftUrl(slot.value, 1, CraftSectionEnum.recipe)}>
            <UnOptimizedImage src={`/AH_img/${slot.img}`} alt={slot.value}
              className="w-full h-full object-contain pixelated rounded-sm transition-transform duration-300 hover:scale-125"
              width={48} height={48}
            />
          </ClickableLink>
        }
        <span className="top-6 left-9 pr-2 pb-0 absolute text-xl font-bold pointer-events-none">{count}</span>
      </div>
    </div>
  );
}
