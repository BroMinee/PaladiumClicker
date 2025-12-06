"use client";
import React, { useEffect } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { getPlayerInfoAction } from "@/lib/api/apiServerAction";
import { LoadingData } from "@/components/LoadingData";
import { useSettingsStore } from "@/stores/use-settings-store";
import { reloadProfilNeeded } from "@/lib/misc";
import { toast } from "sonner";
import { navigate } from "@/components/actions";

/**
 * Component that wrap the entire page and display it only when the username in the localstorage is up to date and equal as requested.
 * @param username - Username for the profil we want to display
 * @param children - Children element
 */
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
        if (!data) {
          return;
        }
        toast.success(`Profil de ${data.username} chargé`);
        setPlayerInfo(data);
      }).catch((e) => {
        if (e.digest && e.digest.startsWith("NEXT_REDIRECT")) {
          throw e;
        }
        toast.error(`Erreur lors du chargement du profil de ${username}`);
        navigate(`/error?message=${encodeURIComponent(`Impossible de charger le profil de ${username}`)}&username=${encodeURIComponent(username)}`);
      });
    }

  }, [username, setPlayerInfo, settings, playerInfo, isFirstRender]);

  if (reloadProfilNeeded(playerInfo, username, settings.defaultProfile)) {
    return <LoadingData username={username}/>;
  }

  return (<>
    {children}
  </>
  );
}
