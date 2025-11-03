import { AdminShopItem, AdminShopItemDetail, AdminShopPeriod } from "@/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import PlotAdminShopChart from "@/components/AdminShop/PlotAdminShopChart.tsx";

import { redirect } from "next/navigation";
import { getAdminShopHistory } from "@/lib/api/apiPalaTracker.ts";

export type GraphAdminShopProps = {
  item: AdminShopItem,
  periode: AdminShopPeriod,
}

/**
 * Displays an admin shop statistics chart for a given item over a selected period.
 *
 * Fetches the admin shop history for the specified item and time period, then renders
 * a chart based on the retrieved data. If the fetch fails, the user is redirected
 * to an error page.
 *
 * @param item - the Item we want to display.
 * @param periode - The current period used in the graph display.
 */
export default async function GraphAdminShop({ item, periode }: GraphAdminShopProps) {
  let data = [] as AdminShopItemDetail[];
  try {
    switch (periode) {
    case "day":
    case "week":
    case "month":
    case "season":
      data = await getAdminShopHistory(item, periode);
      break;
    default:
      data = [];
    }
  } catch (error) {
    console.error("Error getting item history:", error);
    redirect("/error?message=Impossible de récupérer les données de l'item sélectionné");
  }

  return (
    <PlotAdminShopChart data={data} periode={periode}/>
  );
}

/**
 * Component used when the graphic is loading.
 * Displays a loading spinner.
 */
export function GraphAdminShopFallback() {
  return <div className="flex flex-row gap-2 m-4 w-96 items-center">
    <LoadingSpinner size={4}/>
    <h2 className="font-bold">Chargement du graphique...</h2>
  </div>;
}