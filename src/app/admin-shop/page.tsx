import { adminShopItemToUserFriendlyText, getImagePathFromAdminShopType, isShopItem } from "@/lib/misc";
import { AdminShopHistoryPage } from "@/components/admin-shop/admin-shop-page.client";

interface searchParamsAdminShopPage {
  item: string,
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
 * [Admin-shop page](http://palatracker.bromine.fr/admin-shop)
 */
export default function Home() {
  return (<AdminShopHistoryPage/>);
}