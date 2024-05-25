import React, {useEffect} from "react";
import {useMetierToReachStore, usePlayerInfoStore} from "@/stores/use-player-info-store.ts";
import constants from "@/lib/constants.ts";
import {formatPrice} from "@/lib/misc.ts";
import {MetierComponent} from "@/components/MetierList.tsx";
import Layout from "@/components/shared/Layout.tsx";
import NoPseudoPage from "@/components/NoPseudoPage.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import {FaHeart, FaInfoCircle, FaPercentage, FaTachometerAlt} from "react-icons/fa";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";


const CalculatorPage = () => {
  const {data: playerInfo, increaseMetierLevel, decreaseMetierLevel} = usePlayerInfoStore();
  const {
    metierToReach: metierToReach,
    increaseMetierLevelToReach,
    decreaseMetierLevelToReach,
    setMetierSelected,
    getIndexMetierSelected,
    setMetierToReach
  } = useMetierToReachStore();

  const [doubleXp, setDoubleXP] = React.useState(0);
  const [dailyBonus, setDailyBonus] = React.useState(0);

  useEffect(() => {
    if (!playerInfo)
      return;

    if (!metierToReach || metierToReach.some((e) => e["level"] <= playerInfo["metier"][getIndexMetierSelected()]["level"]))
      setMetierToReach(playerInfo["metier"]);
  }, [playerInfo]);

  if (!playerInfo)
    return <Layout>
      <NoPseudoPage/>
    </Layout>

  let bonusXpRank = 0;
  switch (playerInfo["rank"]) {
    case "titane":
      bonusXpRank = 5;
      break;
    case "paladin":
      bonusXpRank = 10;
      break;
    case "endium":
    case "trixium":
    case "trixium+":
      bonusXpRank = 15;
      break;
  }

  function getTotalXPForLevel(level: number) {
    return constants.metier_palier[level - 1];

  }

  function getXpDiff() {
    if (!playerInfo?.metier)
      return 0;
    const higherLevel = metierToReach[getIndexMetierSelected()]["level"];
    const res = getTotalXPForLevel(higherLevel) - playerInfo["metier"][indexMetierSelectedInPlayerInfo]["xp"];
    if (res < 0) {
      return playerInfo["metier"][indexMetierSelectedInPlayerInfo]["level"] === 100 ? 0 : -1;
    }
    return res;
  }


  if (!playerInfo)
    return (<Layout>
      "Chargement..."
    </Layout>)

  const indexMetierSelectedInPlayerInfo = playerInfo["metier"].findIndex((e) => {
    return e["name"] === metierToReach[getIndexMetierSelected()]["name"];
  });

  return (
      <Layout>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Bienvenue sur le calculateur{" "}
                <GradientText className="font-extrabold">d'xp de métier</GradientText>
              </CardTitle>
              <CardDescription>
                Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-evenly">
              {/*<select onChange={(e) => {*/}
              {/*  setMetierSelected(e.target.value)*/}
              {/*}}>*/}
              {/*  {playerInfo["metier"].map((e, index) => {*/}
              {/*        return <option key={index}*/}
              {/*                       value={e["name"]}>{e["name"][0].toUpperCase() + e["name"].slice(1)}</option>*/}
              {/*      }*/}
              {/*  )}*/}
              {/*</select>*/}
              <div className="grid-cols-2 grid sm:grid-cols-4">
                {["mineur", "farmer", "hunter", "alchimiste"].map((e, index) => {
                  return (
                      <img key={index} src={`${import.meta.env.BASE_URL}/JobsIcon/${e}.webp`} alt={e}
                           className={cn("object-cover h-36 w-auto pixelated hover:scale-105 duration-300 cursor-pointer",
                               metierToReach[getIndexMetierSelected()]["name"] !== e ? "grayscale" : "")}
                           onClick={() => {
                             setMetierSelected(e);
                           }}
                      />
                  )
                })

                }
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            <Card className="pt-6 flex flex-col items-center justify-center gap-2">
              <CardHeader>
                <h1>Niveau actuel</h1>
              </CardHeader>
              <CardContent>
                {getIndexMetierSelected() !== -1 ?
                    <MetierComponent playerInfoMetier={playerInfo.metier} increaseMetierLevel={increaseMetierLevel}
                                     decreaseMetierLevel={decreaseMetierLevel}
                                     metier={playerInfo.metier[indexMetierSelectedInPlayerInfo]} editable={false}/> : ""
                }
              </CardContent>
            </Card>
            <Card className="pt-6 flex flex-col items-center justify-center gap-2">
              <CardHeader>
                <h1>Niveau à atteindre</h1>
              </CardHeader>
              <CardContent>
                {getIndexMetierSelected() !== -1 ?
                    <MetierComponent playerInfoMetier={metierToReach} increaseMetierLevel={increaseMetierLevelToReach}
                                     decreaseMetierLevel={decreaseMetierLevelToReach}
                                     metier={metierToReach[getIndexMetierSelected()]}
                                     editable={true}
                                     minLevel={playerInfo["metier"][indexMetierSelectedInPlayerInfo]["level"] + 1}/> : ""
                }
              </CardContent>
            </Card>

          </div>


          {getIndexMetierSelected() !== -1 ?
              <XpBonus setDailyBonus={setDailyBonus} dailyBonus={dailyBonus} doubleXp={doubleXp}
                       setDoubleXP={setDoubleXP} bonusXpRank={bonusXpRank}/>
              : ""}
          <HowToXp metierName={playerInfo["metier"][indexMetierSelectedInPlayerInfo]["name"]} bonusXpRank={bonusXpRank}
                   xpNeeded={getXpDiff()} doubleXp={doubleXp} dailyBonus={dailyBonus}/>

        </div>
      </Layout>
  )
}


