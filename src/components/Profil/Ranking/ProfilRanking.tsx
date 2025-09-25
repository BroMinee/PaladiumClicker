import React, { Suspense } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import { ProfilRankingSectionServer } from "@/components/Profil/Ranking/ProfilRankingSectionServer.tsx";
import { RankingSelectorCard } from "@/components/Ranking/RankingSelector.tsx";
import { RankingType } from "@/types";
import { searchParamsProfilPage } from "@/components/Profil/ProfilSelectorDisplay.tsx";

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

export function ProfilRankingSectionFallBack() {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement de l&apos;historique du joueur...
      </CardTitle>
    </CardHeader>
  </Card>);
}

