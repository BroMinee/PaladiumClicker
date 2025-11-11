import "server-only";

import { AhItemHistory, OptionType, PaladiumAhItemStat } from "@/types";
import { getPaladiumAhItemFullHistory, getPaladiumAhItemStats } from "@/lib/api/apiPala";
import { Card } from "@/components/ui/card";
import { PlotHistoricChart } from "@/components/AhTracker/PlotHistoricChart";
import DetailedMarketOfferList from "@/components/AhTracker/DetailedMarketOfferList";
import React from "react";
import QuantitySelectorDisplay from "@/components/AhTracker/QuantitySelectorDisplay";

/**
 * Fetcher of item market history
 * @param item - The item we want to get the history from
 */
export async function MarketServerFetcher({ item }: { item: OptionType }) {
  let data = [] as AhItemHistory[];
  let itemInfo = null as PaladiumAhItemStat | null;
  try {
    data = await getPaladiumAhItemFullHistory(item.value);
  } catch (e) {
    console.error(e);
  }

  try {
    itemInfo = await getPaladiumAhItemStats(item.value);
  } catch (e) {
    console.error(e);
  }

  return (
    <>
      <Card className="h-[calc(100vh-55vh)]">
        <PlotHistoricChart data={data}/>
      </Card>
      <Card className="mt-2 bg-card/80">
        <QuantitySelectorDisplay itemInfo={itemInfo}/>
        <DetailedMarketOfferList listing={itemInfo?.listing ?? []} item={item}/>
      </Card>
    </>
  );
}