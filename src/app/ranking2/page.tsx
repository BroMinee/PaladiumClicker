import React from "react";

import { RankingSectionSelector } from "@/components/ranking1/inputs.clients";

/**
 * [LeaderboardPage](https://palatracker.bromine.fr/ranking)
 */
export default function LeaderboardPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Classements</h1>
      <RankingSectionSelector/>
    </>
  );
}