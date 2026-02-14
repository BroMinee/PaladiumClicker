"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ClickableLink } from "../ui/clickable-link";
import { TwitchLogo } from "../shared/twitch-overlay-button.client";

/**
 * Display the player username
 */
export function PlayerUsername() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }
  const isLouis = playerInfo.username.toLowerCase() === "louisenstream";

  if (isLouis) {
    return (<div className="flex items-center gap-4">
      <ClickableLink href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        <TwitchLogo />
      </ClickableLink>
      {playerInfo.username}
    </div>
    );
  }

  return <>{playerInfo.username}</>;
}