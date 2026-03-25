"use client";
import { AxisConfig, Dataset, RankingType } from "@/types";
import { GenericSectionTabs, TabData } from "../shared/section.client";
import { getRankingLeaderboardAction, getRankingLeaderboardPlayerUsernameAction } from "@/lib/api/api-server-action.server";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getImagePathFromRankingType, rankingTypeToUserFriendlyText } from "@/lib/misc";
import { RankingAddPlayerInput } from "./graph-add-player.client";
import { LineRenderer } from "../shared/graph-line-renderer.client";
import { ChartContainer } from "../shared/graph.client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { GraphLegends } from "../shared/graph-legends.client";

/**
 * Display the ranking section tabs and tabs content.
 */
export function RankingSectionSelector({ username }: { username?: string }) {
  const GenerateLabel = (rankingType: RankingType) => {
    return <UnOptimizedImage src={getImagePathFromRankingType(rankingType)} alt={rankingType} width={48} height={48} unoptimized={true}
      className="h-8 w-8 pixelated rounded-md mx-2"/>;
  };

  const tabs: TabData<RankingType>[] =
    [
      { key: RankingType.money, label: GenerateLabel(RankingType.money), content: () => <FetchLeaderboardData rankingType={RankingType.money} username={username} /> },
      { key: RankingType["job.alchemist"], label: GenerateLabel(RankingType["job.alchemist"]), content: () => <FetchLeaderboardData rankingType={RankingType["job.alchemist"]} username={username} /> },
      { key: RankingType["job.hunter"], label: GenerateLabel(RankingType["job.hunter"]), content: () => <FetchLeaderboardData rankingType={RankingType["job.hunter"]} username={username} /> },
      { key: RankingType["job.miner"], label: GenerateLabel(RankingType["job.miner"]), content: () => <FetchLeaderboardData rankingType={RankingType["job.miner"]} username={username} /> },
      { key: RankingType["job.farmer"], label: GenerateLabel(RankingType["job.farmer"]), content: () => <FetchLeaderboardData rankingType={RankingType["job.farmer"]} username={username} /> },
      { key: RankingType.boss, label: GenerateLabel(RankingType.boss), content: () => <FetchLeaderboardData rankingType={RankingType.boss} username={username} /> },
      { key: RankingType.egghunt, label: GenerateLabel(RankingType.egghunt), content: () => <FetchLeaderboardData rankingType={RankingType.egghunt} username={username} /> },
      { key: RankingType.koth, label: GenerateLabel(RankingType.koth), content: () => <FetchLeaderboardData rankingType={RankingType.koth} username={username} /> },
      { key: RankingType.clicker, label: GenerateLabel(RankingType.clicker), content: () => <FetchLeaderboardData rankingType={RankingType.clicker} username={username} /> },
      { key: RankingType.vote, label: GenerateLabel(RankingType.vote), content: () => <FetchLeaderboardData rankingType={RankingType.vote} username={username} /> },
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
function FetchLeaderboardData({ rankingType, username }: { rankingType: RankingType, username?: string }) {
  const router = useRouter();
  const [data, setData] = useState<Dataset<Date, number>[]>([]);
  const [addedPlayerUsername, setAddedPlayerUsername] = useState<Set<string>>(new Set());

  useEffect(() => {
    setData([]); // eslint-disable-line react-hooks/set-state-in-effect
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
    if (username) {
      const fetchData = async () => {
        const datasets: Dataset<Date, number>[] = [];
        try {
          const userData = await getRankingLeaderboardPlayerUsernameAction(username, rankingType);
          datasets.push({
            id: userData.at(0)?.username ?? username,
            name: userData.at(0)?.username ?? username,
            color: color[0],
            visibility: true,
            yAxisId: "y-axis",
            stats: userData.map(e => ({ x: new Date(e.date), y: e.value }))
          });
        } catch (e) {
          console.error(e);
        }

        const addedUsers = Array.from(addedPlayerUsername).filter(u => u.toLowerCase() !== username.toLowerCase());
        for (let i = 0; i < addedUsers.length; i++) {
          try {
            const u = addedUsers[i];
            const userData = await getRankingLeaderboardPlayerUsernameAction(u, rankingType);
            datasets.push({
              id: userData.at(0)?.username ?? u,
              name: userData.at(0)?.username ?? u,
              color: color[(i + 1) % color.length],
              visibility: true,
              yAxisId: "y-axis",
              stats: userData.map(e => ({ x: new Date(e.date), y: e.value }))
            });
          } catch (e) {
            console.error(e);
          }
        }
        setData(datasets);
      };
      fetchData();
      return;
    }

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
      }).sort((a, b) => {
        const lastA = a.stats[a.stats.length - 1]?.y ?? 0;
        const lastB = b.stats[b.stats.length - 1]?.y ?? 0;
        return lastB - lastA;
      }).map((e, index) => {
        return { ...e, visibility: index < 5 };
      }));

      const topUsernameLowerCase = new Set<string>(e.map(entry => Object.keys(entry)[0].toLocaleLowerCase()));
      const addedPlayerUsernameLowerCase = new Set<string>(Array.from(addedPlayerUsername).map(e => e.toLocaleLowerCase()));

      Array.from(addedPlayerUsernameLowerCase.difference(topUsernameLowerCase)).forEach((username, index) => {
        getRankingLeaderboardPlayerUsernameAction(username, rankingType).then(userData => {
          setData(prevData => {
            prevData.push({
              id: userData.at(0)?.username ?? `${Math.random()}`,
              name: userData.at(0)?.username ?? username,
              color: color[(prevData.length + index) % color.length],
              visibility: true,
              yAxisId: "y-axis",
              stats: userData.map(e => {
                return {
                  x: new Date(e.date),
                  y: e.value,
                };
              })
            });
            return [...prevData];
          });
        });
      });
    }).catch((e) => {
      console.error(e);
      router.push(`/error?message=${encodeURIComponent("Impossible de récupérer les données du classement sélectionné")}`);
    });

  }, [rankingType, router, addedPlayerUsername, username]);

  const axes: AxisConfig[] = [
    { id: "x-axis", position: "bottom", type: "date" },
    { id: "y-axis", position: "left", type: "number" },
  ];

  return (<>
    <div className="w-full p-4 md:p-6 rounded-lg relative">
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
      <RankingAddPlayerInput handleAddPlayer={(username) => setAddedPlayerUsername(prev => new Set(prev).add(username))}/>

      <GraphLegends data={data.toSorted((a, b) => {
        const lastA = a.stats[a.stats.length - 1]?.y ?? 0;
        const lastB = b.stats[b.stats.length - 1]?.y ?? 0;
        return lastB - lastA;
      })} toggleVisibility={toggleVisibility} handleHighlight={handleHighlight} className="lg:col-span-2"/>
    </div>
  </>);
}