import ProfileFetcherWrapper from "@/components/ProfileFetcher";
import TwitchOverlay from "@/components/Twitch/TwichAnimation";
import { AvailableElements } from "@/components/Twitch/TwitchOverlayConfig";
import { RankingType } from "@/types";
import { redirect } from "next/navigation";

export default async function TwitchLayoutHome(props: { params: Promise<{ username: string}>, searchParams: Promise<{config: string}> }) {

  const parsedElements = await props.searchParams.then(p => p.config.split(",").map(item => {
    const parts = item.split(":");
    if (parts.length === 3 && !isNaN(Number(parts[2]))) {
      // type:subOption:duration
      return {
        type: parts[0] as keyof AvailableElements,
        subOption: parts[1] as Exclude<RankingType, "vote">,
        duration: Number(parts[2])
      };
    }

    if (parts.length === 2 && !isNaN(Number(parts[1]))) {
      // type:duration
      return {
        type: parts[0] as keyof AvailableElements,
        duration: Number(parts[1]),
        subOption: null,
      };
    }

    redirect(`/error?message=${encodeURIComponent("Configuration invalide")}&detail=${encodeURIComponent(JSON.stringify(p))}`);
  }));

  const username = await props.params.then(p => p.username);
  return <ProfileFetcherWrapper username={username}>
    <TwitchOverlay selectedElements={parsedElements}/>;
  </ProfileFetcherWrapper>;
};