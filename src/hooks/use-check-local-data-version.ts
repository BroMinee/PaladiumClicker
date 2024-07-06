import { usePlayerInfoStore } from "@/stores/use-player-info-store"
import { useEffect } from "react";

const useCheckLocalDataVersion = () => {
  const { checkVersion } = usePlayerInfoStore();

  useEffect(() => {
    checkVersion();
  }, [checkVersion]);
}

export default useCheckLocalDataVersion;