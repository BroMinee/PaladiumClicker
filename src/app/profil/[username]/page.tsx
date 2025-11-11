import ProfileFetcherWrapper from "@/components/ProfileFetcher";
import { generateProfilUrl, isProfilSection } from "@/lib/misc";
import ProfilSelector from "@/components/Profil/ProfilSelector";
import { ProfilSectionEnum } from "@/types";
import { redirect } from "next/navigation";
import ProfilSelectorDisplay from "@/components/Profil/ProfilSelectorDisplay";

/**
 * Generate Metadata
 * @param props.params - Search parameter
 */
export async function generateMetadata(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  return {
    title: `PalaTracker | Profil | ${params.username}`,
    description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝",
    openGraph: {
      title: `PalaTracker | Profil | ${params.username}`,
      description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝"
    },
  };
}

type searchParamsProfilPage = {
  section?: string,
}

/**
 * [Profil page](https://palatracker.bromine.fr/profil/BroMine__)
 * @param props.params - Username
 * @param props.searchParams - Search parameter
 */
export default async function Home(
  props: {
    params: Promise<{ username: string }>,
    searchParams: Promise<searchParamsProfilPage>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
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
  );
}