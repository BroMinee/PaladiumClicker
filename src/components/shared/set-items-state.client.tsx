"use client";

import { ReactNode, useEffect } from "react";
import { useItemsStore } from "@/stores/use-items-store";
import { OptionType } from "@/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * Component that set the zustand allItems recipe state

 */
export function SetItemsState({ allItems, children }: { allItems: OptionType[], children: ReactNode }) {
  const { setAllItems, allItems: stateAllItems } = useItemsStore();

  useEffect(() => {
    setAllItems(allItems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAllItems]);

  if(stateAllItems.length === 0) {
    return <LoadingSpinner/>;
  }

  return <>{children}</>;
}