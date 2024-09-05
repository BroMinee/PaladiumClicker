import { RankingResponse, RankingType } from "@/types";
import { redirect } from "next/navigation";
import { getRankingLeaderboard } from "@/lib/api/apiPalaTracker.ts";
import PlotRankingChart from "@/components/Clicker-Optimizer/PlotRankingChart.tsx";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";

export default async function GraphRanking({ rankingType }: { rankingType: RankingType }) {
  let data = [] as RankingResponse;
  try {
    data = await getRankingLeaderboard(rankingType);
  } catch (e) {
    console.error(e);
  }

  if (data.length === 0)
    redirect("/error?message=Impossible de récupérer les données du classement sélectionné");


  return (
    <PlotRankingChart data={data}/>
  )
}

export function GraphRankingFallback() {
  return <div className="flex flex-row gap-2 m-4 w-96 items-center">
    <LoadingSpinner size={4}/>
    <h2 className="font-bold">Chargement du graphique...</h2>
  </div>
}