import { MoneySumHistory, ValueHistory } from "@/types";
import { getMoneySumHistoryPaladium } from "@/lib/api/apiPalaTracker.ts";
import { PlotSingleValueChart } from "@/components/Status/PlotSingleValueChart.tsx";

export default async function GraphMoneySum() {

  let data = [] as MoneySumHistory;
  try {
    data = await getMoneySumHistoryPaladium();
  } catch (e) {
    console.error(e);
  }

  const d: ValueHistory = data.map((el) => {
    return {
      date: el.date,
      value: el.money_sum
    };
  });

  return (
    <PlotSingleValueChart data={d} labelName={"$ en jeu"} className={"h-[calc(100vh-60vh)] min-h-[calc(100vh-60vh)]"}/>
  );
}