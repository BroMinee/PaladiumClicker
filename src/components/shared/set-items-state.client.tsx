"use client";

import { ReactNode, useEffect } from "react";
import { useItemsStore } from "@/stores/use-items-store";
import { OptionType } from "@/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * Component that set the zustand allItems recipe state given the searchParams

 */
export function SetItemsStats({ allItems, children }: { allItems: OptionType[], children: ReactNode }) {
  const { setAllItems } = useItemsStore();

  useEffect(() => {
    setAllItems(allItems);
  }, [allItems, setAllItems]);

  if(allItems.length === 0) {
    return <LoadingSpinner/>;
  }

  return <>{children}</>;
}