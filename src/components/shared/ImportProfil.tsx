'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import React, { FormEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";
import constants from "@/lib/constants.ts";
import { getInitialPlayerInfo, getLinkFromUrl, safeJoinPaths } from "@/lib/misc.ts";
import { navigate } from '@/components/actions'
import { useSettingsStore } from "@/stores/use-settings-store.ts";
import { getPlayerInfoAction, registerPlayerAction } from "@/lib/api/apiServerAction.ts";
import { toast } from "sonner";
import Countdown from "react-countdown";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { PlayerInfo } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";

type ImportProfilProps = {
  showResetButton?: boolean,
  withBackground?: boolean
  classNameInput?: string
  navBar?: boolean
}

export default function ImportProfil({
                                       showResetButton = false,
                                       withBackground = true,
                                       navBar = false,
                                       classNameInput
                                     }: ImportProfilProps) {

  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { settings } = useSettingsStore();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newPlayerInfo, setNewPlayerInfo] = useState<PlayerInfo | null>(null);

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

  const rendererImportProfil = ({ minutes, seconds, completed }: {
    minutes: number,
    seconds: number,
    completed: boolean
  }) => {
    if (completed) {
      return <Button
        onClick={async () => {
          if (playerInfo === null) return;
          getPlayerInfoAction(playerInfo.username).then((data) => {
            setNewPlayerInfo(data);
            if (playerInfo.edited && hasDifference(playerInfo, data)) {
              setIsPopupOpen(true);
            } else {
              handleConfirmReplacement();
            }

          }).catch((e) => {
            console.error(e);
            toast.error(`Erreur lors du chargement du profil de ${playerInfo.username}`);
          });
        }}>
        <span>Mettre à jour</span>
      </Button>;
    } else {

      return <Button className="flex flex-col" disabled={true}>
        <span>Mise à jour disponible dans :</span>
        <span>{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      </Button>;
    }
  };

  const handleConfirmReplacement = () => {
    if (newPlayerInfo) {
      toast.success(`Profil de ${newPlayerInfo.username} chargé`);
      registerPlayerAction(newPlayerInfo.uuid, newPlayerInfo.username);
      setPlayerInfo(newPlayerInfo);
      setIsPopupOpen(false);
    }
  };

  const handleCancelReplacement = () => {
    setIsPopupOpen(false);
    toast.success(`Mise à jour annulée`);
  };
  // if (playerInfo !== null)
  // alert(`${new Date(playerInfo.last_fetch + 1000 * 15 * 60)}, ${new Date()} ${new Date(playerInfo.last_fetch + 1000 * 15 * 60) <= new Date()}`)

  return (
    <div className={cn("flex gap-2", navBar ? "flex-col" : "")}>
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
        <Countdown
          date={playerInfo ? new Date(playerInfo.last_fetch + 1000 * 0 * 60) : new Date(new Date().getTime() + 1000 * 0 * 60)}
          renderer={rendererImportProfil}/>
      }
      {showResetButton && settings.defaultProfile &&
        <Button onClick={() => {
          setPlayerInfo(getInitialPlayerInfo());
        }}>
          Réinitialiser
        </Button>}
      <Dialog open={isPopupOpen} onOpenChange={handleCancelReplacement}>
        <DialogContent className="px-0 pb-0 max-w-4xl justify-items-center">
          <DialogHeader className="px-6">
            <DialogTitle className="text-primary">Confirmer la mise à jour du profil</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[80dvh] px-6 border-t">
            {newPlayerInfo && playerInfo && DisplayDifference({
              oldPlayerInfo: playerInfo,
              newPlayerInfo: newPlayerInfo
            })}
          </ScrollArea>
          <div className="flex flex-row gap-2 pb-2">
            <Button onClick={handleConfirmReplacement} className="bg-green-500">Oui</Button>
            <Button onClick={handleCancelReplacement} className="bg-red-500">Non</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function hasDifference(oldPlayerInfo: PlayerInfo, newPlayerInfo: PlayerInfo): boolean {
  if (oldPlayerInfo.metier.farmer.level > newPlayerInfo.metier.farmer.level) return true;
  if (oldPlayerInfo.metier.miner.level > newPlayerInfo.metier.miner.level) return true;
  if (oldPlayerInfo.metier.hunter.level > newPlayerInfo.metier.hunter.level) return true;
  if (oldPlayerInfo.metier.alchemist.level > newPlayerInfo.metier.alchemist.level) return true;

  if (oldPlayerInfo.building.some((e, index) => e.own > newPlayerInfo.building[index].own)) return true;

  if (oldPlayerInfo.global_upgrade.some((b, index) => b.own && !newPlayerInfo.global_upgrade[index].own)) return true;

  if (oldPlayerInfo.terrain_upgrade.some((b, index) => b.own && !newPlayerInfo.terrain_upgrade[index].own)) return true;

  if (oldPlayerInfo.building_upgrade.some((b, index) => b.own && !newPlayerInfo.building_upgrade[index].own)) return true;

  if (oldPlayerInfo.many_upgrade.some((b, index) => b.own && !newPlayerInfo.many_upgrade[index].own)) return true;

  if (oldPlayerInfo.terrain_upgrade.some((b, index) => b.own && !newPlayerInfo.terrain_upgrade[index].own)) return true;

  if (oldPlayerInfo.posterior_upgrade.some((b, index) => b.own && !newPlayerInfo.posterior_upgrade[index].own)) return true;

  return false;
}

type displayDifferenceProps = {
  oldPlayerInfo: PlayerInfo,
  newPlayerInfo: PlayerInfo,
}

function DisplayDifference({ oldPlayerInfo, newPlayerInfo }: displayDifferenceProps) {
  return <>
    <p className="font-bold text-center">Les données que Paladium fournit semblent plus anciennes que vos valeurs
      actuelles. Voulez-vous continuer ?</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">

      {oldPlayerInfo.metier.farmer.level > newPlayerInfo.metier.farmer.level &&
        <SmallCardInfo title={"Metier de farmer"}
                       value={oldPlayerInfo.metier.farmer.level + " -> " + newPlayerInfo.metier.farmer.level}
                       img={`/JobsIcon/Fermier.webp`} unoptimized/>
      }

      {oldPlayerInfo.metier.miner.level > newPlayerInfo.metier.miner.level &&
        <SmallCardInfo title={"Metier de mineur"}
                       value={oldPlayerInfo.metier.miner.level + " -> " + newPlayerInfo.metier.miner.level}
                       img={`/JobsIcon/Mineur.webp`} unoptimized/>
      }

      {oldPlayerInfo.metier.hunter.level > newPlayerInfo.metier.hunter.level &&
        <SmallCardInfo title={"Metier de chasseur"}
                       value={oldPlayerInfo.metier.hunter.level + " -> " + newPlayerInfo.metier.hunter.level}
                       img={`/JobsIcon/Chasseur.webp`} unoptimized/>
      }

      {oldPlayerInfo.metier.alchemist.level > newPlayerInfo.metier.alchemist.level &&
        <SmallCardInfo title={"Metier d'alchimiste"}
                       value={oldPlayerInfo.metier.alchemist.level + " -> " + newPlayerInfo.metier.alchemist.level}
                       img={`/JobsIcon/Alchimiste.webp`} unoptimized/>
      }

      {
        oldPlayerInfo.building.filter((e, index) => e.own > newPlayerInfo.building[index].own).map((b) => {
          return <SmallCardInfo title={b.name} key={"building" + b.index}
                                value={"lvl: " + oldPlayerInfo.building[b.index].own + " -> lvl: " + newPlayerInfo.building[b.index].own}
                                img={`/BuildingIcon/${b.index}.png`} unoptimized/>
        })
      }

      {
        oldPlayerInfo.global_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.global_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"global" + index}
                                  value={"✔️ -> ❌"}
                                  img={`/GlobalIcon/${index}.png`} unoptimized/>
          else return null
        })
      }

      {
        oldPlayerInfo.terrain_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.terrain_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"terrain" + index}
                                  value={"✔️ -> ❌"}
                                  img={`/TerrainIcon/${index}.png`} unoptimized/>
          else return null
        })
      }

      {
        oldPlayerInfo.building_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.building_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"building_upgrade" + index}
                                  value={"✔️ -> ❌"}
                                  img={`/BuildingUpgradeIcon/${index <= 15 ? 0 : 1}.png`} unoptimized/>
          else return null
        })
      }


      {
        oldPlayerInfo.many_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.many_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"many" + index}
                                  value={"✔️ -> ❌"}
                                  img={`/ManyIcon/0.png`} unoptimized/>
          else return null
        })
      }

      {
        oldPlayerInfo.posterior_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.posterior_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"posterior" + index}
                                  value={"✔️ -> ❌"}
                                  img={`/PosteriorIcon/0.png`} unoptimized/>
          else return null
        })
      }

      {
        oldPlayerInfo.category_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.category_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"category" + index}
                                  value={"✔️ -> ❌"}
                                  img={`/CategoryIcon/${index}.png`} unoptimized/>
          else return null
        })
      }
    </div>
  </>

}