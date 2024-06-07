import {getFactionLeaderboard} from "@/lib/api";
import {usePlayerInfoStore} from "@/stores/use-player-info-store";
import {useQuery} from "@tanstack/react-query";

const useFactionLeaderboard = () => {
  const { data: playerInfo } = usePlayerInfoStore();
  const query = useQuery({
    queryKey: ["faction_leaderboard"],
    queryFn: () => {
      return getFactionLeaderboard();
      // return getFactionInfo(factionName);
    },
    retry: 1,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!playerInfo,
  });

  if (query.isLoading) {
    return "Récupération en cours...";
  }

  if(query.error)
    return "Erreur";


  return query.data;
}

export default useFactionLeaderboard;