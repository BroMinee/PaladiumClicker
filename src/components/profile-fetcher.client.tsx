"use client";
import React, { useEffect, useState } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { getPlayerInfoAction } from "@/lib/api/api-server-action.server";
import { LoadingData } from "@/components/loading-data";
import { useSettingsStore } from "@/stores/use-settings-store";
import { reloadProfilNeeded } from "@/lib/misc";
import { toast } from "sonner";
import { navigate } from "@/components/actions";

/**
 * Component that wrap the entire page and display it only when the username in the localstorage is up to date and equal as requested.
 * @param username - Username for the profil we want to display
 * @param children - Children element
 */
export function ProfileFetcherWrapper({ username, children }: {
  username: string,
  children: React.ReactNode
}) {

  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { settings } = useSettingsStore();

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [alreadyCheckedProfile, setAlreadyCheckedProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    if(alreadyCheckedProfile) {
      return;
    }

    setAlreadyCheckedProfile(true);

    if (reloadProfilNeeded(playerInfo, username, settings.defaultProfile)) {
      setIsLoading(true);
      getPlayerInfoAction(username).then((data) => {
        setIsLoading(false);
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

  }, [username, setPlayerInfo, settings, playerInfo, isFirstRender, alreadyCheckedProfile]);

  if (isLoading) {
    return <LoadingData username={username}/>;
  }

  return (<>
    {children}
  </>
  );
}
