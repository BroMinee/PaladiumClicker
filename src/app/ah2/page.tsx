"use server";

import MarketPage from "@/components/ah/market.client";
import { SetMarketState } from "@/components/ah/set-market-state";
import { SetItemsStats } from "@/components/shared/set-items-state.client";
import { getAllItems } from "@/lib/api/apiPalaTracker";
import { searchParamsAhPage } from "@/types";

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