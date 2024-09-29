'use client'
import React, { useEffect } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { getPlayerInfoAction, registerPlayerAction } from "@/lib/api/apiServerAction.ts";
import LoadingData from "@/components/LoadingData.tsx";
import { useSettingsStore } from "@/stores/use-settings-store.ts";
import { reloadProfilNeeded } from "@/lib/misc.ts";
import { toast } from "sonner";


export default function ProfileFetcherWrapper({ username, children }: {
  username: string,
  children: React.ReactNode
}) {

  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { settings } = useSettingsStore();

  const [isFirstRender, setIsFirstRender] = React.useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    if (reloadProfilNeeded(playerInfo, username, settings.defaultProfile)) {
      getPlayerInfoAction(username).then((data) => {
        toast.success(`Profil de ${data.username} chargé`);
        registerPlayerAction(data.uuid, data.username);
        setPlayerInfo(data);
      }).catch((e) => {
        console.error(e);
        toast.error(`Erreur lors du chargement du profil de ${username}`);
      });
    }

  }, [playerInfo, isFirstRender]);


  if (reloadProfilNeeded(playerInfo, username, settings.defaultProfile))
    return <LoadingData username={username}/>;

  return (<>
      {children}
    </>
  )
}


