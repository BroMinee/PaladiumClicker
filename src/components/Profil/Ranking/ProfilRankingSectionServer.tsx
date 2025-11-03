import "server-only";
import React from "react";
import { getRankingLeaderboardPlayerUsername, getRankingLeaderboardPlayerUUID } from "@/lib/api/apiPalaTracker.ts";
import { RankingResponse, RankingType, searchParamsProfilPage } from "@/types";
import { cookies } from "next/headers";
import { ZoomableChart } from "@/components/Ranking/zoomable-graph.tsx";
import { addMissingDate } from "@/lib/misc.ts";

/**
 * Server component that fetches and displays ranking data for the current user
 * (and optionally additional usernames) in a zoomable chart.
 *
 * @param rankingType Type of ranking to display
 * @param searchParams Query parameters that may include usernames to compare
 */
export async function ProfilRankingSectionServer({ rankingType, searchParams }: {
  rankingType: RankingType,
  searchParams: searchParamsProfilPage
}) {
  const cookieStore = await cookies();
  const uuid = cookieStore.get("uuid" as any)?.value ?? "10b887ce-133b-4d5e-8b54-41376b832536";
  if (uuid === undefined) {
    return <div>Impossible de récupérer l&apos;uuid du joueur via les cookies</div>;
  }

  let data = await getRankingLeaderboardPlayerUUID(uuid, rankingType).catch(() => {
    return [] as RankingResponse;
  });

  const usernames = searchParams.usernames ? searchParams.usernames.split(",") : [];

  for (let i = 0; i < usernames.length; i++) {
    const dataUser = await getRankingLeaderboardPlayerUsername(usernames[i], rankingType).catch(() => {
      return [] as RankingResponse;
    });
    data = data.concat(dataUser);
  }

  data = addMissingDate(data);

  return <ZoomableChart data={data} rankingType={rankingType} profil={true}/>;
}