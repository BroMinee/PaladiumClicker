"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RankingSectionSelector } from "@/components/ranking/inputs.client";

/**
 * Display the profile section with description and ranking graph.
 */
export function ProfileSection() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }
  return (<div className="flex flex-col gap-6 w-full">
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="">{playerInfo.description}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Classements</h3>
        <RankingSectionSelector username={playerInfo.username}/>
      </div>
    </div>
  </div>);
}
