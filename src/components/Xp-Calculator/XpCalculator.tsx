import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { FaInfoCircle, FaPercentage, FaTachometerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import {
  ButtonTakeDoubleXp,
  DisplayDailyDoubleRank,
  DisplayXpBonus,
  DisplayXpNeeded,
  DisplayXpNeededWithBottle,
  DisplayXpNeededWithDouble,
  InputDailyBonus
} from "@/components/Xp-Calculator/MetierSelectorClient.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import constants from "@/lib/constants.ts";
import { safeJoinPaths } from "@/lib/misc.ts";
import { MetierKey } from "@/types";

export type searchParamsXpBonusPage = {
  metier: string | undefined,
  level: number | undefined,
  double: boolean | undefined
  dailyBonus: number | undefined
}

export function XpBonus({ params, searchParams }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage
}) {
  const doubleXp = searchParams.double ? 100 : 0;
  const dailyBonus = searchParams.dailyBonus || 0;

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
                <ButtonTakeDoubleXp params={params} searchParams={searchParams} doubleXp={doubleXp}>
                  {doubleXp === 100 ? "Annuler la double XP" : "Prendre une double XP"}
                </ButtonTakeDoubleXp>
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
                <InputDailyBonus params={params} searchParams={searchParams}/>
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
                <DisplayDailyDoubleRank doubleXp={doubleXp} dailyBonus={dailyBonus}/>
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
                  Bonus Grade: <DisplayXpBonus/>
                  <br/>
                  Bonus quotidien: {dailyBonus}%
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>

      </Card>
    </div>)
}

export function HowToXp({ params, searchParams }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage
}) {
  if (searchParams.metier === undefined)
    return null;


  return (
    <Card>
      <CardHeader className="flex items-center">
        <CardTitle className="text-2xl">
          Il te manque{" "}
          <GradientText>
            <DisplayXpNeeded searchParams={searchParams}/>
          </GradientText>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-center`}>
          <div className="flex flex-row items-center gap-4">
            <img src={safeJoinPaths(`/AH_img/glass_bottle.png`)} alt="glass_bottle.png"
                 className="object-cover h-12 w-auto pixelated"/>
            <div className="flex flex-col">
                        <span className="font-semibold">
                          {"Consume"}{" "}
                          <GradientText className="font-bold">
                            <DisplayXpNeededWithBottle searchParams={searchParams}/>
                        </GradientText>
                        </span>
              <span className="font-semibold">Expérience de {searchParams.metier} [+1000]</span>
            </div>
          </div>
          {
            searchParams.metier && constants.how_to_xp[searchParams.metier as MetierKey].map((e, index) => {
              return (
                <div key={index} className="flex flex-row items-center gap-4">
                  <img src={safeJoinPaths(`/AH_img/${e["imgPath"]}`)}
                       alt={e.imgPath}
                       className="object-cover h-16 w-auto pixelated"/>
                  <div className="flex flex-col">
                        <span className="font-semibold">
                          {e.action}
                        </span>
                    <GradientText className="font-bold">
                      <DisplayXpNeededWithDouble searchParams={searchParams} xp={e.xp}/>
                    </GradientText>
                    <span className="font-semibold">{e.type}</span>
                  </div>
                </div>)
            })
          }
        </div>
      </CardContent>
    </Card>
  )
}