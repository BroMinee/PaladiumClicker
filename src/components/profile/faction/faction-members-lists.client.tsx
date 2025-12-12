import { Card } from "@/components/ui/card";
import { ClickableLink } from "@/components/ui/clickable-link";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { constants } from "@/lib/constants";
import { convertEpochToDateUTC2, safeJoinPaths } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { FaPercentage } from "react-icons/fa";

/**
 * Display the member inside the faction
 */
export function FactionMembersList() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return (<div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Membres ({playerInfo.faction.players.length})</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {playerInfo.faction.players.map((player) => (
        <ClickableLink href={`${constants.profilPath}/${player.username}`} key={player.uuid} className="hover:scale-105">
          <Card className="flex flex-col items-center justify-center hover:bg-secondary border">
            <div className="flex flex-col items-center justify-center gap-2">
              <UnOptimizedImage src={`https://mineskin.eu/helm/${player.uuid}`}
                alt="Icône"
                width={48} height={48}
                unoptimized={true}
                className="object-cover pixelated rounded-md" />
              <div className="text-primary font-bold text-center w-36">{player.username}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <FaPercentage className="h-4 w-4 mr-2 inline-block" />
                Rôle: {player.group}
              </div>
              <div className="text-sm">
                <UnOptimizedImage src={safeJoinPaths(constants.imgPathProfile, "clock.gif")} alt="Icône"
                  width={16} height={16}
                  className="object-cover inline-block pixelated mr-2" />
                Rejoint le: {convertEpochToDateUTC2(player.joinedAt)}
              </div>
            </div>
          </Card>
        </ClickableLink>))}
    </div>
  </div>);
}