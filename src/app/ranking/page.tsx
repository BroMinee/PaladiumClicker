import React from "react";

import { RankingSectionSelector } from "@/components/ranking/inputs.client";
import { searchParamsRankingPage } from "@/types";
import { RankingType } from "@/types";
import { getImagePathFromRankingType, rankingTypeToUserFriendlyText, textFormatting } from "@/lib/misc";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";

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
      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("°Classements°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          {"Consultez les classements des meilleurs joueurs Paladium depuis le début de la saison."}
        </PageHeaderDescription>
      </PageHeader>
      <RankingSectionSelector/>
    </>
  );
}