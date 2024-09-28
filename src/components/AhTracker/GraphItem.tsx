import 'server-only'

import { AhItemHistory } from "@/types";
import { getPaladiumAhItemFullHistory } from "@/lib/api/apiPala.ts";
import { redirect } from "next/navigation";
import PlotHistoricChart from "@/components/AhTracker/PlotHistoricChart.tsx";
import { Card } from "@/components/ui/card.tsx";


export default async function GraphItem({ selectedItem }: { selectedItem: string }) {
  let data = [] as AhItemHistory[];
  try {
    data = await getPaladiumAhItemFullHistory(selectedItem);
  } catch (e) {
    redirect("/error?message=Impossible de récupérer les données de l'item sélectionné");
  }

  return (
    <Card className="w-full">
      <PlotHistoricChart data={data}/>
    </Card>

  )
}