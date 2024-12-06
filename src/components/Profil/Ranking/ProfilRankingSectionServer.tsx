import 'server-only';
import React from "react";
import { getRankingLeaderboardPlayer } from "@/lib/api/apiPalaTracker.ts";
import { RankingResponse, RankingType } from "@/types";
import { cookies } from "next/headers";
import { ZoomableChart } from "@/components/Ranking/zoomable-graph.tsx";

export async function ProfilRankingSectionServer({ rankingType }: { rankingType: RankingType }) {
  const cookieStore = await cookies()
  const uuid = cookieStore.get('uuid' as any)?.value;
  if (uuid === undefined) {
    return <div>Impossible de récupérer l&apos;uuid du joueur via les cookies</div>;
  }

  let data = await getRankingLeaderboardPlayer(uuid, rankingType).catch(() => {
    return [] as RankingResponse;
  });

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
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        value: 0,
        position: 1,
      }
    );
  }

  data = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return <ZoomableChart data={data}/>;
}