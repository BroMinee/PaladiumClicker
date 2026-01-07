"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FaTag, FaInfoCircle } from "react-icons/fa";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button-v2";
import { ProfileSaleCard } from "../shared/market-sell-cart.client";
import { AhInfoGetTotalBenefice } from "../ah/market-total-benefice.client";

/**
 * Display the player's market
 */
export function MarketSection() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b border-secondary pb-2 mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FaTag className="text-primary" />
          Hôtel des Ventes
        </h3>
        <div className='flex gap-2'>
          <span className="text-sm text-card-foreground bg-background px-3 py-1 rounded border">
            {playerInfo.ah.data.length} items
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <p>
          Bénéfice total - {" "}
          <AhInfoGetTotalBenefice />
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button onClick={() => undefined} size="icon" variant="outline">
              <FaInfoCircle className="inline-block h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            Somme d&apos;argent que vous gagneriez si vous vendiez tous vos objets en vente.
            <br />
            Ne prend pas en compte les lucky drawers.
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {playerInfo.ah.data.map((sale, index) => (
          <ProfileSaleCard key={`${sale.createdAt}-${index}`} sale={sale}/>
        ))}
      </div>
    </div>
  );
}
