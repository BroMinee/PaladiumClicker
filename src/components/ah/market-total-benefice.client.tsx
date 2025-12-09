"use client";
import { formatPrice } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";

/**
 * Calculates and displays the total potential profit from the player's active AH listings.
 *
 * Notes:
 * - Excludes `"tile-luckydrawer"` from the total profit.
 */
export function AhInfoGetTotalBenefice() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo || !playerInfo.ah) {
    return null;
  }

  const totalCount = playerInfo.ah.data.reduce((acc, e) => e.item.name === "tile-luckydrawer" ? acc : acc + e.price * e.item.quantity, 0);
  return <span className="text-primary">
    {formatPrice(totalCount)}{" $"}
  </span>;
}