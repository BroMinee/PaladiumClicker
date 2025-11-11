import { PlayerCountHistory, ValueHistory } from "@/types";
import { getPlayerCountHistoryPaladium } from "@/lib/api/apiPalaTracker";
import { PlotSingleValueChart } from "@/components/Status/PlotSingleValueChart";

/**
 * Fetches the player count history and renders it in a chart.
 */
export async function GraphPlayerCount() {

  let data = [] as PlayerCountHistory;
  try {
    data = await getPlayerCountHistoryPaladium();
  } catch (e) {
    console.error(e);
  }

  const d: ValueHistory = data.map((el) => {
    return {
      date: el.date,
      value: el.player_count
    };
  });

  return (
    <PlotSingleValueChart data={d} labelName={"Joueurs uniques"} className={"h-[calc(100vh-80vh)] min-h-[calc(100vh-60vh)]"}/>
  );
}