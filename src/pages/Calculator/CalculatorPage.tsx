import React, {useEffect} from "react";
import {useMetierToReachStore, usePlayerInfoStore} from "@/stores/use-player-info-store.ts";
import {toast} from "sonner";
import {AxiosError} from "axios";
import useLoadPlayerInfoMutation from "@/hooks/use-load-player-info-mutation.ts";
import constants from "@/lib/constants.ts";
import {GetAllFileNameInFolder} from "@/pages/Profil/Profil.tsx";
import {formatPrice, levensteinDistance} from "@/lib/misc.ts";
import {SlArrowDown, SlArrowUp} from "react-icons/sl";
import {Metier} from "@/components/MetierList.tsx";
import Layout from "@/components/shared/Layout.tsx";
import NoPseudoPage from "@/components/NoPseudoPage.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import {FaBolt, FaHeart, FaPercentage, FaTachometerAlt} from "react-icons/fa";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";


const CalculatorPage = () => {
  const {data: playerInfo, increaseMetierLevel, decreaseMetierLevel} = usePlayerInfoStore();
  const {mutate: loadPlayerInfo, isPending} = useLoadPlayerInfoMutation();
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
    setMetierToReach(playerInfo["metier"]);
  }, [playerInfo]);

  if (!playerInfo)
    return <Layout>
      <NoPseudoPage/>
    </Layout>


  async function refetchPlayerInfo() {
    if (!playerInfo || isPending)
      return;
    loadPlayerInfo(String(playerInfo.username), {
      onSuccess: () => {
        toast.success("Profil importé avec succès");
      },
      onError: (error) => {
        const message = error instanceof AxiosError ?
            error.response?.data.message ?? error.message :
            typeof error === "string" ?
                error :
                "Une erreur est survenue";
        toast.error(message);
      }
    });
  }


  for (let i = 0; i < playerInfo["metier"].length; i++) {
    if (playerInfo["metier"][i]["xp"] === 0 && playerInfo["metier"][i]["level"] !== 1) {
      console.log("Resetting xp");
      refetchPlayerInfo();
    }
  }

  let bonusXp = 0;
  switch (playerInfo["rank"]) {
    case "titane":
      bonusXp = 5;
      break;
    case "paladin":
      bonusXp = 10;
      break;
    case "endium":
    case "trixium":
    case "trixium+":
      bonusXp = 15;
      break;
  }

  function getTotalXPForLevel(level: number) {
    return constants.metier_palier[level - 1];

  }

  function getXpDiff() {

    const higherLevel = metierToReach[getIndexMetierSelected()]["level"];
    return (getTotalXPForLevel(higherLevel) - playerInfo["metier"][getIndexMetierSelected()]["xp"]);
  }


  const xpNeeded = getXpDiff();

  console.log(getIndexMetierSelected());


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
                Bienvenue sur le calculateur d'{" "}
                <GradientText className="font-extrabold">xp</GradientText>
              </CardTitle>
              <CardDescription>
                Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <select onChange={(e) => {
                setMetierSelected(e.target.value)
                console.log(e.target.value)
              }}>
                {playerInfo["metier"].map((e, index) => {
                      return <option key={index}
                                     value={e["name"]}>{e["name"][0].toUpperCase() + e["name"].slice(1)}</option>
                    }
                )}
              </select>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            <Card className="pt-6 flex flex-col items-center justify-center gap-2">
              <CardHeader>
                <h1>Niveau actuel</h1>
              </CardHeader>
              <CardContent>
                {getIndexMetierSelected() !== -1 ?
                    <Metier playerInfoMetier={playerInfo.metier} increaseMetierLevel={increaseMetierLevel}
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
                    <Metier playerInfoMetier={metierToReach} increaseMetierLevel={increaseMetierLevelToReach}
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
                       setDoubleXP={setDoubleXP}/>
              : ""}
          <Card>
            <HowToXp metierName={playerInfo["metier"][indexMetierSelectedInPlayerInfo]["name"]} bonusXp={bonusXp}
                     xpNeeded={getXpDiff()} doubleXp={doubleXp} dailyBonus={dailyBonus}/>
          </Card>
        </div>
      </Layout>
  )
}


type XpBonusProps = {
  dailyBonus: number,
  doubleXp: number,
  setDoubleXP: (value: number) => void,
  setDailyBonus: (value: number) => void,
}

const XpBonus = ({dailyBonus, doubleXp, setDoubleXP, setDailyBonus}: XpBonusProps) => {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-row gap-6 justify-evenly">
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
                           console.log(e.target.value)
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
                  {dailyBonus + doubleXp}%
                </GradientText>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

type HowToXpProps = {
  metierName: string,
  xpNeeded: number,
  bonusXp: number,
  dailyBonus: number,
  doubleXp: number,
}

const HowToXp = ({metierName, xpNeeded, bonusXp, dailyBonus, doubleXp}: HowToXpProps) => {
  const [methodSelected, setMethodSelected] = React.useState(constants.how_to_xp[metierName][0]["type"]);
  const methodAvailable = constants.how_to_xp[metierName].map((e) => {
    return e["type"];
  })


  useEffect(() => {
    setMethodSelected(constants.how_to_xp[metierName][0]["type"]);
  }, [metierName]);

  const bonusXpWithoutDouble = bonusXp + dailyBonus;
  const bonusXpDouble = bonusXpWithoutDouble + doubleXp;
  const xpNeededWithoutDoubleXP = xpNeeded / ((100 + bonusXpWithoutDouble) / 100);
  const xpNeededWithDoubleXP = xpNeeded / ((100 + bonusXpDouble) / 100);

  const closestItemName = methodSelected !== "" ? GetAllFileNameInFolder().reduce((acc, curr) => {
    if (levensteinDistance(curr, methodSelected) < levensteinDistance(acc, methodSelected)) {
      return curr;
    } else {
      return acc;
    }
  }) : "";

  return (
      <div>


        <h1>Il te manque {formatPrice(xpNeeded)} xp (bonus de {bonusXpDouble}%)

        </h1>
        <select onChange={(e) => {
          setMethodSelected(e.target.value)
        }}>
          {methodAvailable.map((e, index) => {
            return <option key={index} value={e}>{e}</option>
          })}
        </select>

        {closestItemName !== "" && constants.how_to_xp[metierName].find((e) => e["type"] === methodSelected) !== undefined ?
            <div>
              {`AH_img/${closestItemName}.png`}
              {methodSelected}
              {formatPrice(Math.ceil(xpNeededWithDoubleXP / constants.how_to_xp[metierName].find((e) => e["type"] === methodSelected)["xp"]))}
            </div> : ""}
        {closestItemName !== "" ?
            <div>

              {`AH_img/glass_bottle.png`}
              {"bottle xp métier [+1000]"}
              {formatPrice(Math.ceil(xpNeededWithoutDoubleXP / 1000))}
            </div> : ""
        }


      </div>
  )
}

export default CalculatorPage;