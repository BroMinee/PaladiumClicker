import { useItemsStore } from "@/stores/use-items-store";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { AhItemType, MarketItemOffer, OptionType, ProfilSectionEnum } from "@/types";
import { useState, useEffect } from "react";
import { ClickableLink } from "@/components/ui/clickable-link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { generateAhShopUrl, generateProfilUrl, safeJoinPaths } from "@/lib/misc";
import { constants } from "@/lib/constants";
import { getPlayerUsernameFromUUID } from "@/lib/api/apiClient";

interface BaseSaleCardProps {
  item?: OptionType;
  quantity: number;
  priceMoney: number;
  pricePb: number;
  sellerUuid: string;
  sellerName: string;
  itemName: string;
  isRenamed: boolean;
  isLoading?: boolean;
  url: string;
}

function BaseSaleCard({
  item,
  quantity,
  priceMoney,
  pricePb,
  sellerUuid,
  sellerName,
  itemName,
  isRenamed,
  isLoading,
  url,
}: BaseSaleCardProps) {

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const itemImageUrl = `/AH_img/${item?.img ?? "unknown.webp"}`;
  const sellerHeadUrl = `https://mineskin.eu/helm/${sellerUuid}`;

  const displayLabel = (
    <span>
      {item?.label} {isRenamed ? ` (${itemName})` : ""}
    </span>
  );

  return (
    <ClickableLink
      className="hover:scale-105 hover:text-card-foreground"
      href={url}
    >
      <div className="relative flex flex-col hover:bg-secondary/80 border border-secondary hover:border-gray-500 rounded-lg transition-all duration-200 overflow-hidden">

        <div className="absolute top-1 right-1 z-10">
          <span className="bg-black text-white text-sm font-bold px-1.5 py-0.5 rounded">
            x {quantity}
          </span>
        </div>

        <div className="p-3 flex items-center justify-center bg-background/30 mb-2">
          <div className="w-12 h-12 relative transition-transform duration-300 group-hover:scale-110">
            <UnOptimizedImage
              blurDataURL={"`/AH_img/unknown.webp"}
              placeholder='blur'
              src={itemImageUrl}
              alt={itemName}
              width={48}
              height={48}
              className="w-full h-full pixelated"
            />
          </div>
        </div>

        <div className="px-3 pb-1">
          <h4 className="text-sm font-semibold truncate text-center">
            {displayLabel}
          </h4>
        </div>

        <div className="px-3 pb-2 space-y-1 mt-auto">
          <div className="flex items-center justify-between text-xs bg-background/40 rounded px-1.5 py-1 border border-yellow-500/20">
            <span className="text-card-foreground">PB</span>
            <div className="flex items-center gap-1 text-yellow-400 font-bold">
              {pricePb}
              <UnOptimizedImage
                src={safeJoinPaths(constants.imgPathMarket, "pb_icon.png")}
                className="w-fit h-4 pixelated"
                alt={"pb_icon"} width={0} height={0}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs bg-background/40 rounded px-1.5 py-1 border border-green-500/20">
            <span className="text-card-foreground">$</span>
            <div className="flex items-center gap-1 text-green-400 font-bold">
              {priceMoney.toLocaleString()}
              <UnOptimizedImage
                src={safeJoinPaths(constants.imgPathMarket, "money_icon.png")}
                className="w-fit h-4 pixelated"
                alt={"money_icon"} width={0} height={0}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-background/80 p-2 border-t border-secondary">
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
            <span className="text-[9px] uppercase leading-none">Vendeur</span>
            <span className="text-[10px] truncate" title={sellerName}>
              {sellerName}
            </span>
          </div>
        </div>
      </div>
    </ClickableLink>
  );
}

/**
 * Display a market offer, redirect to market page on click
 * @param sale - sell detail
 */
export function ProfileSaleCard({ sale }: { sale: AhItemType }) {
  const { allItems } = useItemsStore();
  const { data: playerInfo } = usePlayerInfoStore();
  const [item, setItem] = useState<OptionType | undefined>(undefined);

  useEffect(() => {
    setItem(allItems.find(e => e.value === sale.item.name));
  }, [allItems, sale.item.name]);

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return (
    <BaseSaleCard
      item={item}
      quantity={sale.item.quantity}
      priceMoney={sale.price}
      pricePb={sale.pricePb}
      sellerUuid={playerInfo.uuid}
      sellerName={playerInfo.username}
      itemName={sale.name}
      isRenamed={sale.renamed}
      isLoading={false}
      url={generateAhShopUrl(item)}
    />
  );
}

/**
 * Display a market offer, redirect to profile page on click
 * @param offer - the offer detail
 * @param itemName the item value not renamed
 */
export function MarketOfferCard({ offer, itemName }: { offer: MarketItemOffer, itemName: string }) {
  const { allItems } = useItemsStore();
  const [item, setItem] = useState<OptionType | undefined>(undefined);
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    getPlayerUsernameFromUUID(offer.seller).then((username) => setUsername(username)).catch(() => {
      setUsername("Username not found");
    });
  }, [offer.seller]);

  useEffect(() => {
    setItem(allItems.find(e => e.value === itemName));
  }, [allItems, itemName]);

  return (
    <BaseSaleCard
      item={item}
      quantity={offer.quantity}
      priceMoney={offer.price}
      pricePb={offer.pricePb}
      sellerUuid={offer.seller}
      sellerName={username}
      itemName={offer.name}
      isRenamed={offer.renamed}
      isLoading={false}
      url={generateProfilUrl(username, ProfilSectionEnum.Home)}
    />
  );
}