import { PaladiumAhItemStat } from "@/types";
import { formatPrice } from "@/lib/misc";

/**
 * Display current sell of the given item as well as it's average price in the market.
 * @param itemInfo - The market item information
 */
export default async function QuantitySelectorDisplay({ itemInfo }: { itemInfo: PaladiumAhItemStat | null }) {
  return (
    <div className="flex flex-col lg:flex-row justify-evenly gap-3 pb-4 pt-3 py-2 pl-4 lg:pl-0">
      <p className="font-bold text-[20px]">
        <span className="font-bold text-[20px]">Quantité en vente actuellement: </span>
        <span
          className="font-bold text-[20px] text-primary">{`x${formatPrice(itemInfo?.quantityAvailable ?? 0)}`}</span>
      </p>
      <p className="font-bold text-[20px]">
        <span className="font-bold text-[20px]">Prix moyen actuellement en vente: </span>
        <span
          className="font-bold text-[20px] text-primary">{`${itemInfo ? formatPrice(Math.round((itemInfo.priceSum / (itemInfo.countListings === 0 ? 1 : itemInfo.countListings)) * 100) / 100) : 0} $`}</span>
      </p>
    </div>
  );
}