"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * TODO any way
 */
export function ProfileSection() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }
  return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="">{playerInfo.description}</p>
      </div>
      {/* <div>
        <h3 className="text-xl font-semibold mb-2">Classements</h3>
        <ul className="space-y-2">
          TODO
        </ul>
      </div> */}
    </div>

    {/* <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-2">Compagnons</h3>
      <CompanionCard
                name={playerInfo.pet?.currentSkin}
                imageUrl={playerInfo.pet.imageUrl}
                type="Pet"
            />
            <CompanionCard
                name={playerData.mount.name}
                imageUrl={playerData.mount.imageUrl}
                type="Monture"
            />
    </div> */}
  </div>);
}
