import { RankingResponse, RankingType } from "@/types";
import { redirect } from "next/navigation";
import { getRankingLeaderboard, getRankingLeaderboardPlayerUsername, } from "@/lib/api/apiPalaTracker";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import React from "react";
import { ZoomableChart } from "@/components/Ranking/zoomable-graph";
import { searchParamsRankingPage } from "@/components/Ranking/RankingSelector";
import { addMissingDate } from "@/lib/misc";

/**
 * Server component that loads the top 10 ranking data (and optionally additional
 * usernames to compare), applies exclusions, fills missing dates, and renders
 * the zoomable ranking chart.
 *
 * @param rankingType Ranking category to display
 * @param searchParams Query params controlling included/excluded usernames
 */
export default async function GraphRanking({ rankingType, searchParams }: {
  rankingType: RankingType,
  searchParams: searchParamsRankingPage
}) {
  let data = [] as RankingResponse;
  try {
    data = await getRankingLeaderboard(rankingType) as any;
  } catch (_) {
    redirect("/error?message=Impossible de récupérer les données du classement sélectionné");
  }

  let usernames = searchParams.usernames ? searchParams.usernames.split(",") : [];
  const noUsernames = searchParams.noUsernames ? searchParams.noUsernames.toLowerCase().split(",") : [];
  usernames = usernames.filter((username) => !noUsernames.includes(username.toLowerCase()));

  for (let i = 0; i < usernames.length; i++) {
    const dataUser = await getRankingLeaderboardPlayerUsername(usernames[i], rankingType).catch(() => {
      return [] as RankingResponse;
    });
    data = data.concat(dataUser);
  }

  data = data.filter((d) => noUsernames.indexOf(d.username.toLowerCase()) === -1);

  data = addMissingDate(data);
  return (
    <ZoomableChart data={data} rankingType={rankingType} profil={false}/>
  );
}

/**
 * Fallback UI displayed while the ranking graph is loading.
 */
export function GraphRankingFallback() {
  return <div className="flex flex-row gap-2 m-4 w-96 items-center">
    <LoadingSpinner size={4}/>
    <h2 className="font-bold">Chargement du graphique...</h2>
  </div>;
}