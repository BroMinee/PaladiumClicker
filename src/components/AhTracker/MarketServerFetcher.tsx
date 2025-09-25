import "server-only";

import { AhItemHistory, OptionType, PaladiumAhItemStat } from "@/types";
import { getPaladiumAhItemFullHistory, getPaladiumAhItemStats } from "@/lib/api/apiPala.ts";
import { Card } from "@/components/ui/card.tsx";
import { PlotHistoricChart } from "@/components/AhTracker/PlotHistoricChart.tsx";
import DetailedMarketOfferList from "@/components/AhTracker/DetailedMarketOfferList.tsx";
import React from "react";
import QuantitySelectorDisplay from "@/components/AhTracker/QuantitySelectorDisplay.tsx";

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