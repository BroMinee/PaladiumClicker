import 'server-only'

import { AhItemHistory } from "@/types";
import { getPaladiumAhItemFullHistory } from "@/lib/api/apiPala.ts";
import { redirect } from "next/navigation";
import PlotTest from "@/components/AhTracker/PlotTest.tsx";
import { Card } from "@/components/ui/card.tsx";


export default async function GraphItem({ selectedItem }: { selectedItem: string }) {
  let data = [] as AhItemHistory[];
  try {
    data = await getPaladiumAhItemFullHistory(selectedItem);
  } catch (e) {
    console.error(e);
  }

  if (data.length === 0)
    redirect("/error?message=Impossible de récupérer les données de l'item sélectionné");


  return (
    <Card className="w-full">
      <PlotTest data={data}/>
    </Card>

  )
}