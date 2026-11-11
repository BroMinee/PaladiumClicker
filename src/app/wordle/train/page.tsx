"use client";

import { StaticDataProvider } from "@/components/shared/static-data-provider.client";
import { WordleTrainGame } from "./wordle-train.client";

/** Wordle train page. */
export default function WordleTrainPage() {
  return (
    <StaticDataProvider>
      <WordleTrainGame />
    </StaticDataProvider>
  );
}
