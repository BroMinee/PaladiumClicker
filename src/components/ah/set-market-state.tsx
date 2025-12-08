"use client";

import { useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { generateAhShopUrl } from "@/lib/misc";
import { useItemsStore } from "@/stores/use-items-store";
import { useMarketStore } from "@/stores/use-market-store";
import { getMarketHistoryServerAction, getPaladiumAhItemStatsOfAllItemsAction } from "@/lib/api/apiServerAction";

/**
 * Component that set the zustand market state using the searchParams
 * @param children - The page to display
 */
export function SetMarketState({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const selectedItemSearch = searchParams.get("item") ?? "";

  const { allItems, selectedItem, setSelectedItem } = useItemsStore();
  const { setCurrentListings, setAllMarket, allMarket, setMarketHistory } = useMarketStore();

  useEffect(() => {
    if (allItems.length === 0) {
      return;
    }
    const itemSelected = allItems.find(item => item.value === selectedItemSearch) ?? undefined;

    if (itemSelected) {
      setSelectedItem(itemSelected);
    } else if(selectedItemSearch !== "") {
      redirect(generateAhShopUrl(undefined));
    }

  }, [allItems, selectedItemSearch, setSelectedItem]);

  // Save market state
  useEffect(() => {
    getPaladiumAhItemStatsOfAllItemsAction().then(setAllMarket);
  }, [setAllMarket]);

  // Update the current listing and the market history
  useEffect(() => {
    if (!selectedItem) {
      return;
    }
    const marketInfo = allMarket.find(e => e.name === selectedItem.value);
    if (marketInfo) {
      setCurrentListings(marketInfo.listing);
    }

    getMarketHistoryServerAction(selectedItem.value).then(setMarketHistory).catch((e) => {
      console.error(e);
      setMarketHistory([]);
    });
  }, [allMarket, selectedItem, setMarketHistory, setCurrentListings]);

  return <>{children}</>;
}