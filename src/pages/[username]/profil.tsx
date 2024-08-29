import MetierList from "@/components/MetierList.tsx";
import ImportProfil from "../OptimizerClicker/Components/ImportProfil.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaEye, FaHeart, FaMedal, FaPercentage, FaTachometerAlt } from "react-icons/fa";
import HeadingSection from "@/components/shared/HeadingSection.tsx";

import dynamic from "next/dynamic";
import { AhItemType } from "@/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { formatPrice, GetAllFileNameInFolder, levensteinDistance, safeJoinPaths } from "@/lib/misc.ts";
import useFactionLeaderboard from "@/hooks/use-leaderboard-faction.ts";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import Head from "next/head";

const ReactSkinview3d = dynamic(() => import("react-skinview3d"), { ssr: false });


export { getServerSideProps } from "@/components/shared/PlayerProvider.tsx";


export default function ProfilePage() {


  // useEffect(() => {
  //   if (!pseudoParams && playerInfo) {
  //     navigate(safeJoinPaths("/" + playerInfo.username, constants.profilPath));
  //     return;
  //   }
  // }, []);
  const { data: playerInfo } = usePlayerInfoStore();

  return (
    <>
      <Head>
        <title>Profil de {playerInfo?.username ?? "Notch"}</title>
        {/* set description*/}
        <meta name="description"
              content={`Profil de ${playerInfo?.username ?? "Notch"} - faction : ${playerInfo?.faction.name}`}/>

        {/*set og title*/}
        <meta property="og:title" content={`Profil de ${playerInfo?.username ?? "Notch"}`}/>
        {/*set og description*/}
        <meta property="og:description"
              content={`Profil de ${playerInfo?.username ?? "Notch"} - faction : ${playerInfo?.faction.name}`}/>
        {/*set og url*/}
      </Head>
      <div className="flex flex-col gap-4">
        <ProfilInfo/>
        <MetierList editable={false}/>
        <AhInfo/>
        <HeadingSection>Informations de faction</HeadingSection>
        <FactionInfo/>
      </div>
    </>
  );
}

const ProfilInfo = () => {
  const { data: playerInfo } = usePlayerInfoStore();
  const pseudo = playerInfo?.username ?? "Notch";
  const skinUrl = `https://mineskin.eu/skin/${pseudo}`;

  if (!playerInfo) {
    return <>
      Player Info is null
    </>
  }

  const rank = playerInfo["rank"][0].toUpperCase() + playerInfo["rank"].slice(1);

  return (<Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>
        Profil de{" "}
        <GradientText className="font-extrabold">{playerInfo["username"]}</GradientText>
        {" - "}
        <GradientText className="font-extrabold">{playerInfo["faction"]["name"]}</GradientText>
        <div className="flex flex-row gap-2 items-center mt-1.5">
          <FaEye/>
          <GradientText className="font-extrabold">{playerInfo.view_count.count} vues</GradientText>
        </div>
      </CardTitle>

      <CardDescription>
        Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-4 gap-4">
        <Card className="flex flex-col items-center justify-center row-span-4">
          <CardHeader className="w-full h-full">
            <ReactSkinview3d className="!w-full !h-full rounded-md"
                             skinUrl={skinUrl}
                             height="400"
                             width="400"
            />
          </CardHeader>
          <CardContent>
            <ImportProfil/>
          </CardContent>
        </Card>
        <Card className="col-start-1 col-span-2 md:col-start-2 md:col-span-1">

          <SmallCardInfo title="Argent actuel" value={`${formatPrice(Math.round(playerInfo["money"]))} $`}
                         img="dollar.png"/>
        </Card>
        <Card className="col-start-1 col-span-2 md:col-start-2 md:col-span-1">
          <SmallCardInfo title="Rang en jeu" value={rank} img={getRankImg(rank)}/>
        </Card>
        <Card className="col-start-1 col-span-2 md:col-start-2 md:col-span-1">
          <SmallCardInfo title="Temps de jeu" value={computeTimePlayed(playerInfo["timePlayed"])}
                         img="clock.gif"/>
        </Card>
        <Card className="col-start-1 col-span-2 md:col-start-2 md:col-span-1">
          <SmallCardInfo title="Première connexion" value={convertEpochToDateUTC2(playerInfo["firstJoin"])}
                         img="clock.gif"/>
        </Card>

        <Card
          className="col-span-2 row-span-4 col-start-2 row-start-1 md:row-span-4 md:col-start-3 md:row-start-1">
          <CardHeader>
            Liste d&apos;amis: {playerInfo.friends.totalCount}
          </CardHeader>
          <CardContent className="flex max-h-64 md:max-h-96 justify-center">
            <ScrollArea className="md:w-full flex justify-center">
              <div className="flex flex-col justify-center p-4 pt-0 pb-0">
                {
                  playerInfo.friends?.data?.map((player, index) => (
                    <Card key={index} onClick={() => handleOnClick(player.name)}
                          className="hover:scale-105 duration-300 mt-4 ml-1.5 mr-1.5 cursor-pointer">
                      <CardContent className="md:pt-6 space-y-2">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <img src={`https://crafatar.com/avatars/${player.uuid}?size=8&overlay`}
                               alt="Icône"
                               className="object-cover h-12 w-12 pixelated rounded-md"/>
                          <div
                            className="text-primary font-bold text-center w-36">{player.name}</div>
                        </div>
                      </CardContent>
                    </Card>

                  ))
                }
              </div>
              <ScrollBar orientation="horizontal"/>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>);
}

