import { AdminShopItem, AdminShopItemDetail } from "@/types";
import { redirect } from "next/navigation";
import { getAdminShopHistory } from "@/lib/api/apiPalaTracker.ts";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import PlotAdminShopChart from "@/components/AdminShop/PlotAdminShopChart.tsx";

export default async function GraphAdminShop({ item }: { item: AdminShopItem }) {
  let data = [] as AdminShopItemDetail[];
  try {
    data = await getAdminShopHistory(item);
  } catch (e) {
    redirect("/error?message=Impossible de récupérer les données de l'item sélectionné");
  }


  return (
    <PlotAdminShopChart data={data}/>
  )
}

export function GraphAdminShopFallback() {
  return <div className="flex flex-row gap-2 m-4 w-96 items-center">
    <LoadingSpinner size={4}/>
    <h2 className="font-bold">Chargement du graphique...</h2>
  </div>
}