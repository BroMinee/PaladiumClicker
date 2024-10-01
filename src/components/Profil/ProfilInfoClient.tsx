'use client'
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import { computeTimePlayed, convertEpochToDateUTC2, formatPrice, getRankImg } from "@/lib/misc.ts";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card.tsx";
import constants from "@/lib/constants.ts";
import Image from "next/image";

const ReactSkinview3d = dynamic(() => import("react-skinview3d"), { ssr: false });


export function ProfilUsernameInfo() {
  const { data: playerInfo } = usePlayerInfoStore();

  return <>
    {playerInfo?.username}
  </>
}

export function PlayerViewCount() {
  const { data: playerInfo } = usePlayerInfoStore();
  return <>
    {playerInfo?.view_count?.count || -1} vues
  </>
}

export function PlayerMoney() {
  const { data: playerInfo } = usePlayerInfoStore();
  return <>
    <SmallCardInfo title="Argent actuel" value={`${formatPrice(Math.round(playerInfo?.money || 0))} $`}
                   img="dollar.png"/>
  </>
}

export function PlayerSkin() {
  const { data: playerInfo } = usePlayerInfoStore();

  const pseudo = playerInfo?.username ?? "Notch";
  const skinUrl = `https://mineskin.eu/skin/${pseudo}`;

  return <ReactSkinview3d className="!w-full !h-full rounded-md"
                          skinUrl={skinUrl}
                          height="400"
                          width="400"
  />
}

export function PlayerRank() {
  const { data: playerInfo } = usePlayerInfoStore();
  let rank = "Default";

  if (playerInfo)
    rank = playerInfo.rank[0].toUpperCase() + playerInfo.rank.slice(1);

  return <SmallCardInfo title="Rang en jeu" value={rank} img={getRankImg(rank)}/>
}

export function PlayerTimePlayed() {
  const { data: playerInfo } = usePlayerInfoStore();
  return <SmallCardInfo title="Temps de jeu" value={computeTimePlayed(playerInfo?.timePlayed || 0)}
                        img="clock.gif"/>
}

export function PlayerFirstConnection() {
  const { data: playerInfo } = usePlayerInfoStore();
  return <SmallCardInfo title="Première connexion" value={convertEpochToDateUTC2(playerInfo?.firstJoin || 1)}
                        img="clock.gif"/>
}

export function PlayerFriendsCount() {
  const { data: playerInfo } = usePlayerInfoStore();
  let friendCount = -1;
  if (playerInfo)
    friendCount = playerInfo.friends.totalCount;

  return <>
    Liste d&apos;amis: {friendCount}
  </>
}

export function PlayerFriends() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo)
    return null

  return (
    <>
      {
        playerInfo.friends?.data?.map((player) => (
          <a href={`${constants.profilPath}/${player.name}`} key={player.uuid}>
            <Card  className="hover:scale-105 duration-300 mt-4 ml-1.5 mr-1.5 cursor-pointer">
            <CardContent className="md:pt-6 space-y-2">
              <div className="flex flex-col items-center justify-center gap-2">
                <Image src={`https://crafatar.com/avatars/${player.uuid}?size=8&overlay`}
                     alt="Icône"
                       width={48} height={48}
                       className="object-cover pixelated rounded-md"/>
                <div
                  className="text-primary font-bold text-center w-36">{player.name}</div>
              </div>
            </CardContent>
          </Card>
          </a>
        ))
      }
    </>
  )
}