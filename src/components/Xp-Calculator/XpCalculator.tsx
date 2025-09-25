import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { FaInfoCircle, FaPercentage, FaTachometerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import {
  ButtonTakeDoubleXp,
  ButtonUseF2,
  ButtonUseF3,
  DisplayDailyDoubleRank,
  DisplayItem,
  DisplayXpBonus,
  DisplayXpNeeded,
  DisplayXpNeededWithBottle,
  InputDailyBonus
} from "@/components/Xp-Calculator/MetierSelectorClient.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import constants from "@/lib/constants.ts";
import { safeJoinPaths } from "@/lib/misc.ts";
import { MetierKey } from "@/types";
import Image from "next/image";

export type searchParamsXpBonusPage = {
  metier: string | undefined,
  level: number | undefined,
  double: boolean | undefined
  dailyBonus: number | undefined
  f2: boolean | undefined
  f3: boolean | undefined
}

export function XpBonus({ params, searchParams }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage
}) {
  const doubleXp = searchParams.double ? 100 : 0;
  const F2 = searchParams.f2 || false;
  const F3 = searchParams.f3 || false;
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
                {searchParams.metier === "miner" &&
                  <>
                    <ButtonUseF2 params={params} searchParams={searchParams} F2={F2}>
                      {F2 ? "Annuler le hammer Fortune 2" : "Utiliser un hammer Fortune 2"}
                    </ButtonUseF2>
                    <ButtonUseF3 params={params} searchParams={searchParams} F3={F3}>
                      {F3 ? "Annuler le hammer Fortune 3" : "Utiliser un hammer Fortune 3"}
                    </ButtonUseF3>
                  </>
                }
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

            <span className="font-semibold">Bonus d&apos;xp total</span>

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
                  Summer Rush: 300%
                  <br/>
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
    </div>);
}

export function HowToXp({ searchParams }: {
  searchParams: searchParamsXpBonusPage
}) {
  if (searchParams.metier === undefined) {
    return null;
  }

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
        <div className={"grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-center"}>
          <div className="flex flex-row items-center gap-4">
            <Image src={safeJoinPaths("/AH_img/glass_bottle.webp")} alt="glass_bottle.webp"
              width={48} height={48}
              unoptimized={true}
              className="object-cover pixelated"/>
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
            searchParams.metier && constants.how_to_xp[searchParams.metier as MetierKey].filter((e) => {
              if (e.level === undefined) {
                return true;
              }
              return (e.level && searchParams && searchParams.level && searchParams.level > e.level);
            }).map((e, index) => {
              return <DisplayItem key={e.imgPath + index} item={e} searchParams={searchParams} index={index}></DisplayItem>;
            })
          }
        </div>
      </CardContent>
    </Card>
  );
}