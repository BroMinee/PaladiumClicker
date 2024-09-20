import ProfilInfo from "@/components/Profil/ProfilInfo.tsx";
import MetierList from "@/components/MetierList.tsx";
import AhInfo from "@/components/Profil/AhInfo.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import FactionInfo from "@/components/Profil/FactionInfo.tsx";
import { redirect } from "next/navigation";
import { generateProfilUrl, isProfilSection } from "@/lib/misc.ts";
import { ProfilSectionEnum } from "@/types";
import { AchievementsProfilSection } from "@/components/Profil/AchievementsProfilSection.tsx";

export function ProfilSelectorDisplay({ params, searchParams }: {
  params: { username: string },
  searchParams: { section?: string }
}) {

  if (searchParams.section === undefined || !isProfilSection(searchParams.section)) {
    redirect(generateProfilUrl(params.username as string, ProfilSectionEnum.Home));
  }

  const sectionAsEnum = searchParams.section as ProfilSectionEnum;
  switch (sectionAsEnum) {
    case ProfilSectionEnum.Home:
      return <HomeProfilSection/>
    case ProfilSectionEnum.Market:
      return <MarketProfilSection/>
    case ProfilSectionEnum.Achievements:
      return <AchievementsProfilSection/>
    case ProfilSectionEnum.Faction:
      return <FactionProfilSection/>
    case ProfilSectionEnum.Boss:
      return <BossProfilSection/>
    case ProfilSectionEnum.Clicker:
      return <ClickerProfilSection/>
    case ProfilSectionEnum.Cosmetics:
      return <CosmeticsProfilSection/>
    case ProfilSectionEnum.Friends:
      return <FriendsProfilSection/>
    case ProfilSectionEnum.Jobs:
      return <JobsProfilSection/>
    case ProfilSectionEnum.Pet:
      return <PetProfilSection/>
    case ProfilSectionEnum.Pvp:
      return <PvpProfilSection/>
    case ProfilSectionEnum.Showcase:
      return <ShowcaseProfilSection/>
    default:
      return <div>C&apos;est quoi la section ${sectionAsEnum} ?</div>
  }
}

function HomeProfilSection() {
  return <>
    <ProfilInfo/>


  </>
}

function MarketProfilSection() {
  return <>
    <AhInfo/>
  </>
}


function FactionProfilSection() {
  return (<>
    <HeadingSection>Informations de faction</HeadingSection>
    <FactionInfo/>
  </>);
}

function BossProfilSection() {
  return <div>Boss TODO</div>
}

function ClickerProfilSection() {
  return <div>Clicker TODO</div>
}

function CosmeticsProfilSection() {
  return <div>Cosmetics TODO</div>
}

function FriendsProfilSection() {
  return <div>Friends TODO</div>
}

function JobsProfilSection() {
  return <>
    <MetierList editable={false}/>
    TODO
  </>
}

function PetProfilSection() {
  return <div>Pet TODO</div>
}

function PvpProfilSection() {
  return <div>Pvp TODO</div>
}

function ShowcaseProfilSection() {
  return <div>Showcase TODO</div>
}

export default ProfilSelectorDisplay;