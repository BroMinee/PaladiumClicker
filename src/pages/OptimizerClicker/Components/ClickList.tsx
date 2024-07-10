// @ts-nocheck - A RETIRER APRES AVOIR CORRIGE LE FICHIER

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { checkCondition, formatPrice } from "@/lib/misc";
import { cn } from "@/lib/utils";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import type { CPS as TCPS } from "@/types";
import { FaInfoCircle } from "react-icons/fa";

const ClickList = () => {

  const { data: playerInfo } = usePlayerInfoStore();

  function getImgPath(index: number, price: string) {
    if (Number(price) === -1)
      return "/unknown.png";
    else
      return "/CPSIcon/" + index + ".png";
  }

  return (
    <ScrollArea>
      <div className="flex gap-4 pb-3">
        {playerInfo?.CPS &&
          playerInfo["CPS"]
            .map((cps, index) => (
              <CPS key={index} cps={cps}
                   imgPath={import.meta.env.BASE_URL + getImgPath(index, cps.name)}/>
            ))}
      </div>
      <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  )
}

type CPSProps = {
  cps: TCPS;
  imgPath: string;
}


const CPS = ({ cps, imgPath }: CPSProps) => {

  const { data: playerInfo, selectCPS } = usePlayerInfoStore();

  const [
    unlockable,
    coinsCondition,
    totalCoins,
    dayCondition,
    daySinceStart,
    buildingIndex,
    buildingNeed,
    buildingCount
  ] = checkCondition(playerInfo!, cps.condition);

  const texts = ["Précondition non remplie :"];
  if (Number(cps.name) === -1)
    texts[0] = "Précondition non remplie (spéculation):";
  let isUnlockable = unlockable;
  for (let i = 1; i < (playerInfo?.CPS.findIndex((c) => c.name === cps.name) ?? 1); i++) {
    if (playerInfo?.["CPS"][i]["own"] === false) {
      texts.push(`Achetez ${playerInfo?.["CPS"].at(-1)?.["name"]}`)
      isUnlockable = false;
      break;
    }
  }
  if (isUnlockable === false) {
    if (dayCondition !== -1 && daySinceStart < dayCondition)
      texts.push(`Début de saison depuis ${formatPrice(dayCondition)} jours. Actuellement : ${formatPrice(daySinceStart.toFixed(0))} jours`);
    if (coinsCondition !== -1 && totalCoins < coinsCondition)
      texts.push(`Collecter ${formatPrice(coinsCondition)} coins`);
    if (buildingIndex !== -1 && buildingCount < buildingNeed)
      texts.push(`${buildingNeed - buildingCount} ${playerInfo?.["building"][buildingIndex]["name"]} manquant`);
  }
  if (texts.length !== 2)
    texts[0] = "Préconditions non remplies :";

  if (!unlockable) {
    return (
      <Card>
        <CardContent className="p-4 w-36">
          <div className="flex flex-col items-center justify-center">
            <img src={imgPath} alt="Icône" className="h-12 w-auto object-cover"/>
            <div>{cps.name}</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <FaInfoCircle className="inline-block h-4 w-4"/>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                {texts.map((text, index) => (
                  <p key={index} className="text-sm text-destructive">{text}</p>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      variant="card"
      className={cn(
        "p-4 h-auto w-36",
        cps.own && "bg-primary text-primary-foreground",
        !cps.own && "bg-yellow-500 text-primary-foreground",
        cps.own && "hover:bg-primary-darker",
        !cps.own && "hover:bg-yellow-600",
      )}
      onClick={() => selectCPS(cps.name)}
    >
      <div className="flex flex-col items-center justify-center">
        <img src={imgPath} alt="Icône" className="h-12 w-auto object-cover"/>
        <div>{cps.name}</div>
        <div className="font-bold">
          {formatPrice(cps.price ?? 0)} $
        </div>
      </div>
    </Button>
  );
}

export default ClickList;
