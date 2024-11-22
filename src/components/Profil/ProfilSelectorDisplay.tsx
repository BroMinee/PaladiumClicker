import ProfilInfo from "@/components/Profil/ProfilInfo.tsx";
import MetierList from "@/components/MetierList.tsx";
import AhInfo from "@/components/Profil/AhInfo.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import FactionInfo from "@/components/Profil/FactionInfo.tsx";
import { redirect } from "next/navigation";
import { generateProfilUrl, isProfilSection } from "@/lib/misc.ts";
import { ProfilSectionEnum } from "@/types";
import { AchievementsProfilSection } from "@/components/Profil/Achievement/AchievementsProfilSection.tsx";
import { PetCanvas } from "@/components/Profil/Pet/PetMontureCanvas.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

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
      <CardContent className="flex flex-grow justify-between">
        <div style={{ width: "50%" }}>
          <PetCanvas/>
        </div>
        <div style={{ width: "50%" }}>
          <PetCanvas monture/>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfilSelectorDisplay;