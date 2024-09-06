import {
  convertEpochToDateUTC2,
  formatPrice,
  GetAllFileNameInFolder,
  levenshteinDistance,
  safeJoinPaths
} from "@/lib/misc.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { AhItemType } from "@/types";
import LoadingData from "@/components/LoadingData.tsx";


type AhItemsProps = {
  item: AhItemType;
}


export default function AhItem({ item }: AhItemsProps) {
  if (!item["item"])
    return <LoadingData username={undefined}/>;


  // const createdAt = convertEpochToDateUTC2(item["createdAt"]);
  const expireAt = convertEpochToDateUTC2(item["expireAt"]);
  // const item_meta = item["item"]["meta"];
  let item_name = item["item"]["name"].replace("palamod:", "").replace("item.", "").replace("minecraft:", "").replace("tile.", "").replace("customnpc:", "").replace("guardiangolem:", "")

  if (item_name === "IronChest:BlockIronChest") {
    item_name = item["name"];
  }


  const quantity = item["item"]["quantity"];
  const name = item["name"];
  const price = item["price"];
  const pricePb = item["pricePb"];
  const renamed = item["renamed"];
  // const skin = item["skin"];
  // const type = item["type"][0].toUpperCase() + item["type"].slice(1).toLowerCase();

  const closestItemName = GetAllFileNameInFolder().reduce((acc, curr) => {
    if (levenshteinDistance(curr, item_name) < levenshteinDistance(acc, item_name)) {
      return curr;
    } else {
      return acc;
    }
  });

  let displayName = item["item"]["name"];
  if (item["item"]["name"] === "StorageDrawers:fullDrawers4")
    displayName = "StorageDrawers 2x2";
  else if (item["item"]["name"] === "StorageDrawers:fullDrawers2")
    displayName = "StorageDrawers 1x2";
  else if (item["item"]["name"] === "StorageDrawers:fullDrawers1")
    displayName = "StorageDrawers 1x1";

  return (
    <Card>
      <CardContent className="pt-6 space-y-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <img src={safeJoinPaths("/AH_img/", `${closestItemName}.png`)} alt="Icône"
               className="object-cover h-12 w-auto pixelated"/>
          <span
            className="text-primary text-sm">{quantity}x {renamed ? `${displayName} renommé en ${name}` : `${name}`}</span>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <img src={safeJoinPaths("dollar.png")} alt="Icône"
                 className="object-cover h-10 w-10 inline-block pixelated mr-2"/>
            Prix: {formatPrice(price)} $
          </div>
          <div className="text-sm">
            <img src={safeJoinPaths("/pbs.png")} alt="Icône"
                 className="object-cover h-10 w-10 pixelated inline-block mr-2"/>
            Prix en pbs: {formatPrice(pricePb)}
          </div>
          <div className="text-sm">
            <img src={safeJoinPaths("/clock.gif")} alt="Icône"
                 className="object-cover h-10 w-10 pixelated inline-block mr-2"/>
            Expire le : {expireAt}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}