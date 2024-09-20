import ProfileFetcherWrapper from "@/components/ProfileFetcher.tsx";
import MetierList from "@/components/MetierList.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import ProfilInfo from "@/components/Profil/ProfilInfo.tsx";
import AhInfo from "@/components/Profil/AhInfo.tsx";
import FactionInfo from "@/components/Profil/FactionInfo.tsx";
import { generateProfilUrl, isProfilSection } from "@/lib/misc.ts";
import { getFactionInfo, getJobsFromUUID, getPaladiumProfileByPseudo } from "@/lib/api/apiPala.ts";
import { formatPrice, generateProfilUrl, isProfilSection } from "@/lib/misc.ts";
import ProfilSelector from "@/components/Profil/ProfilSelector.tsx";
import { ProfilSectionEnum } from "@/types";
import { redirect } from "next/navigation";
import ProfilSelectorDisplay from "@/components/Profil/ProfilSelectorDisplay.tsx";


export async function generateMetadata(
  { params }: { params: { username: string } },
) {
  return {
    title: `PalaTracker - Profil - ${params.username}`,
    description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝",
    openGraph: {
      title: `PalaTracker - Profil ${params.username}`,
      description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝"
    },
  }
}

export type searchParamsProfilPage = {
  section?: string,
}

export default function Home({ params, searchParams }: {
  params: { username: string },
  searchParams: searchParamsProfilPage
}) {
  if (!isProfilSection(searchParams.section)) {
    redirect(generateProfilUrl(params.username, ProfilSectionEnum.Home));
  }

  return (
    <ProfileFetcherWrapper username={params.username}>
      <ProfilSelector/>
      <div className="flex flex-col gap-4">
        <ProfilSelectorDisplay params={params} searchParams={searchParams}/>
      </div>
    </ProfileFetcherWrapper>
  )
}