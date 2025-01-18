import { ServerPaladiumStatusResponse, StatusPeriode } from "@/types";
import { redirect } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import PlotStatusChart from "@/components/Status/PlotStatusChart.tsx";
import { getStatusPaladium } from "@/lib/api/apiPalaTracker.ts";

export type GraphStatusProps = {
  periode: StatusPeriode,
}

export default async function GraphStatus({ periode: periode }: GraphStatusProps) {
  let data = [] as ServerPaladiumStatusResponse[];
  try {
    switch (periode) {
      case "day":
      case "week":
      case "month":
      case "season":
        data = await getStatusPaladium(periode);
        break;
      default:
        data = [];
    }
  } catch (e) {
    redirect("/error?message=Impossible de récupérer les données de status du serveur");
  }

  return (
    <PlotStatusChart data={data} periode={periode}/>
  )
}

export function GraphStatusFallback() {
  return <div className="flex flex-row gap-2 m-4 w-96 items-center">
    <LoadingSpinner size={4}/>
    <h2 className="font-bold">Chargement du graphique...</h2>
  </div>
}