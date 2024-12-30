import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card.tsx";
import { RankingType } from "@/types";
import { RankingSelectorCard, searchParamsRankingPage } from "@/components/Ranking/RankingSelector.tsx";
import { generateRankingUrl, getImagePathFromRankingType, rankingTypeToUserFriendlyText } from "@/lib/misc.ts";
import { Suspense } from "react";
import GraphRanking, { GraphRankingFallback } from "@/components/Ranking/GraphRanking.tsx";


export async function generateMetadata(
  { searchParams }: { searchParams: searchParamsRankingPage },
) {

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
  }

}

export default function Home({ searchParams }: {
  params: { username: string },
  searchParams: searchParamsRankingPage
}) {

  // test if the searchParams.category is a RankingType
  if (!Object.values(RankingType).includes(searchParams.category as RankingType)) {
    redirect(generateRankingUrl(RankingType.money));
  }


  const rankingType = searchParams.category as RankingType;


  return (
    <div className="flex flex-col gap-4">
      <RankingSelectorCard rankingType={rankingType} rankingPage={true}/>
      <Card className="w-full h-[calc(100vh-30vh)]">
        <Suspense fallback={<GraphRankingFallback/>}>
          <GraphRanking rankingType={rankingType} searchParams={searchParams}/>
        </Suspense>
      </Card>
    </div>
  )
}