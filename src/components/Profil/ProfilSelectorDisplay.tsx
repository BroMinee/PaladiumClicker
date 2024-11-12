import ProfilInfo from "@/components/Profil/ProfilInfo.tsx";
import MetierList from "@/components/MetierList.tsx";
import AhInfo from "@/components/Profil/AhInfo.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import FactionInfo from "@/components/Profil/FactionInfo.tsx";
import { redirect } from "next/navigation";
import { generateProfilUrl, isProfilSection } from "@/lib/misc.ts";
import { ProfilSectionEnum } from "@/types";
import { AchievementsProfilSection } from "@/components/Profil/Achievement/AchievementsProfilSection.tsx";

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
      return <AchievementsProfilSection/>
    case ProfilSectionEnum.Pet:
      return <PetProfilSection/>
    case ProfilSectionEnum.Monture:
      return <MontureProfilSection/>

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

function PetProfilSection() {
  return <div>Pet TODO</div>
}

function MontureProfilSection() {
  return <div>Monture TODO</div>
}

export default ProfilSelectorDisplay;