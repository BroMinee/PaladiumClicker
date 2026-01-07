import { ProfileFetcherWrapper } from "@/components/profile-fetcher.client";
import { Banner } from "@/components/profile/banner.client";
import { ProfileSectionSelector } from "@/components/profile/inputs.client";
import { PlayerStats } from "@/components/profile/player-stats.client";
import { PlayerSkin } from "@/components/profile/player-skin.client";
import { PlayerUsername } from "@/components/profile/player-username.client";
import { PlayerRank } from "@/components/profile/player-rank.client";
import { PlayerFactionName } from "@/components/profile/player-faction.client";
import { JobsCard } from "@/components/profile/player-jobs";
import { FactionEmblemClient } from "@/components/profile/faction/faction-emblem.client";
import { TwitchOverlayButton } from "@/components/shared/twitch-overlay-button.client";

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

/**
 * [Profile page](https://palatracker.bromine.fr/profil/BroMine__)
 */
export default async function ProfilePage(
  props: {
    params: Promise<{ username: string }>,
  }
) {
  const params = await props.params;

  return (<ProfileFetcherWrapper username={params.username}>
    <TwitchOverlayButton/>
    <div className="relative rounded-lg overflow-hidden h-64 md:h-80 mb-8">
      <Banner/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

      <div className="absolute bottom-0 left-0 p-4 md:p-6 flex items-end space-x-4">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-secondary overflow-hidden border-4 border-gray-800 ">
          <PlayerSkin/>
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-bold backdrop-blur-sm rounded drop- px-2 text-left">
            <PlayerUsername/>
          </h1>
          <div className="flex items-center mt-2 gap-2">
            <span
              className="text-xl font-bold backdrop-blur-sm rounded drop- text-center p-1"
            >
              <PlayerRank/>
            </span>
            <span
              className="text-xl font-bold backdrop-blur-sm rounded drop- text-center p-1"
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

  </ProfileFetcherWrapper>);
}