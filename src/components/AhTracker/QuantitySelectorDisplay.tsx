import { Card, CardContent } from "@/components/ui/card.tsx";
import { FaBoxOpen } from "react-icons/fa";
import { getPaladiumAhItemStats } from "@/lib/apiPala.ts";
import { PaladiumAhItemStat } from "@/types";
import { redirect } from "next/navigation";
import GradientText from "@/components/shared/GradientText.tsx";
import { formatPrice, GetAllFileNameInFolder, levensteinDistance } from "@/lib/misc.ts";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";

import itemListJson from "@/assets/items_list.json";

export default async function QuantitySelectorDisplay({ selectedItem }: { selectedItem: string }) {
  let itemInfo = null as PaladiumAhItemStat | null;
  try {
    itemInfo = await getPaladiumAhItemStats(selectedItem);
  } catch (e) {
    console.error(e);
  }

  if (!itemInfo)
    redirect(`/error?message=Impossible de récupérer les données actuelles de ${selectedItem}`)

  const closestItemName = selectedItem.length === 0 ? "" : GetAllFileNameInFolder().reduce((acc, curr) => {
    if (levensteinDistance(curr, selectedItem) < levensteinDistance(acc, selectedItem)) {
      return curr;
    } else {
      return acc;
    }
  });


  return (
    <div className="flex flex-row justify-evenly gap-3 pb-4">
      {selectedItem.length === 0 ? "" :
        <Card>
          <SmallCardInfo title={itemListJson.find((item) => item.value === selectedItem)?.label} value="Image non contractuelle"
                         img={`AH_img/${closestItemName}.png`}/>
        </Card>
      }
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaBoxOpen className="size-12 mr-2"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Quantité en vente actuellement</span>
            <div className="flex gap-2 items-center">
              <GradientText className="font-bold">
                {`x${formatPrice(itemInfo.quantityAvailable)}`}
              </GradientText>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <SmallCardInfo title="Prix moyen actuellement en vente"
                       value={`${formatPrice(Math.round((itemInfo.priceSum / (itemInfo.countListings === 0 ? 1 : itemInfo.countListings)) * 100) / 100)} $`}
                       img="dollar.png"/>
      </Card>
    </div>
  )
}