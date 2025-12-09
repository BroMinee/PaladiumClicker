"use server";

import MarketPage from "@/components/ah/market.client";
import { SetMarketState } from "@/components/ah/set-market-state";
import { SetItemsStats } from "@/components/shared/set-items-state.client";
import { getAllItems } from "@/lib/api/apiPalaTracker";
import { OptionType, searchParamsAhPage } from "@/types";

/**
 * Generate Metadata
 * @param props.searchParams - Search Params of ah
 */
export async function generateMetadata(props: { searchParams: Promise<{ item: string | undefined }> }) {
  const searchParams = await props.searchParams;

  const itemListJson = await getAllItems().catch(() => {
    return [] as OptionType[];
  });

  const item = itemListJson.find((item) => item.value === searchParams.item);

  if (!item) {
    return {
      title: "PalaTracker | AH Tracker",
      description: "Suivez les historiques de vente de vos items préférés sur Paladium",
      openGraph: {
        title: "PalaTracker | AH Tracker",
        description: "Suivez les historiques de vente de vos items préférés sur Paladium"
      },
    };
  }

  const title = `PalaTracker | AH Tracker | ${item.label}`;
  const description = "Suivez les historiques de vente de vos items préférés sur Paladium";
  return {
    title: title,
    description: "Suivez les historiques de vente de vos items préférés sur Paladium",
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: `https://palatracker.bromine.fr/AH_img/${item.img}`,
          width: 500,
          height: 500,
        }
      ]
    },
  };
}

/**
 * [market page](https://palatracker.bromine.fr/ah)
 */
export default async function MarketHomePage(_props: { searchParams: Promise<searchParamsAhPage> }) {
  const options = await getAllItems();

  return (
    <SetItemsStats allItems={options}>
      <SetMarketState>
        <MarketPage />
      </SetMarketState>
    </SetItemsStats>
  );
}