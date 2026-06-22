"use client";

import { ReactNode, useEffect } from "react";
import { CraftingRecipeType } from "@/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";

/**
 * Component that set the zustand allCrafts recipe state
 */
export function SetAllCraftsState({ allCrafts, children }: { allCrafts: CraftingRecipeType[], children: ReactNode }) {
  const { setAllCrafts, allCrafts: stateAllCrafts } = useAllCraftsStore();

  useEffect(() => {
    setAllCrafts(allCrafts);
  }, [allCrafts, setAllCrafts]);

  if(stateAllCrafts.length === 0) {
    return <LoadingSpinner/>;
  }

  return <>{children}</>;
}