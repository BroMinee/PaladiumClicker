"use client";

import { StaticDataProvider } from "@/components/shared/static-data-provider.client";
import { CraftFinderDailyGame } from "./craft-finder-daily.client";

/**
 *
 */
export default function CraftFinderDailyPage() {
  return (
    <StaticDataProvider>
      <CraftFinderDailyGame />
    </StaticDataProvider>
  );
}
