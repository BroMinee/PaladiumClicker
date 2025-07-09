'use client';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import constants from "@/lib/constants.ts";
import { getHeadUrl, getInitialPlayerInfo, getLinkFromUrl, safeJoinPaths } from "@/lib/misc.ts";
import { navigate } from '@/components/actions'
import { useSettingsStore } from "@/stores/use-settings-store.ts";
import { getPlayerInfoAction, registerPlayerAction } from "@/lib/api/apiServerAction.ts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { PlayerInfo } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import Image from "next/image";

type ImportProfilProps = {
  showResetButton?: boolean,
  navBar?: boolean
}

export default function ImportProfilPretty({
                                       showResetButton = false,
                                       navBar = false,
                                     }: ImportProfilProps) {

  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { settings } = useSettingsStore();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newPlayerInfo, setNewPlayerInfo] = useState<PlayerInfo | null>(null);
  const [update, setUpdate] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleButtonClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  };


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (fetching)
      return;

    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    if (settings.defaultProfile) {
      toast.error("Impossible d'importer un pseudo car vous avez activé dans les paramètres l'option : \"profil vide\".");
      return;
    }

    const trouvaille = getLinkFromUrl(window.location.pathname);
    let pseudoEnter = String(formData.get("pseudo"));
    if (pseudoEnter === "" || pseudoEnter === undefined) {
      pseudoEnter = playerInfo?.username ?? "";
    }
    if (pseudoEnter === "") {
      toast.warning("Veuillez entrer un pseudo");
      return;
    }
    console.log(trouvaille);
    if (pseudoEnter.toLowerCase() === playerInfo?.username.toLowerCase()) {
      setFetching(true);
      try {
        const data = await getPlayerInfoAction(playerInfo.username);
        setNewPlayerInfo(data);
        setFetching(false);
        if (playerInfo.edited && hasDifference(playerInfo, data)) {
          setIsPopupOpen(true);
        } else {
          handleConfirmReplacement();
        }
      } catch (e) {
        setFetching(false);
        toast.error(`Erreur lors du chargement du profil de ${playerInfo.username}`);
      }
    }

    if (trouvaille !== undefined && constants.links[trouvaille].requiredPseudo) {
      await navigate(safeJoinPaths(trouvaille, pseudoEnter));
    } else {
      await navigate(safeJoinPaths(constants.profilPath, pseudoEnter));
    }
  }

  const handleConfirmReplacement = () => {
    setUpdate(true);
  };

  const handleCancelReplacement = () => {
    setIsPopupOpen(false);
    toast.success(`Mise à jour annulée`);
  };
  // if (playerInfo !== null)
  // alert(`${new Date(playerInfo.last_fetch + 1000 * 15 * 60)}, ${new Date()} ${new Date(playerInfo.last_fetch + 1000 * 15 * 60) <= new Date()}`)


  useEffect(() => {
    if (newPlayerInfo) {
      toast.success(`Profil de ${newPlayerInfo.username} chargé`);
      registerPlayerAction(newPlayerInfo.uuid, newPlayerInfo.username);
      setPlayerInfo(newPlayerInfo);
      setIsPopupOpen(false);
      setUpdate(false);
    }
    else {
      console.error("newPlayerInfo is null")
    }
  }, [newPlayerInfo, setPlayerInfo, update]);

  return (
    <div className={cn("flex gap-2 w-full justify-center", navBar ? "flex-col" : "")}>
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-sm flex items-center px-6 py-3 bg-card/70 text-white rounded-xl shadow-lg transition-all backdrop-blur-md hover:bg-card/80 gap-8"
        id="submit-pseudo"
      >
        <Image
          src={getHeadUrl(playerInfo?.uuid)}
          className={cn("w-12 h-12 pixelated rounded-sm", navBar && "invisible absolute")}
          alt={`palatracker_head`}
          width={0}
          height={0}
          unoptimized={true}
        />

        {/* Always render both, but toggle visibility */}
        <input
          type="text"
          placeholder="Entre un pseudo"
          className={cn(
            "px-4 py-2 rounded-lg text-white text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 focus:border-none",
            isEditing ? "visible" : "invisible absolute"
          )}
          id="pseudo-input"
          ref={inputRef}
          name="pseudo"
          onBlur={() => setIsEditing(false)}
          autoFocus={isEditing}
        />

        <button
          type="button"
          onClick={handleButtonClick}
          className={cn(
            "text-lg font-semibold",
            isEditing ? "invisible absolute" : "visible hover:scale-110 duration-300 animate-blink-orange [animation-duration:3000ms]"
          )}
        >
          Rechercher un joueur
        </button>

        <Button
          id="pseudo-submit"
          type="submit"
          size="icon"
          variant="ghost"
          className={cn(
            "absolute right-0 top-0 h-full rounded-l-none rounded-r-lg border-none shadow-none text-foreground",
            isEditing ? "visible" : "invisible absolute"
          )}
        >
          <FaSearch/>
        </Button>
      </form>

      {showResetButton && !settings.defaultProfile &&
        <UpdateProfilButton fetching={fetching}/>
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

function UpdateProfilButton({
                              fetching
                            }: {
  fetching: boolean,
}) {
  return <Button
    type="submit"
    form="submit-pseudo"
    className="flex flex-row gap-2"
  >
    <span>Mettre à jour</span>
    {fetching && <LoadingSpinner size={4}/>}
  </Button>;
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
                       img={safeJoinPaths(constants.imgPathProfile, `/JobsIcon/Fermier.webp`)} unoptimized/>
      }

      {oldPlayerInfo.metier.miner.level > newPlayerInfo.metier.miner.level &&
        <SmallCardInfo title={"Metier de mineur"}
                       value={oldPlayerInfo.metier.miner.level + " -> " + newPlayerInfo.metier.miner.level}
                       img={safeJoinPaths(constants.imgPathProfile, `/JobsIcon/Mineur.webp`)} unoptimized/>
      }

      {oldPlayerInfo.metier.hunter.level > newPlayerInfo.metier.hunter.level &&
        <SmallCardInfo title={"Metier de chasseur"}
                       value={oldPlayerInfo.metier.hunter.level + " -> " + newPlayerInfo.metier.hunter.level}
                       img={safeJoinPaths(constants.imgPathProfile, `/JobsIcon/Chasseur.webp`)} unoptimized/>
      }

      {oldPlayerInfo.metier.alchemist.level > newPlayerInfo.metier.alchemist.level &&
        <SmallCardInfo title={"Metier d'alchimiste"}
                       value={oldPlayerInfo.metier.alchemist.level + " -> " + newPlayerInfo.metier.alchemist.level}
                       img={safeJoinPaths(constants.imgPathProfile, `/JobsIcon/Alchimiste.webp`)} unoptimized/>
      }

      {
        oldPlayerInfo.building.filter((e, index) => e.own > newPlayerInfo.building[index].own).map((b) => {
          return <SmallCardInfo title={b.name} key={"building" + b.index}
                                value={"lvl: " + oldPlayerInfo.building[b.index].own + " -> lvl: " + newPlayerInfo.building[b.index].own}
                                img={safeJoinPaths(constants.imgPathClicker, `/BuildingIcon/${b.index}.png`)} unoptimized/>
        })
      }

      {
        oldPlayerInfo.global_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.global_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"global" + index}
                                  value={"✔️ -> ❌"}
                                  img={safeJoinPaths(constants.imgPathClicker, `/GlobalIcon/${index}.png`)} unoptimized/>
          else return null
        })
      }

      {
        oldPlayerInfo.terrain_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.terrain_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"terrain" + index}
                                  value={"✔️ -> ❌"}
                                  img={safeJoinPaths(constants.imgPathClicker, `/TerrainIcon/${index}.png`)} unoptimized/>
          else return null
        })
      }

      {
        oldPlayerInfo.building_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.building_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"building_upgrade" + index}
                                  value={"✔️ -> ❌"}
                                  img={safeJoinPaths(constants.imgPathClicker, `/BuildingUpgradeIcon/${index <= 15 ? 0 : 1}.png`)} unoptimized/>
          else return null
        })
      }


      {
        oldPlayerInfo.many_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.many_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"many" + index}
                                  value={"✔️ -> ❌"}
                                  img={safeJoinPaths(constants.imgPathClicker, `/ManyIcon/0.png`)} unoptimized/>
          else return null
        })
      }

      {
        oldPlayerInfo.posterior_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.posterior_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"posterior" + index}
                                  value={"✔️ -> ❌"}
                                  img={safeJoinPaths(constants.imgPathClicker, `/PosteriorIcon/0.png`)} unoptimized/>
          else return null
        })
      }

      {
        oldPlayerInfo.category_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.category_upgrade[index].own)
            return <SmallCardInfo title={b.name}
                                  key={"category" + index}
                                  value={"✔️ -> ❌"}
                                  img={safeJoinPaths(constants.imgPathClicker, `/CategoryIcon/${index}.png`)} unoptimized/>
          else return null
        })
      }
    </div>
  </>

}