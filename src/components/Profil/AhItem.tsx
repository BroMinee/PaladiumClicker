import { convertAhItemTypeToMarketItemOffer, generateAhShopUrl } from "@/lib/misc";
import { AhItemType, OptionType } from "@/types";
import { LoadingData } from "@/components/LoadingData";
import Link from "next/link";
import { DetailedMarketOffer } from "@/components/AhTracker/DetailedMarketOfferList";

type AhItemsProps = {
  item: AhItemType,
  allItemsInfo: OptionType[],
  uuid_seller: string;
}

/**
 * Displays a single Auction House (AH) item listing for the player, with a link to its detailed market page.
 *
 * @param item - The AH item entry returned by the API, including quantity and pricing.
 * @param allItemsInfo - The list of all items known in the DB (used to resolve metadata such as label and image).
 * @param uuid_seller - The UUID of the seller, used to convert the AH item into a standardized `MarketItemOffer`.
 */
export default function AhItem({ item, allItemsInfo, uuid_seller }: AhItemsProps) {
  if (!item["item"]) {
    return <LoadingData username={undefined}/>;
  }

  const itemOffer = convertAhItemTypeToMarketItemOffer(item, uuid_seller);
  const closestItem = allItemsInfo.find((e) => e.value === item.item.name);
  const air = allItemsInfo.find((e) => e.value === "air");

  if (!closestItem && air) {
    return <div className="w-[95%] hover:scale-105 duration-300 cursor-pointer">
      <DetailedMarketOffer itemSelected={air} offer={itemOffer}/>
    </div>;
  }
  if (!closestItem) {
    return "Unknown item";
  }

  return (
    <Link href={`${generateAhShopUrl(closestItem)}`} className="w-[95%] hover:scale-105 duration-300 cursor-pointer">
      <DetailedMarketOffer itemSelected={closestItem} offer={itemOffer}/>
    </Link>
  );
}