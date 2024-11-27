import { RankingResponse, RankingType } from "@/types";
import { redirect } from "next/navigation";
import { getRankingLeaderboard } from "@/lib/api/apiPalaTracker.ts";
import PlotRankingChart from "@/components/Ranking/PlotRankingChart.tsx";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";

export default async function GraphRanking({ rankingType }: { rankingType: RankingType }) {
  let data = [] as RankingResponse;
  try {
    data = await getRankingLeaderboard(rankingType);
  } catch (e) {
    redirect("/error?message=Impossible de récupérer les données du classement sélectionné");
  }

  const allDate = data.map((d) => d.date);
  const allDateSet = new Set(allDate);
  const allDateArray = Array.from(allDateSet);
  allDateArray.sort();
  const missingDate = [];
  for (let i = 0; i < allDateArray.length - 1; i++) {
    const date1 = new Date(allDateArray[i]);
    const date2 = new Date(allDateArray[i + 1]);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      for (let j = 1; j < diffDays; j++) {
        const newDate = new Date(date1.getTime() + j * 24 * 60 * 60 * 1000);
        missingDate.push(newDate.toISOString().split('T')[0]);
      }
    }
  }
  // add missing date to data
  for (const date of missingDate) {
    data.push(
      {
        uuid: "00000000-0000-0000-0000-000000000000",
        username: "valeur manquante",
        date: date,
        value: 0,
        position: 1,
      } as RankingResponse[0]
    );
  }

  data = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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