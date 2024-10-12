import { Card, CardContent } from "@/components/ui/card.tsx";
import { FaBoxOpen } from "react-icons/fa";
import { getPaladiumAhItemStats } from "@/lib/api/apiPala.ts";
import { OptionType, PaladiumAhItemStat } from "@/types";
import { redirect } from "next/navigation";
import GradientText from "@/components/shared/GradientText.tsx";
import { formatPrice } from "@/lib/misc.ts";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";


export default async function QuantitySelectorDisplay({ item }: { item: OptionType }) {
  let itemInfo = null as PaladiumAhItemStat | null;
  try {
    itemInfo = await getPaladiumAhItemStats(item.value);
  } catch (e) {
    console.error(e);
  }

  if (!itemInfo)
    redirect(`/error?message=Impossible de récupérer les données actuelles de ${item.label}`)

  return (
    <div className="flex flex-row justify-evenly gap-3 pb-4">
        <Card>
          <SmallCardInfo title={item.label || "Not Found"}
                         value={item.label2 || "Not Found"}
                         img={`AH_img/${item.img}`} unoptimized/>
        </Card>
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