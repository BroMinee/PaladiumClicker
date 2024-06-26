import {getPlayerInfo} from "@/lib/api";
import {usePlayerInfoStore} from "@/stores/use-player-info-store";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

const useLoadPlayerInfoMutation = () => {
  const {setPlayerInfo} = usePlayerInfoStore();

  return useMutation({
    mutationFn: (username: string) => getPlayerInfo(username),
    onSuccess: (data) => {
      if(data.uuid === "f51df108-ce35-40e1-b1eb-aa0c085adb52")
      {
        toast.error("Attention ce joueur n'est pas digne de confiance, j'attends encore mes endiums ingots :(");
      }
      setPlayerInfo(data);
    }
  });
}

export default useLoadPlayerInfoMutation;