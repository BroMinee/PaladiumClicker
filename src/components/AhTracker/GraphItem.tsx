import 'server-only'

import { AhItemHistory, OptionType } from "@/types";
import { getPaladiumAhItemFullHistory } from "@/lib/api/apiPala.ts";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card.tsx";
import { PlotHistoricChart } from "@/components/AhTracker/PlotHistoricChart.tsx";


export default async function GraphItem({ item }: { item: OptionType }) {
  let data = [] as AhItemHistory[];
  try {
    data = await getPaladiumAhItemFullHistory(item.value);
  } catch (e) {
    redirect("/error?message=Impossible de récupérer les données de l'item sélectionné");
  }

  return (
    <Card className="h-[calc(100vh-55vh)]">
      <PlotHistoricChart data={data}/>
    </Card>
  )
}