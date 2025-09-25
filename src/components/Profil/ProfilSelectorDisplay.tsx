import ProfilInfo from "@/components/Profil/ProfilInfo.tsx";
import MetierList from "@/components/MetierList.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import FactionInfo from "@/components/Profil/FactionInfo.tsx";
import { redirect } from "next/navigation";
import { generateProfilUrl, isProfilSection } from "@/lib/misc.ts";
import { ProfilSectionEnum } from "@/types";
import {
  AchievementsProfilSection,
  AchievementsProfilSectionFallBack,
  MarketProfilSectionFallBack
} from "@/components/Profil/Achievement/AchievementsProfilSection.tsx";
import { PetCanvas } from "@/components/Profil/Pet/PetMontureCanvas.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import React, { Suspense } from "react";
import { ProfilRankingSection } from "@/components/Profil/Ranking/ProfilRanking.tsx";
import AhInfo from "@/components/Profil/AhInfo.tsx";
import { ErrorBoundary } from "@/components/Profil/ErrorProfilErrorBoundary";

export type searchParamsProfilPage = { section?: string, category?: string, usernames?: string }

export function ProfilSelectorDisplay({ params, searchParams }: {
  params: { username: string },
  searchParams: searchParamsProfilPage
}) {


  if (searchParams.section === undefined)
    searchParams.section = ProfilSectionEnum.Home;

  if (!isProfilSection(searchParams.section)) {
    redirect(generateProfilUrl(params.username as string, ProfilSectionEnum.Home));
  }

  const sectionAsEnum = searchParams.section as ProfilSectionEnum;
  switch (sectionAsEnum) {
    case ProfilSectionEnum.Home:
      return <HomeProfilSection/>;
    case ProfilSectionEnum.Achievements:
      return <Suspense fallback={<AchievementsProfilSectionFallBack/>}>
        <AchievementsProfilSection/>
      </Suspense>;
    case ProfilSectionEnum.Market:
      return <Suspense fallback={<MarketProfilSectionFallBack/>}>
        <AhInfo/>
      </Suspense>;
    case ProfilSectionEnum["Pet/Monture"]:
      return <PetMontureProfilSection/>;
    case ProfilSectionEnum.Classement:
      return <ProfilRankingSection searchParams={searchParams}/>;
    default:
      return <div>C&apos;est quoi la section ${sectionAsEnum} ?</div>;
  }
}

function HomeProfilSection() {
  return <>
    <ProfilInfo/>
    <MetierList editable={false}/>
    <HeadingSection>Informations de faction</HeadingSection>
    <FactionInfo/>
  </>;
}

function PetMontureProfilSection() {
  return (
    <Card className="rounded-b-xl rounded-t-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Voici vos animaux de compagnie et montures favoris
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-1/2">
          <ErrorBoundary fallback={<PetCanvasFallback/>} >
            <PetCanvas/>
          </ErrorBoundary>
        </div>
        <div className="w-full lg:w-1/2">
        <ErrorBoundary fallback={<MontureCanvasFallback/>} >
            <PetCanvas monture/>
          </ErrorBoundary>
        </div>
      </CardContent>
    </Card>
  );
}

function PetCanvasFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 border rounded-md bg-muted text-muted-foreground">
      Erreur lors rendu du pet.
      <canvas hidden></canvas>
    </div>
  );
}

function MontureCanvasFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 border rounded-md bg-muted text-muted-foreground">
      Erreur lors rendu de la monture.
      <canvas hidden></canvas>
    </div>
  );
}

export default ProfilSelectorDisplay;