type XpBonusProps = {
  dailyBonus: number,
  doubleXp
      :
      number,
  setDoubleXP
      :
      (value: number) => void,
  setDailyBonus
      :
      (value: number) => void,
  bonusXpRank
      :
      number,
}

const XpBonus = ({
                   dailyBonus, doubleXp, setDoubleXP, setDailyBonus, bonusXpRank
                 }: XpBonusProps) => {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 justify-evenly">
              <div className="flex justify-center flex-row">
                <div className="space-y-2 flex justify-center flex-col">
                  <div className="text-sm">
                    <FaPercentage className="h-4 w-4 mr-2 inline-block"/>
                    Bonus double XP:{" "}
                    <GradientText className="font-bold">
                      {doubleXp}%
                    </GradientText>
                  </div>
                  <Button className={doubleXp === 100 ? "bg-red-500" : "bg-green-500"}
                          onClick={() => {
                            if (doubleXp === 0)
                              setDoubleXP(100);
                            else
                              setDoubleXP(0);
                          }}
                  >
                    {doubleXp === 100 ? "Annuler la double XP" : "Prendre une double XP"}
                  </Button>
                </div>
              </div>
              <div className="flex justify-center flex-row">
                <div className="space-y-2 flex justify-center flex-col">
                  <div className="text-sm">
                    <FaPercentage className="h-4 w-4 mr-2 inline-block"/>
                    Bonus quotidien:{" "}
                    <GradientText className="font-bold">
                      {dailyBonus}%
                    </GradientText>
                  </div>
                  <Input className="w-auto" type="number" min="0" step="0.1" max="99" value={Number(dailyBonus)}
                         onChange={(e) => {
                           setDailyBonus(Number(e.target.value))
                         }}/>

                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="h-full pt-6 flex items-center gap-4">
            <FaTachometerAlt className="w-12 h-12"/>
            <div className="flex flex-col gap-2">

              <span className="font-semibold">Bonus d'xp total</span>

              <div className="flex gap-2 items-center">
                <GradientText className="font-bold">
                  {dailyBonus + doubleXp + bonusXpRank}%
                </GradientText>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FaInfoCircle className="inline-block h-4 w-4"/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    Double XP: {doubleXp}%
                    <br/>
                    Bonus Grade: {bonusXpRank}%
                    <br/>
                    Bonus quotidien: {dailyBonus}%
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>

        </Card>
      </div>
  )
}

type HowToXpProps = {
  metierName: string,
  xpNeeded
      :
      number,
  bonusXpRank
      :
      number,
  dailyBonus
      :
      number,
  doubleXp
      :
      number,
}

const HowToXp = ({
                   metierName, xpNeeded, bonusXpRank, dailyBonus, doubleXp
                 }: HowToXpProps) => {
  const bonusXpWithoutDouble = bonusXpRank + dailyBonus;
  const bonusXpDouble = bonusXpWithoutDouble + doubleXp;
  const xpNeededWithoutDoubleXP = xpNeeded / ((100 + bonusXpWithoutDouble) / 100);
  const xpNeededWithDoubleXP = xpNeeded / ((100 + bonusXpDouble) / 100);

  return (
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle className="text-2xl">
            Il te manque{" "}
            <GradientText>
              {formatPrice(Math.ceil(xpNeeded))} xp
            </GradientText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-center`}>
            {
              constants.how_to_xp[metierName].map((e, index) => {
                return (
                    <div key={index} className="flex flex-row items-center gap-4">
                      <img src={`${import.meta.env.BASE_URL}/AH_img/${e["imgPath"]}`} alt={e.imgPath}
                           className="object-cover h-16 w-auto pixelated"/>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {e.action}
                        </span>
                        <GradientText className="font-bold">
                          {formatPrice(Math.ceil(xpNeededWithDoubleXP / e.xp))} fois
                        </GradientText>
                        <span className="font-semibold">{e.type}</span>
                      </div>
                    </div>)
              })
            }
            <div className="flex flex-row items-center gap-4">
              <img src={`${import.meta.env.BASE_URL}/AH_img/glass_bottle.png`} alt="glass_bottle.png"
                   className="object-cover h-12 w-auto pixelated"/>
              <div className="flex flex-col">
                        <span className="font-semibold">
                          {"Consume"}{" "}
                          <GradientText className="font-bold">
                            {formatPrice(Math.ceil(xpNeededWithoutDoubleXP / 1000))} fois
                        </GradientText>
                        </span>
                <span className="font-semibold">Expérience de {metierName} [+1000]</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}

export default CalculatorPage;