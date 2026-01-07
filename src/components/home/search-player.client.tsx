"use client";
import { useEffect, useState } from "react";
import { PlayerSearchInput } from "../shared/player-search-input-client";
import { PlayerInfo, User } from "@/types";
import { getLinkFromUrl, safeJoinPaths } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { getPlayerInfoAction, registerPlayerAction } from "@/lib/api/api-server-action.server";
import { toast } from "sonner";
import { navigate } from "../actions";
import { constants } from "@/lib/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SmallCardInfo } from "../shared/small-card-info.client";
import { Button } from "../ui/button-v2";

/**
 * Search player input, handles player profile import, update, and reset logic.
 * @param variant - The variant of the search input, either "homepage" or "navbar".
 */
export function SearchPlayerInput({ variant }: { variant: "homepage" | "navbar" }) {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const [confirmUpdate, setConfirmUpdate] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newPlayerInfo, setNewPlayerInfo] = useState<PlayerInfo | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (newPlayerInfo !== null && confirmUpdate) {
        toast.success(`Profil de ${newPlayerInfo.username} chargé`);
        setNewPlayerInfo(null);
        registerPlayerAction(newPlayerInfo.uuid, newPlayerInfo.username);
        setPlayerInfo(newPlayerInfo);
        setIsPopupOpen(false);
        setConfirmUpdate(false);

        const trouvaille = getLinkFromUrl(window.location.pathname);
        if (trouvaille !== undefined && constants.links[trouvaille].requiredPseudo) {
          await navigate(safeJoinPaths(trouvaille, newPlayerInfo.username));
        } else {
          await navigate(safeJoinPaths(constants.profilPath, newPlayerInfo.username));
        }
      }
    };

    fetchData();
  }, [confirmUpdate, newPlayerInfo, setPlayerInfo]);

  const handleConfirmReplacement = () => {
    setConfirmUpdate(true);
  };

  const handleCancelReplacement = () => {
    setIsPopupOpen(false);
    toast.success("Mise à jour annulée");
  };

  const handleOnClick = async (username: string) => {
    setFetching(true);
    try {
      const data = await getPlayerInfoAction(username);
      setNewPlayerInfo(data);
      setFetching(false);
      if (playerInfo?.edited === true && hasDifference(playerInfo, data)) {
        setIsPopupOpen(true);
      } else {
        handleConfirmReplacement();
      }
    } catch (_) {
      setFetching(false);
      toast.error(`Erreur lors du chargement du profil de ${username}`);
    }

  };

  return (
    <>
      <PlayerSearchInput
        variant={variant}
        fetching={fetching}
        placeholder="Pseudo Minecraft..."
        onClick={function (user: User | string): void {
          handleOnClick(typeof user === "string" ? user : user.username);
        }}
      />
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
          <div className="flex flex-row gap-2 pt-8 pb-2">
            <Button onClick={handleConfirmReplacement} className="bg-green-500 p-1.5">Oui</Button>
            <Button onClick={handleCancelReplacement} className="bg-red-500 p-1.5">Non</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function hasDifference(oldPlayerInfo: PlayerInfo, newPlayerInfo: PlayerInfo): boolean {
  if (oldPlayerInfo.metier.farmer.level > newPlayerInfo.metier.farmer.level) {
    return true;
  }
  if (oldPlayerInfo.metier.miner.level > newPlayerInfo.metier.miner.level) {
    return true;
  }
  if (oldPlayerInfo.metier.hunter.level > newPlayerInfo.metier.hunter.level) {
    return true;
  }
  if (oldPlayerInfo.metier.alchemist.level > newPlayerInfo.metier.alchemist.level) {
    return true;
  }

  if (oldPlayerInfo.building.some((e, index) => e.own > newPlayerInfo.building[index].own)) {
    return true;
  }

  if (oldPlayerInfo.global_upgrade.some((b, index) => b.own && !newPlayerInfo.global_upgrade[index].own)) {
    return true;
  }

  if (oldPlayerInfo.terrain_upgrade.some((b, index) => b.own && !newPlayerInfo.terrain_upgrade[index].own)) {
    return true;
  }

  if (oldPlayerInfo.building_upgrade.some((b, index) => b.own && !newPlayerInfo.building_upgrade[index].own)) {
    return true;
  }

  if (oldPlayerInfo.many_upgrade.some((b, index) => b.own && !newPlayerInfo.many_upgrade[index].own)) {
    return true;
  }

  if (oldPlayerInfo.terrain_upgrade.some((b, index) => b.own && !newPlayerInfo.terrain_upgrade[index].own)) {
    return true;
  }

  if (oldPlayerInfo.posterior_upgrade.some((b, index) => b.own && !newPlayerInfo.posterior_upgrade[index].own)) {
    return true;
  }

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
          img={safeJoinPaths(constants.imgPathProfile, "/JobsIcon/Fermier.webp")} unoptimized />
      }

      {oldPlayerInfo.metier.miner.level > newPlayerInfo.metier.miner.level &&
        <SmallCardInfo title={"Metier de mineur"}
          value={oldPlayerInfo.metier.miner.level + " -> " + newPlayerInfo.metier.miner.level}
          img={safeJoinPaths(constants.imgPathProfile, "/JobsIcon/Mineur.webp")} unoptimized />
      }

      {oldPlayerInfo.metier.hunter.level > newPlayerInfo.metier.hunter.level &&
        <SmallCardInfo title={"Metier de chasseur"}
          value={oldPlayerInfo.metier.hunter.level + " -> " + newPlayerInfo.metier.hunter.level}
          img={safeJoinPaths(constants.imgPathProfile, "/JobsIcon/Chasseur.webp")} unoptimized />
      }

      {oldPlayerInfo.metier.alchemist.level > newPlayerInfo.metier.alchemist.level &&
        <SmallCardInfo title={"Metier d'alchimiste"}
          value={oldPlayerInfo.metier.alchemist.level + " -> " + newPlayerInfo.metier.alchemist.level}
          img={safeJoinPaths(constants.imgPathProfile, "/JobsIcon/Alchimiste.webp")} unoptimized />
      }

      {
        oldPlayerInfo.building.filter((e, index) => e.own > newPlayerInfo.building[index].own).map((b) => {
          return <SmallCardInfo title={b.name} key={"building" + b.index}
            value={"lvl: " + oldPlayerInfo.building[b.index].own + " -> lvl: " + newPlayerInfo.building[b.index].own}
            img={safeJoinPaths(constants.imgPathClicker, `/BuildingIcon/${b.index}.png`)} unoptimized />;
        })
      }

      {
        oldPlayerInfo.global_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.global_upgrade[index].own) {
            return <SmallCardInfo title={b.name}
              key={"global" + index}
              value={"✔️ -> ❌"}
              img={safeJoinPaths(constants.imgPathClicker, `/GlobalIcon/${index}.png`)} unoptimized />;
          } else {
            return null;
          }
        })
      }

      {
        oldPlayerInfo.terrain_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.terrain_upgrade[index].own) {
            return <SmallCardInfo title={b.name}
              key={"terrain" + index}
              value={"✔️ -> ❌"}
              img={safeJoinPaths(constants.imgPathClicker, `/TerrainIcon/${index}.png`)} unoptimized />;
          } else {
            return null;
          }
        })
      }

      {
        oldPlayerInfo.building_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.building_upgrade[index].own) {
            return <SmallCardInfo title={b.name}
              key={"building_upgrade" + index}
              value={"✔️ -> ❌"}
              img={safeJoinPaths(constants.imgPathClicker, `/BuildingUpgradeIcon/${index <= 15 ? 0 : 1}.png`)} unoptimized />;
          } else {
            return null;
          }
        })
      }

      {
        oldPlayerInfo.many_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.many_upgrade[index].own) {
            return <SmallCardInfo title={b.name}
              key={"many" + index}
              value={"✔️ -> ❌"}
              img={safeJoinPaths(constants.imgPathClicker, "/ManyIcon/0.png")} unoptimized />;
          } else {
            return null;
          }
        })
      }

      {
        oldPlayerInfo.posterior_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.posterior_upgrade[index].own) {
            return <SmallCardInfo title={b.name}
              key={"posterior" + index}
              value={"✔️ -> ❌"}
              img={safeJoinPaths(constants.imgPathClicker, "/PosteriorIcon/0.png")} unoptimized />;
          } else {
            return null;
          }
        })
      }

      {
        oldPlayerInfo.category_upgrade.map((b, index) => {
          if (b.own && !newPlayerInfo.category_upgrade[index].own) {
            return <SmallCardInfo title={b.name}
              key={"category" + index}
              value={"✔️ -> ❌"}
              img={safeJoinPaths(constants.imgPathClicker, `/CategoryIcon/${index}.png`)} unoptimized />;
          } else {
            return null;
          }
        })
      }
    </div>
  </>;

}