import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import { AdminShopItem, adminShopItemsAvailable, isShopItem } from "@/types";
import { generateAdminShopUrl } from "@/lib/misc.ts";
import { Suspense } from "react";
import { AdminShopSelectorClient } from "@/components/AdminShop/AdminShopSelectorClient.tsx";
import GraphAdminShop, { GraphAdminShopFallback } from "@/components/AdminShop/GraphAdminShop.tsx";


export type searchParamsAdminShopPage = {
  item: string,
}

export async function generateMetadata(
  { searchParams }: { searchParams: searchParamsAdminShopPage },
) {

  let title = "Paladium Tracker - Admin Shop";
  let itemImgPath = "";
  let defaultImage = "https://dev.bromine.fr/PaladiumClicker/favicon.ico";
  if (isShopItem(searchParams.item)) {
    itemImgPath = `AH_img/${searchParams.item}.png`;
    defaultImage = `https://dev.bromine.fr/${itemImgPath}`;
    title += ` - ${searchParams.item}`;
  }


  const description = "📈 Visualisez l'historique du prix des items de l'admin-shop !";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: defaultImage,
          width: 256,
          height: 256,
        }
      ]
    },
  }

}

export default function Home({ searchParams }: {
  params: { username: string },
  searchParams: searchParamsAdminShopPage
}) {

  // test if the searchParams.category is a RankingType
  if (!isShopItem(searchParams.item)) {
    redirect(generateAdminShopUrl('paladium-ingot'));
  }


  const adminShopItem = searchParams.item as AdminShopItem;


  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bienvenue sur le visualisateur d'historique de prix de{" "}
            <GradientText className="font-extrabold">{adminShopItem}</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart
            className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-10 items-center justify-between gap-2">
          {adminShopItemsAvailable.map((value: AdminShopItem, index: number) => {
            return <AdminShopSelectorClient key={value + index} item={value}/>
          })}
        </CardContent>
      </Card>

      <Card className="w-full h-[calc(100vh-30vh)]">
        <Suspense fallback={<GraphAdminShopFallback/>}>
          <GraphAdminShop item={adminShopItem}/>
        </Suspense>
      </Card>

    </div>
  )
}