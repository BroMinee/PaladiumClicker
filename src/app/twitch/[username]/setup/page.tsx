import React from "react";
import ProfileFetcherWrapper from "@/components/ProfileFetcher";
import { TwitchOverlayConfig } from "@/components/Twitch/TwitchOverlayConfig";

/**
 * Generate Metadata
 */
export function generateMetadata() {
  return {
    title: "PalaTracker | Twitch",
    description: "Obtiens un overlay twitch avec tes niveaux de métiers",
    openGraph: {
      title: "PalaTracker | Twitch",
      description: "Obtiens un overlay twitch avec tes niveaux de métiers"
    },
  };
}

/**
 * Page to configure the twitch layout
 * [Twitch layout page](https://palatracker.bromine.fr/twitch/BroMine__/setup)
 * @param props.params - Username
 */
export default async function TwitchLayoutConfigPage(props: { params: Promise<{ username: string }>}) {
  const username = await props.params.then(p => p.username);
  return (
    <ProfileFetcherWrapper username={username}>
      <TwitchOverlayConfig username={username}/>
    </ProfileFetcherWrapper>
  );
}
