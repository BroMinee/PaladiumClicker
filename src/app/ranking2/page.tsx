import React from "react";

import { RankingSectionSelector } from "@/components/ranking1/inputs.clients";

/**
 * [LeaderboardPage](https://palatracker.bromine.fr/ranking)
 */
export default function LeaderboardPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Classements</h1>
        <RankingSectionSelector/>
      </div>
    </div>
  );
}