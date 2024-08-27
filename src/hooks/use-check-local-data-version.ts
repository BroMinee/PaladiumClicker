import { usePlayerInfo } from "@/stores/use-player-info-store"
import { useEffect } from "react";

const useCheckLocalDataVersion = () => {
  const { checkVersion } = usePlayerInfo();

  useEffect(() => {
    checkVersion();
  }, [checkVersion]);
}

export default useCheckLocalDataVersion;