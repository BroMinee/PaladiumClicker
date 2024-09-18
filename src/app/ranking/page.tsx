import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import { RankingType } from "@/types";
import { searchParamsRankingPage } from "@/components/Ranking/RankingSelector.tsx";
import { generateRankingUrl, getImagePathFromRankingType } from "@/lib/misc.ts";
import { Suspense } from "react";
import GraphRanking, { GraphRankingFallback } from "@/components/Ranking/GraphRanking.tsx";
import { RankingSelectorClient } from "@/components/Ranking/RankingSelectorClient.tsx";


export async function generateMetadata(
  { searchParams }: { searchParams: searchParamsRankingPage },
) {

  let title = "PalaTracker - Classement";
  let rankingImgPath = "";
  let defaultImage = "https://palatracker.bromine.fr/PaladiumClicker/favicon.ico";
  if (Object.values(RankingType).includes(searchParams.category as RankingType)) {
    rankingImgPath = getImagePathFromRankingType(searchParams.category as RankingType);
    defaultImage = `https://palatracker.bromine.fr/${rankingImgPath}`;
    title += ` - ${searchParams.category}`;
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
      <Card className="flex flex-col gap-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bienvenue sur le visualisateur du classement{" "}
            <GradientText className="font-extrabold">{rankingType}</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart
            className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-between gap-2 ">
          {Object.keys(RankingType).map((key) => {
            return <RankingSelectorClient key={key} rankingType={key as RankingType}/>

          })}
        </CardContent>
      </Card>

      <Card className="w-full h-[calc(100vh-30vh)]">
        <Suspense fallback={<GraphRankingFallback/>}>
          <GraphRanking rankingType={rankingType}/>
        </Suspense>
      </Card>

    </div>
  )
}