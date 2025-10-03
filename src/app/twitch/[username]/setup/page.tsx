import React from "react";
import ProfileFetcherWrapper from "@/components/ProfileFetcher";
import TwitchOverlayConfig from "@/components/Twitch/TwitchOverlayConfig";

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

export default async function WebHooksPage(props: { params: Promise<{ username: string }>}) {
  const username = await props.params.then(p => p.username);
  return (
    <ProfileFetcherWrapper username={username}>
      <TwitchOverlayConfig username={username}/>
    </ProfileFetcherWrapper>
  );
}
