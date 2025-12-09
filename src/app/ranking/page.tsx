import React from "react";

import { RankingSectionSelector } from "@/components/ranking/inputs.clients";
import { searchParamsRankingPage } from "@/components/ranking/RankingSelector";
import { RankingType } from "@/types";
import { getImagePathFromRankingType, rankingTypeToUserFriendlyText } from "@/lib/misc";

/**
 * Generate Metadata
 * @param props.searchParams - Search params
 */
export async function generateMetadata(props: { searchParams: Promise<searchParamsRankingPage> }) {
  const searchParams = await props.searchParams;

  let title = "PalaTracker | Classement";
  let rankingImgPath = "";
  let defaultImage = "https://palatracker.bromine.fr/PaladiumClicker/favicon.ico";
  if (Object.values(RankingType).includes(searchParams.category as RankingType)) {
    rankingImgPath = getImagePathFromRankingType(searchParams.category as RankingType);
    defaultImage = `https://palatracker.bromine.fr/${rankingImgPath}`;
    title += ` | ${rankingTypeToUserFriendlyText(searchParams.category as RankingType)}`;
  }

  const description = "📈 Visualisez le classement des joueurs Paladium ainsi que l'historique d'évolution !";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: defaultImage,
          width: 256,
          height: 256,
        }
      ]
    },
  };
}

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