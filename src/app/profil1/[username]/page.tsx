import ProfileFetcherWrapper from "@/components/ProfileFetcher.client";
import { generateProfilUrl, isProfilSection } from "@/lib/misc";
import { ProfilSectionEnum } from "@/types";
import { redirect } from "next/navigation";
import { Banner } from "@/components/profile/banner.client";
import { ProfileSectionSelector } from "@/components/profile/inputs.clients";
import { PlayerStats } from "@/components/profile/player-stats.client";
import { PlayerSkin } from "@/components/profile/player-skin.client";
import { PlayerUsername } from "@/components/profile/player-username.client";
import { PlayerRank } from "@/components/profile/player-rank.client";
import { PlayerFactionName } from "@/components/profile/player-faction.client";
import { FactionEmblemClient } from "@/components/Profil/FactionInfoClient";
import { JobsCard } from "@/components/profile/player-jobs";

type searchParamsProfilPage = {
  section?: string,
}

/**
 * [Profile page](https://palatracker.bromine.fr/profil/BroMine__)
 */
export default async function ProfilePage(
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

  return (<ProfileFetcherWrapper username={params.username}>
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="relative rounded-lg shadow-lg overflow-hidden h-64 md:h-80 mb-8">
          <Banner/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

          <div className="absolute bottom-0 left-0 p-4 md:p-6 flex items-end space-x-4">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-700 overflow-hidden border-4 border-gray-800 shadow-xl">
              <PlayerSkin/>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white backdrop-blur-sm rounded drop-shadow-xl px-2 text-left">
                <PlayerUsername/>
              </h1>
              <div className="flex items-center mt-2 gap-2">
                <span
                  className="text-xl font-bold backdrop-blur-sm rounded drop-shadow-xl text-center p-1"
                >
                  <PlayerRank/>
                </span>
                <span
                  className="text-xl font-bold text-white backdrop-blur-sm rounded drop-shadow-xl text-center p-1"
                >
                  <span className="flex flex-row items-center gap-2">
                    <FactionEmblemClient className="w-12 h-12"/>
                    <PlayerFactionName/>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <PlayerStats/>
        <JobsCard/>
        <ProfileSectionSelector />
      </div>
    </div>

  </ProfileFetcherWrapper>);
}