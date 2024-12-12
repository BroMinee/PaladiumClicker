import {
  convertEpochToDateUTC2,
  formatPrice,
  generateAhShopUrl,
  levenshteinDistance,
  safeJoinPaths
} from "@/lib/misc.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { AhItemType, OptionType } from "@/types";
import LoadingData from "@/components/LoadingData.tsx";
import Image from "next/image";
import Link from "next/link";

type AhItemsProps = {
  item: AhItemType,
  itemNameMatcher: OptionType[];
}


export default function AhItem({ item, itemNameMatcher }: AhItemsProps) {
  if (!item["item"])
    return <LoadingData username={undefined}/>;


  // const createdAt = convertEpochToDateUTC2(item["createdAt"]);
  const expireAt = convertEpochToDateUTC2(item["expireAt"]);
  // const item_meta = item["item"]["meta"];
  let item_name = item.item.name;


  const quantity = item.item.quantity;
  const price = item.price;
  const pricePb = item.pricePb;
  const renamed = item.renamed;
  const name = item.name;
  // const skin = item["skin"];
  // const type = item["type"][0].toUpperCase() + item["type"].slice(1).toLowerCase();

  let closestItemName = itemNameMatcher.find((e) => {
    return e.value === item_name;
  });
  if (!closestItemName) {
    closestItemName = itemNameMatcher.reduce((acc, curr) => {
      if (levenshteinDistance(renamed ? curr.value : curr.label, renamed ? item_name : name) < levenshteinDistance(renamed ? curr.value : acc.label, renamed ? item_name : name)) {
        return curr;
      } else {
        return acc;
      }
    });
  }

  let displayName = closestItemName.label;


  return (
    <Link href={`${generateAhShopUrl(closestItemName)}`}>
      <Card className="hover:scale-105 duration-300 mt-4 ml-1.5 mr-1.5 cursor-pointer">
      <CardContent className="pt-6 space-y-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image src={safeJoinPaths("/AH_img/", `${closestItemName.img}`)} alt="Icône"
                 height={48} width={48}
                 className="object-cover pixelated"/>
          <span
            className="text-primary text-sm">{quantity}x {renamed ? `${displayName} renommé en ${name}` : `${displayName}`}</span>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <Image src={safeJoinPaths("dollar.png")} alt="Icône"
                   width={40} height={40}
                   className="object-cover inline-block pixelated mr-2"/>
            Prix: {formatPrice(price)} $
          </div>
          <div className="text-sm">
            <Image src={safeJoinPaths("/pbs.png")} alt="Icône"
                   width={40} height={40}
                   className="object-cover pixelated inline-block mr-2"/>
            Prix en pbs: {formatPrice(pricePb)}
          </div>
          <div className="text-sm">
            <Image src={safeJoinPaths("/clock.gif")} alt="Icône"
                   width={40} height={40}
                   className="object-cover pixelated inline-block mr-2"/>
            Expire le : {expireAt}
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}