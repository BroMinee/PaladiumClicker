'use client'
import React, { useEffect } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { getPlayerInfoAction } from "@/lib/api/apiServerAction.ts";
import LoadingData from "@/components/LoadingData.tsx";
import { useSettingsStore } from "@/stores/use-settings-store.ts";
import { reloadProfilNeeded } from "@/lib/misc.ts";
import { toast } from "sonner";
import { navigate } from "@/components/actions.ts";



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
        if (!data)
          return;
        toast.success(`Profil de ${data.username} chargé`);
        setPlayerInfo(data);
      }).catch((e) => {
        if (e.digest && e.digest.startsWith('NEXT_REDIRECT')) {
          throw e;
        }
        toast.error(`Erreur lors du chargement du profil de ${username}`);
        navigate(`/error?message=${encodeURIComponent(`Impossible de charger le profil de ${username}`)}&username=${encodeURIComponent(username)}`);
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


