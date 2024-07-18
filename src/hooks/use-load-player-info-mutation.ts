import { getPlayerInfo } from "@/lib/apiPala.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useMutation } from "@tanstack/react-query";

const useLoadPlayerInfoMutation = () => {
  const { setPlayerInfo } = usePlayerInfoStore();

  return useMutation({
    mutationFn: (username: string) => getPlayerInfo(username),
    onSuccess: (data) => {
      setPlayerInfo(data);
    }
  });
}

export default useLoadPlayerInfoMutation;