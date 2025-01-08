import { AdminShopItem, AdminShopItemDetail, AdminShopPeriode } from "@/types";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import PlotAdminShopChart from "@/components/AdminShop/PlotAdminShopChart.tsx";
import {
  getItemHistoryDay,
  getItemHistoryMonth,
  getItemHistorySeason,
  getItemHistoryWeek
} from "@/lib/database/adminShop_database.ts";
import { redirect } from "next/navigation";

export type GraphAdminShopProps = {
  item: AdminShopItem,
  periode: AdminShopPeriode,
}

export default async function GraphAdminShop({ item, periode }: GraphAdminShopProps) {
  let data = [] as AdminShopItemDetail[];
  try {
    switch (periode) {
      case "day":
        data = await getItemHistoryDay(item);
        break;
      case "week":
        data = await getItemHistoryWeek(item);
        break;
      case "month":
        data = await getItemHistoryMonth(item);
        break;
      case "season":
        data = await getItemHistorySeason(item);
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
  )
}

export function GraphAdminShopFallback() {
  return <div className="flex flex-row gap-2 m-4 w-96 items-center">
    <LoadingSpinner size={4}/>
    <h2 className="font-bold">Chargement du graphique...</h2>
  </div>
}