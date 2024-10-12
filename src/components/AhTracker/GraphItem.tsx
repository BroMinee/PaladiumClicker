import 'server-only'

import { AhItemHistory, OptionType } from "@/types";
import { getPaladiumAhItemFullHistory } from "@/lib/api/apiPala.ts";
import { redirect } from "next/navigation";
import PlotHistoricChart from "@/components/AhTracker/PlotHistoricChart.tsx";
import { Card } from "@/components/ui/card.tsx";


export default async function GraphItem({ item }: { item: OptionType }) {
  let data = [] as AhItemHistory[];
  try {
    data = await getPaladiumAhItemFullHistory(item.value);
  } catch (e) {
    redirect("/error?message=Impossible de récupérer les données de l'item sélectionné");
  }

  return (
    <Card className="w-full">
      <PlotHistoricChart data={data}/>
    </Card>

  )
}