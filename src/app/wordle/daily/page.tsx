"use client";

import { StaticDataProvider } from "@/components/shared/static-data-provider.client";
import { WordleDailyGame } from "./wordle-daily.client";

/** Wordle daily page. */
export default function WordleDailyPage() {
  return (
    <StaticDataProvider>
      <WordleDailyGame />
    </StaticDataProvider>
  );
}
