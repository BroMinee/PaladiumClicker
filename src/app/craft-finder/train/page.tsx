"use client";

import { StaticDataProvider } from "@/components/shared/static-data-provider.client";
import { CraftFinderTrainGame } from "./craft-finder-train.client";

/**
 *
 */
export default function CraftFinderTrainPage() {
  return (
    <StaticDataProvider>
      <CraftFinderTrainGame />
    </StaticDataProvider>
  );
}
