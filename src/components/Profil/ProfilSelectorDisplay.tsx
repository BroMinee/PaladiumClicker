import ProfilInfo from "@/components/Profil/ProfilInfo.tsx";
import MetierList from "@/components/MetierList.tsx";
import AhInfo from "@/components/Profil/AhInfo.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import FactionInfo from "@/components/Profil/FactionInfo.tsx";
import { redirect } from "next/navigation";
import { generateProfilUrl, isProfilSection } from "@/lib/misc.ts";
import { ProfilSectionEnum } from "@/types";
import {
  AchievementsProfilSection,
  AchievementsProfilSectionFallBack
} from "@/components/Profil/Achievement/AchievementsProfilSection.tsx";
import { PetCanvas } from "@/components/Profil/Pet/PetMontureCanvas.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import React, { Suspense } from "react";

export function ProfilSelectorDisplay({ params, searchParams }: {
  params: { username: string },
  searchParams: { section?: string }
}) {


  if(searchParams.section === undefined)
    searchParams.section = ProfilSectionEnum.Home;

  if (!isProfilSection(searchParams.section)) {
    redirect(generateProfilUrl(params.username as string, ProfilSectionEnum.Home));
  }

  const sectionAsEnum = searchParams.section as ProfilSectionEnum;
  switch (sectionAsEnum) {
    case ProfilSectionEnum.Home:
      return <HomeProfilSection/>
    case ProfilSectionEnum.Achievements:
      return <Suspense fallback={<AchievementsProfilSectionFallBack/>}>
        <AchievementsProfilSection/>
      </Suspense>
    case ProfilSectionEnum["Pet/Monture"]:
      return <PetMontureProfilSection/>

    default:
      return <div>C&apos;est quoi la section ${sectionAsEnum} ?</div>
  }
}

function HomeProfilSection() {
  return <>
    <ProfilInfo/>
    <MetierList editable={false}/>
    <AhInfo/>
    <HeadingSection>Informations de faction</HeadingSection>
    <FactionInfo/>
  </>
}

function PetMontureProfilSection() {
  return (
    <Card className="rounded-b-xl rounded-t-none">
      <CardContent className="flex flex-grow flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-1/2">
          <PetCanvas/>
        </div>
        <div className="w-full lg:w-1/2">
          <PetCanvas monture/>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfilSelectorDisplay;