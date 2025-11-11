import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitleH1 } from "@/components/ui/card";
import { GradientText } from "@/components/shared/GradientText";
import { FaHeart } from "react-icons/fa";
import { AdminShopItem, AdminShopPeriod } from "@/types";
import { adminShopItemToUserFriendlyText, generateAdminShopUrl, getImagePathFromAdminShopType, isShopItem } from "@/lib/misc";
import { Suspense } from "react";
import {
  AdminShopSelectorClientItem,
  AdminShopSelectorClientPeriode
} from "@/components/AdminShop/AdminShopSelectorClientItem";
import GraphAdminShop, { GraphAdminShopFallback } from "@/components/AdminShop/GraphAdminShop";
import { constants } from "@/lib/constants";

export type searchParamsAdminShopPage = {
  item: string,
  periode: string,
}

/**
 * Generate Metadata
 * @param props.searchParams - Admin-shop search params
 */
export async function generateMetadata(props: { searchParams: Promise<searchParamsAdminShopPage> }) {
  const searchParams = await props.searchParams;

  let title = "PalaTracker | Admin Shop";
  let itemImgPath = "";
  let defaultImage = "https://palatracker.bromine.fr/PaladiumClicker/favicon.ico";
  if (isShopItem(searchParams.item)) {
    itemImgPath = getImagePathFromAdminShopType(searchParams.item);
    defaultImage = `https://palatracker.bromine.fr/${itemImgPath}`;
    title += ` | ${adminShopItemToUserFriendlyText(searchParams.item)}`;
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
  };
}

/**
 * [Admin-shop page](https://palatracker.bromine.fr/admin-shop)
 * @param props.searchParams - Admin-shop search params
 */
export default async function Home(
  props: {
    searchParams: Promise<searchParamsAdminShopPage>
  }
) {
  const searchParams = await props.searchParams;

  // test if the searchParams.category is a RankingType
  if (!isShopItem(searchParams.item)) {
    redirect(generateAdminShopUrl("paladium-ingot"));
  }
  let periode = searchParams.periode;
  let periodeEnum = searchParams.periode as AdminShopPeriod;

  if (periode === undefined) {
    periode = "day";
  }

  if (periode !== "day" && periode !== "week" && periode !== "month" && periode !== "season") {
    redirect(generateAdminShopUrl(searchParams.item, "day"));
    return null;
  } else {
    periodeEnum = periode as AdminShopPeriod;
  }

  const adminShopItem = searchParams.item as AdminShopItem;

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitleH1>
          Bienvenue sur le visualisateur d&apos;historique de prix de{" "}
          <GradientText className="font-extrabold">{adminShopItemToUserFriendlyText(adminShopItem)}</GradientText>
        </CardTitleH1>
        <CardDescription>
          Made with <FaHeart
            className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-6 sm:grid-cols-16 lg:grid-cols-23 items-center justify-between gap-2 pb-2" id="admin-selector">
        {constants.adminShopItemsAvailable.map((value: AdminShopItem, index: number) => {
          return <AdminShopSelectorClientItem key={value + index} item={value} periode={periodeEnum}
            adminShopPage={true}/>;
        })}
      </CardContent>

      <CardContent className="h-[calc(100vh-37.5vh)] pb-0">
        <Suspense fallback={<GraphAdminShopFallback/>}>
          <GraphAdminShop item={adminShopItem} periode={periodeEnum}/>
        </Suspense>
      </CardContent>
      <CardHeader className='w-full flex flex-col sm:flex-row gap-2 justify-center items-center p-0 mb-2'>
        <AdminShopSelectorClientPeriode item={adminShopItem} periode="day"/>
        <AdminShopSelectorClientPeriode item={adminShopItem} periode="week"/>
        <AdminShopSelectorClientPeriode item={adminShopItem} periode="month"/>
        <AdminShopSelectorClientPeriode item={adminShopItem} periode="season"/>
      </CardHeader>
    </Card>
  );
}