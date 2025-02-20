import { MarketItemOffer, MarketListedItem, OptionType } from "@/types";
import { formatPrice, formatPriceWithUnit } from "@/lib/misc.ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import React, { ReactNode } from "react";
import Image from "next/image";
import { SellNameMarket } from "@/components/AhTracker/DetailedMarketOfferClient.tsx";
import { textFormatting } from "@/components/News.tsx";
import HoverText from "@/components/ui/hovertext.tsx";


export default async function DetailedMarketOfferList({ listing, item }: {
  listing: MarketListedItem,
  item: OptionType
}) {
  if (listing.length === 0) {
    return <p className="text-3xl font-bold text-center">Aucune offre disponible pour cet item</p>
  }

  return (
    <ScrollArea className="flex flex-col justify-evenly gap-3 pb-4 w-full px-2">
      {listing
        .toSorted((offer1, offer2) => offer1.price - offer2.price)
        .map((offer, index) => (
          <DetailedMarketOffer key={"offer-" + index} offer={offer} itemSelected={item}/>
        ))}
      <ScrollBar orientation="vertical"/>
    </ScrollArea>
  )
}

export function DetailedMarketOffer({ itemSelected, offer }: { itemSelected: OptionType, offer: MarketItemOffer }) {

  const hoverElementPricePb: ReactNode = (
    <div className="flex flex-col items-center justify-center border-black border-2 rounded-xl p-2 bg-secondary">
      {`${formatPrice(offer.pricePb)} PB`}
    </div>
  );

  const hoverElementPrice: ReactNode = (
    <div className="flex flex-col items-center justify-center border-black border-2 rounded-xl p-2 bg-secondary">
      {`${formatPrice(offer.price)} $`}
    </div>
  );

  const overlayNames = ["amethyst_overlay.png", "candy_overlay.png", "cavern_overlay.png", "diamond_overlay.png", "emerald_overlay.png", "eruption_overlay.png", "gold_overlay.png", "great_tree_overlay.png", "iron_overlay.png", "lapis_lazuli_overlay.png", "plain_overlay.png", "redstone_overlay.png", "snow_overlay.png"]
  const overlayName = overlayNames[Math.floor(Math.random() * overlayNames.length)]


  return <div className="flex flex-row items-center w-full m-2 bg-card/80">
    <div className="flex relative w-28 h-28 items-center justify-center">
      <Image src={`/img/MarketUI/${overlayName}`} width={0} height={0} alt={itemSelected.label} unoptimized={true}
             className="h-full w-full pixelated absolute"/>
      <Image src={`/AH_img/${itemSelected.img}`} width={0} height={0} alt={itemSelected.label} unoptimized={true}
             className="h-[50%] w-[50%] pixelated absolute"/>
    </div>
    <div className="flex flex-row items-center w-[20%] ml-4 justify-around">
      <p className="font-bold text-[25px]">
        {offer.rename ? textFormatting(offer.name) : offer.name}
      </p>
      <p className="font-bold text-[25px]">
        X{offer.quantity}
      </p>
    </div>
    <div className="ml-4 flex w-[35%] flex-row items-center gap-4">
      <Image src={`https://crafatar.com/avatars/${offer.seller}?size=8&overlay`}
             className="w-12 h-12 pixelated rounded-md"
             alt={`Skin`} width={0} height={0}
             unoptimized={true}
      />
      <SellNameMarket uuid={offer.seller}/>
    </div>
    {offer.pricePb &&
      <HoverText text={hoverElementPricePb}
                 className="flex flex-row w-[15%] gap-8 justify-between bg-black py-3 px-2 items-center">
        <Image src={`/img/MarketUI/pb_icon.png`}
               className="w-fit h-7 pixelated"
               alt={`pb_icon`} width={0} height={0}
               unoptimized={true}
        />
        <p className="font-semibold text-[20px]">

          {`${formatPriceWithUnit(offer.pricePb)} PB`}
        </p>
      </HoverText>

    }
    <HoverText text={hoverElementPrice}
               className="flex ml-4 flex-row w-[15%] gap-8 justify-between bg-black py-3 px-2 items-center">
      <Image src={`/img/MarketUI/money_icon.png`}
             className="w-fit h-7 pixelated"
             alt={`money_icon`} width={0} height={0}
             unoptimized={true}
      />
      <p className="font-semibold text-[20px]">
        {`${formatPriceWithUnit(offer.price)} $`}
      </p>
    </HoverText>
  </div>
}