'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { FormEvent } from "react";
import { FaSearch } from "react-icons/fa";
import constants from "@/lib/constants.ts";
import { getHHMMSS, getInitialPlayerInfo, getLinkFromUrl, safeJoinPaths } from "@/lib/misc.ts";
import { navigate } from '@/components/actions'
import { useSettingsStore } from "@/stores/use-settings-store.ts";
import { getPlayerInfoAction, registerPlayerAction } from "@/lib/api/apiServerAction.ts";
import { toast } from "sonner";

type ImportProfilProps = {
  showResetButton?: boolean,
  withBackground?: boolean
  classNameInput?: string
}

export default function ImportProfil({
                                       showResetButton = false,
                                       withBackground = true,
                                       classNameInput
                                     }: ImportProfilProps) {

  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { settings } = useSettingsStore();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    if (settings.defaultProfile) {
      toast.error("Impossible d'importer un pseudo car vous avez activé dans les paramètres l'option : \"profil vide\".");
      return;
    }

    const trouvaille = getLinkFromUrl(window.location.pathname);
    if (trouvaille !== undefined && constants.links[trouvaille].requiredPseudo) {
      await navigate(safeJoinPaths(trouvaille, String(formData.get("pseudo"))));
    } else {
      await navigate(safeJoinPaths(constants.profilPath, String(formData.get("pseudo"))));
    }
  }

  // if (playerInfo !== null)
  // alert(`${new Date(playerInfo.last_fetch + 1000 * 15 * 60)}, ${new Date()} ${new Date(playerInfo.last_fetch + 1000 * 15 * 60) <= new Date()}`)

  return (
    <div className="flex gap-2">
      <form onSubmit={onSubmit}>
        <div className="relative">
          <Input
            type="text"
            id="pseudo"
            name="pseudo"
            className={cn(classNameInput, withBackground && "bg-background")}
            placeholder={playerInfo?.username ?? "Entre ton pseudo"}
          />
          <Button
            id="pseudo-submit"
            type="submit"
            className="absolute right-0 top-0 text-foreground rounded-l-none border-none shadow-none"
            variant="ghost"
            size="icon"
          >
            <FaSearch/>
          </Button>
        </div>
      </form>
      {showResetButton && !settings.defaultProfile &&
        <Button disabled={playerInfo !== null && new Date(playerInfo.last_fetch + 1000 * 15 * 60) >= new Date()}
                onClick={async () => {
                  if (playerInfo === null) return;
                  getPlayerInfoAction(playerInfo.username).then((data) => {
                    toast.success(`Profil de ${data.username} chargé`);
                    registerPlayerAction(data.uuid, data.username);
                    setPlayerInfo(data);
                  }).catch((e) => {
                    console.error(e);
                    toast.error(`Erreur lors du chargement du profil de ${playerInfo.username}`);
                  });
                }}>{
          playerInfo !== null && new Date(playerInfo.last_fetch + 1000 * 15 * 60) >= new Date() ?
            `Mise à jour disponible à ${getHHMMSS(new Date(playerInfo.last_fetch + 1000 * 15 * 60))}` : `Mettre à jour`}</Button>}
      {showResetButton && settings.defaultProfile &&
        <Button onClick={() => {
          setPlayerInfo(getInitialPlayerInfo());
        }}>
          Réinitialiser
        </Button>}
    </div>
  );
}