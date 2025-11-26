"use client";

import { getAllItemsServerAction } from "@/lib/api/apiServerAction";
import { AhItemType, OptionType } from "@/types";
import { useEffect, useState } from "react";

import { UnOptimizedImage } from "@/components/ui/image-loading";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FaTag, FaInfoCircle } from "react-icons/fa";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { ClickableLink } from "@/components/ui/clickable-link";
import { generateAhShopUrl, safeJoinPaths } from "@/lib/misc";
import { AhInfoGetTotalBenefice } from "@/components/Profil/AhInfoClient";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button-v2";
import { constants } from "@/lib/constants";

/**
 * Display the player's market
 */
export function MarketSection() {
  const { data: playerInfo } = usePlayerInfoStore();

  const [itemList, setItemList] = useState<OptionType[]>([]);

  useEffect(() => {
    getAllItemsServerAction().then(setItemList);
  }, [setItemList]);

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FaTag className="text-primary" />
          Hôtel des Ventes
        </h3>
        <span className="text-xs">
          {playerInfo.ah.data.length} items
        </span>
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
          <SaleCard key={`${sale.createdAt}-${index}`} sale={sale} itemList={itemList} />
        ))}
      </div>
    </div>
  );
}

function SaleCard({ sale, itemList }: { sale: AhItemType, itemList: OptionType[] }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }
  const [item, setItem] = useState<OptionType | undefined>(undefined);
  useEffect(() => {
    setItem(itemList.find(e => e.value === sale.item.name));
  }, [itemList, setItem, sale]);
  const itemImageUrl = `/AH_img/${item?.img ?? "unknown.webp"}`;
  const sellerHeadUrl = `https://mineskin.eu/helm/${playerInfo?.uuid}`;

  return (
    <ClickableLink
      className="hover:scale-105"
      href={generateAhShopUrl(item)}
    >
      <div className="relative flex flex-col hover:bg-gray-700/80 border border-gray-700 hover:border-gray-500 rounded-lg transition-all duration-200 overflow-hidden">

        <div className="absolute top-1 right-1 z-10">
          <span className="bg-black text-white text-sm font-bold px-1.5 py-0.5 rounded">
            x {sale.item.quantity}
          </span>
        </div>

        <div className="p-3 flex items-center justify-center bg-gray-900/30 mb-2">
          <div className="w-12 h-12 relative transition-transform duration-300 group-hover:scale-110">
            <UnOptimizedImage
              blurDataURL={"`/AH_img/unknown.webp"}
              placeholder='blur'
              src={itemImageUrl}
              alt={sale.name}
              width={48}
              height={48}
              className="w-full h-full pixelated"
            />
          </div>
        </div>

        <div className="px-3 pb-1">
          <h4 className="text-sm font-semibold text-gray-200 truncate text-center">
            <span>
              {item?.label} { sale.renamed ? " (" + sale.name + ")" : ""}
            </span>
          </h4>
        </div>

        <div className="px-3 pb-2 space-y-1 mt-auto">
          <div className="flex items-center justify-between text-xs bg-gray-900/40 rounded px-1.5 py-1 border border-yellow-500/20">
            <span className="text-gray-400">PB</span>
            <div className="flex items-center gap-1 text-yellow-400 font-bold">
              {sale.pricePb}
              <UnOptimizedImage src={safeJoinPaths(constants.imgPathMarket, "pb_icon.png")}
                className="w-fit h-4 pixelated"
                alt={"pb_icon"} width={0} height={0}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs bg-gray-900/40 rounded px-1.5 py-1 border border-green-500/20">
            <span className="text-gray-400">$</span>
            <div className="flex items-center gap-1 text-green-400 font-bold">
              {sale.price.toLocaleString()}
              <UnOptimizedImage src={safeJoinPaths(constants.imgPathMarket,"money_icon.png")}
                className="w-fit h-4 pixelated"
                alt={"money_icon"} width={0} height={0}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-900/80 p-2 border-t border-gray-700">
          <div className="w-8 h-8 rounded-sm overflow-hidden border border-gray-600 flex-shrink-0">
            <UnOptimizedImage
              src={sellerHeadUrl}
              alt="Seller"
              width={0}
              height={0}
              className="w-full h-full object-cover pixelated"
            />
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase leading-none">Vendeur</span>
            <span className="text-[10px] text-gray-300 truncate" title={sale.name}>
              {playerInfo.username}
            </span>
          </div>
        </div>
      </div>
    </ClickableLink>
  );
}