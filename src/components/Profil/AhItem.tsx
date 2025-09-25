import { convertAhItemTypeToMarketItemOffer, generateAhShopUrl } from "@/lib/misc.ts";
import { AhItemType, OptionType } from "@/types";
import LoadingData from "@/components/LoadingData.tsx";
import Link from "next/link";
import { DetailedMarketOffer } from "@/components/AhTracker/DetailedMarketOfferList.tsx";

type AhItemsProps = {
  item: AhItemType,
  allItemsInfo: OptionType[],
  uuid_seller: string;
}


export default function AhItem({ item, allItemsInfo, uuid_seller }: AhItemsProps) {
  if (!item["item"])
    return <LoadingData username={undefined}/>;

  const itemOffer = convertAhItemTypeToMarketItemOffer(item, uuid_seller);
  let closestItem = allItemsInfo.find((e) => e.value === item.item.name);
  let air = allItemsInfo.find((e) => e.value === "air");

  if (!closestItem && air)
    return <div className="w-[95%] hover:scale-105 duration-300 cursor-pointer">
      <DetailedMarketOffer itemSelected={air} offer={itemOffer}/>
    </div>;
  if (!closestItem)
    return "Unknown item";


  return (
    <Link href={`${generateAhShopUrl(closestItem)}`} className="w-[95%] hover:scale-105 duration-300 cursor-pointer">
      <DetailedMarketOffer itemSelected={closestItem} offer={itemOffer}/>
    </Link>
  );
}