import { RankingResponse, RankingType } from "@/types";
import { redirect } from "next/navigation";
import { getRankingLeaderboard } from "@/lib/api/apiPalaTracker.ts";
import PlotRankingChart from "@/components/Clicker-Optimizer/PlotRankingChart.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

export default async function GraphItem({ rankingType }: { rankingType: RankingType }) {
  let data = [] as RankingResponse;
  try {
    data = await getRankingLeaderboard(rankingType);
  } catch (e) {
    console.error(e);
  }

  if (data.length === 0)
    redirect("/error?message=Impossible de récupérer les données de l'item sélectionné");


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Voir l&apos;évolution du top 10
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0 pb-0 max-w-7xl w-full h-5/6">
        <DialogHeader className="px-6">
          <DialogTitle className="text-primary">Evolution du top 10</DialogTitle>
        </DialogHeader>
        <PlotRankingChart data={data}/>
      </DialogContent>
    </Dialog>
  )
}