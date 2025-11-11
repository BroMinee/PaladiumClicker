import { ServerPaladiumStatusResponse, StatusPeriod } from "@/types";
import { redirect } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PlotStatusChart } from "@/components/Status/PlotStatusChart";
import { getStatusPaladium } from "@/lib/api/apiPalaTracker";

type GraphStatusProps = {
  periode: StatusPeriod,
}

/**
 * Fetches the average player on the server for a given period and renders it as a line-plot chart.
 */
export async function GraphStatus({ periode }: GraphStatusProps) {
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
  } catch (_) {
    redirect("/error?message=Impossible de récupérer les données de status du serveur");
  }

  return (
    <PlotStatusChart data={data} periode={periode}/>
  );
}

/**
 * Fallback UI displayed while the server status chart is loading.
 */
export function GraphStatusFallback() {
  return <div className="flex flex-row gap-2 m-4 w-96 items-center">
    <LoadingSpinner size={4}/>
    <h2 className="font-bold">Chargement du graphique...</h2>
  </div>;
}