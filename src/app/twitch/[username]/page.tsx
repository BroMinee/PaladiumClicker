import ProfileFetcherWrapper from "@/components/ProfileFetcher";
import TwitchOverlay from "@/components/Twitch/TwichAnimation";

export default async function TwitchLayoutHome(props: { params: Promise<{ username: string }> }) {
  const username = await props.params.then(p => p.username);
  return <ProfileFetcherWrapper username={username}>
    <TwitchOverlay/>;
  </ProfileFetcherWrapper>;

};