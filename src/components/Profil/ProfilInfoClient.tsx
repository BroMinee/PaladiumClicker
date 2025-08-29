'use client'
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import { computeTimePlayed, convertEpochToDateUTC2, formatPrice, getRankImg, safeJoinPaths } from "@/lib/misc.ts";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card.tsx";
import constants from "@/lib/constants.ts";
import Image from "next/image";
import { NameTagObject } from "skinview3d";
import { ErrorBoundary } from "./ErrorProfilErrorBoundary";

const ReactSkinview3d = dynamic(() => import("react-skinview3d"), { ssr: false });


export function ProfilUsernameInfo() {
  const { data: playerInfo } = usePlayerInfoStore();

  return <>
    {playerInfo?.username}
  </>
}

export function ProfilDescriptionAndBanner() {
  const { data: playerInfo } = usePlayerInfoStore();

  const description = playerInfo?.description === "" ? "Aucune description" : playerInfo?.description;
  let imgPath = constants.imgPathProfile;
  if (playerInfo?.currentBanner) {
    imgPath = safeJoinPaths(imgPath, `${playerInfo.currentBanner}.png`);
  }
  return <>
    {description}
    {playerInfo && playerInfo.currentBanner &&
      <Image
        src={imgPath}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-full"
        alt="banner">
      </Image>}
  </>
}

export function ProfilAlliance() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo)
    return null;

  if (playerInfo.alliance === "NEUTRAL") {
    return null;
  }

  const logo = safeJoinPaths(constants.imgPathProfile, `/logo_${playerInfo.alliance.toLowerCase()}.png`);

  return <Image src={logo} alt="Chaos" width={32} height={32}
                unoptimized={true}/>

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
                   img={safeJoinPaths(constants.imgPathProfile,"dollar.png")} unoptimized/>
  </>
}

export function PlayerSkin() {
  const { data: playerInfo } = usePlayerInfoStore();

  const pseudo = playerInfo?.username ?? "Notch";
  const skinUrl = `https://mineskin.eu/skin/${pseudo}`;
  const capeUrl = `https://crafatar.com/capes/${playerInfo?.uuid}`;
  return <ErrorBoundary fallback={<SkinFallback/>}> 
    <ReactSkinview3d className="!w-full !h-full rounded-md"
                            skinUrl={skinUrl}
                            capeUrl={capeUrl}
                            height="400"
                            width="400"
                            options={{
                              nameTag: new NameTagObject(`${playerInfo?.username}`, {
                                textStyle: "#ff5c00",
                                backgroundStyle: 'rgba(0,0,0,0)',
                                font: "48px Minecraft"
                              }), zoom: 0.75
                            }}
    />
  </ErrorBoundary>
}

export function PlayerRank() {
  const { data: playerInfo } = usePlayerInfoStore();
  let rank = "Default";

  if (playerInfo)
    rank = playerInfo.rank[0].toUpperCase() + playerInfo.rank.slice(1);

  if(playerInfo?.uuid === "b6e136eb-75cb-48bd-9ff5-dd9bfb64b869")
    return <SmallCardInfo title="Rang en jeu" value="Blackhole" img={safeJoinPaths(constants.imgPathProfile,"blackhole.png")}
                          imgClassName="w-fit"
                          unoptimized/>

  return <SmallCardInfo title="Rang en jeu" value={rank} img={getRankImg(rank)}
                        imgClassName="w-fit"
                        unoptimized/>
}

export function PlayerTimePlayed() {
  const { data: playerInfo } = usePlayerInfoStore();
  return <SmallCardInfo title="Temps de jeu" value={computeTimePlayed(playerInfo?.timePlayed || 0)}
                        img={safeJoinPaths(constants.imgPathProfile,"clock.gif")} unoptimized/>
}

export function PlayerFirstConnection() {
  const { data: playerInfo } = usePlayerInfoStore();
  return <SmallCardInfo title="Première connexion" value={convertEpochToDateUTC2(playerInfo?.firstSeen || 1)}
                        img={safeJoinPaths(constants.imgPathProfile,"clock.gif")} unoptimized/>
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
          <a href={safeJoinPaths(constants.profilPath, player.name)} key={player.uuid}>
            <Card className="hover:scale-105 duration-300 mt-4 ml-1.5 mr-1.5 cursor-pointer">
              <CardContent className="md:pt-6 space-y-2">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Image src={`https://crafatar.com/avatars/${player.uuid}?size=8&overlay`}
                         alt="Icône"
                         width={48} height={48}
                         unoptimized={true}
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

function SkinFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 border rounded-md bg-muted text-muted-foreground">
      Erreur lors du rendu du skin.
    </div>
  );
}