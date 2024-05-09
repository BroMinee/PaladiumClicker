import { getPaladiumLeaderboardPositionByUUID } from "@/lib/api";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useQuery } from "@tanstack/react-query";

const useLeaderboardPosition = () => {
  const { data: playerInfo } = usePlayerInfoStore();
  const query = useQuery({
    queryKey: ["leaderboard", playerInfo!.uuid],
    queryFn: () => {
      return getPaladiumLeaderboardPositionByUUID(playerInfo!.uuid);
    },
    retry: 1,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!playerInfo,
  });

  if (query.isLoading) {
    return "Récupération en cours...";
  }

  return query.error ? "Erreur" : query.data;
}

export default useLeaderboardPosition;