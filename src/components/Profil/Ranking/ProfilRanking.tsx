import React, { Suspense } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProfilRankingSectionServer } from "@/components/Profil/Ranking/ProfilRankingSectionServer";
import { RankingSelectorCard } from "@/components/Ranking/RankingSelector";
import { RankingType, searchParamsProfilPage } from "@/types";

/**
 * Displays the profile ranking section with a ranking selector and the rankings list.
 *
 * @param searchParams Profil search Params
 */
export function ProfilRankingSection({ searchParams }: { searchParams: searchParamsProfilPage }) {
  let rankingType: RankingType | undefined = RankingType.money;
  if (searchParams.category !== undefined) {
    rankingType = searchParams.category as (RankingType | undefined);
  }

  if (rankingType === undefined) {
    rankingType = RankingType.money;
  }

  return (
    <div className="flex flex-col gap-2">
      <RankingSelectorCard rankingType={rankingType} rankingPage={false}/>
      <Card className="w-full h-[calc(100vh-35vh)]">
        <Suspense fallback={<ProfilRankingSectionFallBack/>}>
          <ProfilRankingSectionServer rankingType={rankingType} searchParams={searchParams}/>
        </Suspense>
      </Card>
    </div>
  );
}

function ProfilRankingSectionFallBack() {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement de l&apos;historique du joueur...
      </CardTitle>
    </CardHeader>
  </Card>);
}
