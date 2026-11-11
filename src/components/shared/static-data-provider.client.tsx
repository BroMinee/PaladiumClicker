"use client";

import { ReactNode, useEffect } from "react";
import { useItemsStore } from "@/stores/use-items-store";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";
import { getStaticItems, getStaticCrafts } from "@/lib/data/static-data";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * Fetches items and crafts from static JSON files and populates Zustand stores.
 * Replaces the old pattern of server pages passing data to SetItemsState/SetAllCraftsState.
 */
export function StaticDataProvider({ children }: { children: ReactNode }) {
  const { setAllItems, allItems } = useItemsStore();
  const { setAllCrafts, allCrafts } = useAllCraftsStore();

  useEffect(() => {
    if (allItems.length > 0 && allCrafts.length > 0) {
      return;
    }
    let cancelled = false;
    Promise.all([getStaticItems(), getStaticCrafts()]).then(([items, crafts]) => {
      if (!cancelled) {
        setAllItems(items);
        setAllCrafts(crafts);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [setAllItems, setAllCrafts, allItems.length, allCrafts.length]);

  if (allItems.length === 0 || allCrafts.length === 0) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
