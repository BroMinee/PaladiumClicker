"use client";
import { AxisConfig, Dataset, RankingType } from "@/types";
import { GenericSectionTabs, TabData } from "../shared/section.client";
import { getRankingLeaderboardAction } from "@/lib/api/apiServerAction";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getImagePathFromRankingType, rankingTypeToUserFriendlyText } from "@/lib/misc";
import { RankingGraphLegends } from "./graph-legends.client";
import { RankingAddPlayerInput } from "./graph-add-player.client";
import { LineRenderer } from "../shared/graph-line-renderer.client";
import { ChartContainer } from "../shared/graph.client";
import { LoadingSpinner } from "../ui/loading-spinner";
import { UnOptimizedImage } from "../ui/image-loading";

/**
 * Display the ranking section tabs and tabs content.
 */
export function RankingSectionSelector() {
  const GenerateLabel = (rankingType: RankingType) => {
    return <UnOptimizedImage src={getImagePathFromRankingType(rankingType)} alt={rankingType} width={48} height={48} unoptimized={true}
      className="h-8 w-8 pixelated rounded-md mx-2"/>;
  };

  const tabs: TabData<RankingType>[] =
    [
      { key: RankingType.money, label: GenerateLabel(RankingType.money), content: () => <FetchLeaderboardData rankingType={RankingType.money} /> },
      { key: RankingType["job.alchemist"], label: GenerateLabel(RankingType["job.alchemist"]), content: () => <FetchLeaderboardData rankingType={RankingType["job.alchemist"]} /> },
      { key: RankingType["job.hunter"], label: GenerateLabel(RankingType["job.hunter"]), content: () => <FetchLeaderboardData rankingType={RankingType["job.hunter"]} /> },
      { key: RankingType["job.miner"], label: GenerateLabel(RankingType["job.miner"]), content: () => <FetchLeaderboardData rankingType={RankingType["job.miner"]} /> },
      { key: RankingType["job.farmer"], label: GenerateLabel(RankingType["job.farmer"]), content: () => <FetchLeaderboardData rankingType={RankingType["job.farmer"]} /> },
      { key: RankingType.boss, label: GenerateLabel(RankingType.boss), content: () => <FetchLeaderboardData rankingType={RankingType.boss} /> },
      { key: RankingType.egghunt, label: GenerateLabel(RankingType.egghunt), content: () => <FetchLeaderboardData rankingType={RankingType.egghunt} /> },
      { key: RankingType.koth, label: GenerateLabel(RankingType.koth), content: () => <FetchLeaderboardData rankingType={RankingType.koth} /> },
      { key: RankingType.clicker, label: GenerateLabel(RankingType.clicker), content: () => <FetchLeaderboardData rankingType={RankingType.clicker} /> },
      { key: RankingType.vote, label: GenerateLabel(RankingType.vote), content: () => <FetchLeaderboardData rankingType={RankingType.vote} /> },
    ];

  return (
    <GenericSectionTabs tabs={tabs} />
  );
}

const color = [
  "#ff0000",
  "#4f00c9",
  "#00b154",
  "#c99600",
  "#c900c6",
  "#00c988",
  "#7052d9",
  "#e6be00",
  "#c90000",
  "#0657ad"];

/**
 * Fetch the ranking data and display the page
 */
function FetchLeaderboardData({ rankingType }: { rankingType: RankingType }) {
  const router = useRouter();
  const [data, setData] = useState<Dataset<Date, number>[]>([]);

  useEffect(() => {
    setData([]);
  }, [rankingType]);

  function toggleVisibility(plt: Dataset<Date, number>) {
    setData(prev =>
      prev.map(e =>
        e.id === plt.id
          ? { ...e, visibility: !e.visibility }
          : e
      )
    );
  }

  function handleHighlight(plt: Dataset<Date, number>) {
    const someDisabled = data.some(plt => !plt.visibility);
    setData(prevData =>
      prevData.map(e => {
        if (someDisabled) {
          return { ...e, visibility: true };
        } else {
          if (e.id === plt.id) {
            return e;
          }

          return { ...e, visibility: false };
        }
      })
    );
  }
  useEffect(() => {

    getRankingLeaderboardAction(rankingType).then(e => {
      setData(e.map((plt, index) => {
        return {
          id: Object.keys(plt)[0],
          name: Object.keys(plt)[0],
          color: color[index % color.length],
          visibility: true,
          yAxisId: "y-axis",
          stats: plt[Object.keys(plt)[0]!].map(e => {
            return {
              x: new Date(e.date),
              y: e.value,
            };
          })
        };
      }));
    }).catch(() => {
      router.push(`/error?message=${encodeURIComponent("Impossible de récupérer les données du classement sélectionné")}`);
    });
  }, [rankingType, router]);

  const axes: AxisConfig[] = [
    { id: "x-axis", position: "bottom", type: "date" },
    { id: "y-axis", position: "left", type: "number" },
  ];

  return (<>
    <div className="w-full p-4 md:p-6 rounded-lg shadow-xl relative">
      <h2 className="text-2xl font-semibold mb-4">
        Classement - {rankingTypeToUserFriendlyText(rankingType)}
      </h2>
      <div className="flex w-full h-[550px] justify-center items-center">
        {data.length !== 0 ? <ChartContainer
          data={data}
          axisConfigs={axes}
          margin={{ top: 20, right: 60, bottom: 30, left: 100 }}
          renderContent={(props) => <LineRenderer {...props} />}
        /> : <LoadingSpinner size={24}/>}
      </div>
    </div>
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RankingAddPlayerInput />

      <RankingGraphLegends data={data} toggleVisibility={toggleVisibility} handleHighlight={handleHighlight} />
    </div>

  </>);
}