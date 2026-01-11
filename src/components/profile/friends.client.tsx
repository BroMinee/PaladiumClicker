"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Image from "next/image";
import { ClickableLink } from "@/components/ui/clickable-link";
import { generateProfilUrl } from "@/lib/misc";

/**
 * Display the player friend list
 */
export function FriendsSection() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }
  return (<div>
    <h3 className="text-xl font-semibold mb-4">
      Amis ({playerInfo.friends.totalCount})
    </h3>
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
      {playerInfo.friends.data.map((friend) => (
        <ClickableLink
          href={generateProfilUrl(friend.name, "Amis")}
          key={friend.name}
          className="flex flex-col items-center text-center"
        >
          <Image
            src={`https://mineskin.eu/helm/${friend.uuid}/16`}
            alt={friend.name}
            width={0}
            height={0}
            unoptimized
            className="w-16 h-16 rounded-lg border-2 border-secondary mb-2 pixelated"
          />
          <span className="text-xs truncate w-full">
            {friend.name}
          </span>
        </ClickableLink>
      ))}
    </div>
  </div>);
}
