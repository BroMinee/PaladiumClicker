import { RankingResponse, RankingType } from "@/types";
import { redirect } from "next/navigation";
import { getRankingLeaderboard, getRankingLeaderboardPlayerUsername, } from "@/lib/api/apiPalaTracker.ts";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import React from "react";
import { ZoomableChart } from "@/components/Ranking/zoomable-graph.tsx";
import { searchParamsRankingPage } from "@/components/Ranking/RankingSelector.tsx";

export default async function GraphRanking({ rankingType, searchParams }: {
  rankingType: RankingType,
  searchParams: searchParamsRankingPage
}) {
  let data = [] as RankingResponse;
  try {
    data = await getRankingLeaderboard(rankingType);
  } catch (e) {
    redirect("/error?message=Impossible de récupérer les données du classement sélectionné");
  }


  let usernames = searchParams.usernames ? searchParams.usernames.split(',') : [];
  let noUsernames = searchParams.noUsernames ? searchParams.noUsernames.toLowerCase().split(',') : [];
  usernames = usernames.filter((username) => !noUsernames.includes(username.toLowerCase()));

  for (let i = 0; i < usernames.length; i++) {
    let dataUser = await getRankingLeaderboardPlayerUsername(usernames[i], rankingType).catch(() => {
      return [] as RankingResponse;
    });
    data = data.concat(dataUser);
  }

  data = data.filter((d) => noUsernames.indexOf(d.username.toLowerCase()) === -1);

  const allDate = data.map((d) => d.date);
  const allDateSet = new Set(allDate);
  const allDateArray = Array.from(allDateSet);
  allDateArray.sort();
  const missingDate: Date[] = [];
  for (let i = 0; i < allDateArray.length - 1; i++) {
    const date1 = new Date(allDateArray[i]);
    const date2 = new Date(allDateArray[i + 1]);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      for (let j = 1; j < diffDays; j++) {
        const newDate = new Date(date1.getTime() + j * 24 * 60 * 60 * 1000);
        missingDate.push(newDate);
      }
    }
  }
  // add missing date to data
  for (const date of missingDate) {
    data.push(
      {
        uuid: "00000000-0000-0000-0000-000000000000",
        username: "valeur manquante",
        date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        value: 0,
        position: 1,
      }
    );
  }

  data = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ZoomableChart data={data} rankingType={rankingType} profil={false}/>
  )
}

export function GraphRankingFallback() {
  return <div className="flex flex-row gap-2 m-4 w-96 items-center">
    <LoadingSpinner size={4}/>
    <h2 className="font-bold">Chargement du graphique...</h2>
  </div>
}