const AhInfo = () => {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo || !playerInfo.ah)
    return <div>Loading</div>

  const totalCount = playerInfo.ah.totalCount;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center">
          Hôtel de vente - {" "}
          {totalCount}{" "}
          {totalCount !== 1 ? "ventes en cours" : "vente en cours"}
        </CardTitle>

      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="flex gap-4 pb-3">
            {totalCount !== 0 &&
              playerInfo["ah"]["data"].map((e, index) => {
                return <AhItem key={index} item={e}/>
              })
            }
          </div>
          <ScrollBar orientation="horizontal"/>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}


type AhItemsProps = {
  item: AhItemType;
}

const AhItem = ({ item }: AhItemsProps) => {
  const { data: playerInfo } = usePlayerInfoStore();


  if (!playerInfo || !item["item"])
    return <div>Loading</div>


  // const createdAt = convertEpochToDateUTC2(item["createdAt"]);
  const expireAt = convertEpochToDateUTC2(item["expireAt"]);
  // const item_meta = item["item"]["meta"];
  let item_name = item["item"]["name"].replace("palamod:", "").replace("item.", "").replace("minecraft:", "").replace("tile.", "").replace("customnpc:", "").replace("guardiangolem:", "")

  if (item_name === "IronChest:BlockIronChest") {
    item_name = item["name"];
  }


  const quantity = item["item"]["quantity"];
  const name = item["name"];
  const price = item["price"];
  const pricePb = item["pricePb"];
  const renamed = item["renamed"];
  // const skin = item["skin"];
  // const type = item["type"][0].toUpperCase() + item["type"].slice(1).toLowerCase();

  const closestItemName = GetAllFileNameInFolder().reduce((acc, curr) => {
    if (levensteinDistance(curr, item_name) < levensteinDistance(acc, item_name)) {
      return curr;
    } else {
      return acc;
    }
  });

  let displayName = item["item"]["name"];
  if (item["item"]["name"] === "StorageDrawers:fullDrawers4")
    displayName = "StorageDrawers 2x2";
  else if (item["item"]["name"] === "StorageDrawers:fullDrawers2")
    displayName = "StorageDrawers 1x2";
  else if (item["item"]["name"] === "StorageDrawers:fullDrawers1")
    displayName = "StorageDrawers 1x1";

  return (
    <Card>
      <CardContent className="pt-6 space-y-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <img src={safeJoinPaths("/AH_img/", `${closestItemName}.png`)} alt="Icône"
               className="object-cover h-12 w-auto pixelated"/>
          <span
            className="text-primary text-sm">{quantity}x {renamed ? `${displayName} renommé en ${name}` : `${name}`}</span>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <img src={safeJoinPaths("dollar.png")} alt="Icône"
                 className="object-cover h-10 w-10 inline-block pixelated mr-2"/>
            Prix: {formatPrice(price)} $
          </div>
          <div className="text-sm">
            <img src={safeJoinPaths("/pbs.png")} alt="Icône"
                 className="object-cover h-10 w-10 pixelated inline-block mr-2"/>
            Prix en pbs: {formatPrice(pricePb)}
          </div>
          <div className="text-sm">
            <img src={safeJoinPaths("/clock.gif")} alt="Icône"
                 className="object-cover h-10 w-10 pixelated inline-block mr-2"/>
            Expire le : {expireAt}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const FactionInfo = () => {
  const { data: playerInfo } = usePlayerInfoStore();

  const factionLeaderboard = useFactionLeaderboard();

  if (!playerInfo || !playerInfo.faction || !playerInfo.faction.level || factionLeaderboard === undefined || typeof factionLeaderboard === "string")
    return <div>Loading</div>


  const name = playerInfo.faction.name;
  const factionDescription = playerInfo.faction.description;
  //const access = playerInfo["faction"]["access"];
  const createdAt = playerInfo.faction.createdAt;
  const level = playerInfo.faction.level?.level;
  const xp = playerInfo.faction.level?.xp;
  const playerList = playerInfo.faction.players;
  const factionIndex = factionLeaderboard.findIndex((faction) => faction["name"] === name) + 1;
  const factionClassement = (factionIndex !== 0 ? factionIndex : `>${factionLeaderboard.length}`);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="md:row-span-2">
        <CardContent className="h-full pt-6 flex gap-4">
          <img src={safeJoinPaths("BookAndQuill.webp")} alt="BookAndQuill.png"
               className="h-12 w-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">{name}</span>
            <div className="flex gap-2 items-center">
              <GradientText className="font-bold">
                {factionDescription}
              </GradientText>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaTachometerAlt className="w-12 h-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Nombre de membres</span>
            <div className="flex gap-2 items-center">
              <GradientText className="font-bold">
                {formatPrice(playerList?.length)}
              </GradientText>
              Membre{playerList?.length !== undefined && playerList?.length > 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaMedal className="w-12 h-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Classement</span>
            <div className="flex gap-2 items-center">
              Top
              <GradientText className="font-bold">
                #{factionClassement}
              </GradientText>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <SmallCardInfo title="Niveau - [xp]" value={`${level} - [${formatPrice(xp)}]`}
                       img="ExperienceOrb.webp"/>
      </Card>
      <Card>
        <SmallCardInfo title="Date de création" value={convertEpochToDateUTC2(createdAt)} img="clock.gif"/>
      </Card>
      <ScrollArea className="md:col-span-3">
        <div className="flex gap-4 pb-3">
          {
            playerList?.map((player, index) => (
              <Card key={index} onClick={() => handleOnClick(player.username)}
                    className="hover:scale-105 duration-300 mt-4 ml-1.5 mr-1.5 cursor-pointer">
                <CardContent className="pt-6 space-y-2">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <img src={`https://crafatar.com/avatars/${player.uuid}?size=8&overlay`}
                         alt="Icône"
                         className="object-cover h-12 w-12 pixelated rounded-md"/>
                    <div className="text-primary font-bold text-center w-36">{player.username}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <FaPercentage className="h-4 w-4 mr-2 inline-block"/>
                      Rôle: {player.group}
                    </div>
                    <div className="text-sm">
                      <img src={safeJoinPaths("clock.gif")} alt="Icône"
                           className="object-cover h-4 w-4 inline-block pixelated mr-2"/>
                      Rejoint le: {convertEpochToDateUTC2(player.joinedAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
        <ScrollBar orientation="horizontal"/>
      </ScrollArea>
    </div>
  )
}

function computeTimePlayed(timeInMinutes: number) {
  const minute = timeInMinutes % 60;
  const hour = Math.floor(timeInMinutes / 60) % 24;
  const day = Math.floor(timeInMinutes / 60 / 24);
  let res = "";
  if (day > 0) {
    res += day + "j ";
  }
  if (hour > 0) {
    res += hour + "h ";
  }
  res += minute + "m";

  return res;
}

function getRankImg(rank: string) {
  if (rank === "Default") {
    return "dirt.png";
  } else if (rank === "Titan") {
    return "titan.png";
  } else if (rank === "Paladin") {
    return "paladin.png";
  } else if (rank === "Endium") {
    return "endium.png";
  } else if (rank === "Trixium") {
    return "trixium.png";
  } else if (rank === "Trixium+") {
    return "trixium+.png";
  } else if (rank === "Youtuber") {
    return "youtuber.png";
  } else {
    return "unknown.png"
  }
}

function handleOnClick(pseudo: string) {
  // open url in a new tab
  if (pseudo.includes(" ") && pseudo.split(" ").length > 1)
    pseudo = pseudo.split(" ")[1];
  const pseudoInput = document.getElementById("pseudo") as HTMLInputElement | null;
  const searchButton = document.getElementById("pseudo-submit");
  if (pseudoInput !== null && searchButton !== null) {
    pseudoInput.value = pseudo;
    searchButton.click();
    pseudoInput.value = "";
    console.log("TODO check that the both element selected are in the same div")
  }

}

function convertEpochToDateUTC2(epoch: number | undefined) {
  if (!epoch) return "Error";
  const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
  date.setUTCSeconds(epoch / 1000);
  return date.toLocaleString();
}