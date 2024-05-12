import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { checkCondition, formatPrice } from "@/lib/misc";
import { cn } from "@/lib/utils";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import type { PlayerInfo, UpgradeKey } from "@/types";
import { FaInfoCircle } from "react-icons/fa";

type UpgradeListProps = {
  upgradeType: UpgradeKey;
}

const UpgradeList = ({ upgradeType }: UpgradeListProps) => {
  const { data: playerInfo } = usePlayerInfoStore();

  function getImgPath(index: number, name: string) {
    const majUpgradeName = upgradeType[0].toUpperCase() + upgradeType.slice(1)
    const nameShort = majUpgradeName.split("_")[0];
    const upgradeWithOnlyOne = ["Many", "Posterior"];

    if (Number(name) === -1)
      return "/unknown.png";
    else if (nameShort === "Building")
      return `/BuildingUpgradeIcon/${index <= 15 ? 0 : 1}.png`;
    else if (upgradeWithOnlyOne.includes(nameShort))
      return `/${nameShort}Icon/0.png`;
    else
      return `/${nameShort}Icon/${index}.png`;
  }

  return (
    <ScrollArea>
      <div className="flex gap-4 pb-3">
        {playerInfo?.[upgradeType] &&
          playerInfo[upgradeType].map((upgrade, index) => (
            <Upgrade
              key={`${upgrade.name}-${index}`}
              upgradeType={upgradeType}
              upgrade={upgrade}
              imgPath={getImgPath(index, upgrade.name)}
            />
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

interface UpgradeProps<T extends UpgradeKey> {
  upgradeType: T;
  upgrade: PlayerInfo[T][number];
  imgPath: string;
}

function Upgrade<T extends UpgradeKey>({ upgradeType, upgrade, imgPath }: UpgradeProps<T>) {
  const { data: playerInfo, toggleUpgradeOwn } = usePlayerInfoStore();

  const [
    unlockable,
    coinsCondition,
    totalCoins,
    dayCondition,
    daySinceStart,
    buildingIndex,
    buildingNeed,
    buildingCount
  ] = checkCondition(playerInfo!, upgrade.condition);

  const texts = [];
  if (unlockable === false) {
    texts.push("Précondition non remplie :");
    if (dayCondition !== -1 && daySinceStart < dayCondition)
      texts.push(`${formatPrice(dayCondition)} days`);
    if (coinsCondition !== -1 && totalCoins < coinsCondition)
      texts.push(`${formatPrice(coinsCondition)} coins`);
    if (buildingIndex !== -1 && buildingCount < buildingNeed)
      texts.push(`${buildingNeed - buildingCount} ${playerInfo?.["building"][buildingIndex]["name"]} manquant`);
    if (texts.length !== 2)
      texts[0] = "Préconditions non remplies :";
  }

  if (!unlockable) {
    return (
      <Card>
        <CardContent className="p-4 w-36">
          <div className="flex flex-col items-center justify-center">
            <img src={imgPath} alt="Icône" className="h-12 w-auto object-cover" />
            <div>{upgrade.name}</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <FaInfoCircle className="inline-block h-4 w-4" />
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
        "p-4 h-auto",
        upgrade.own && "bg-primary text-primary-foreground",
        !upgrade.own && "bg-yellow-500 text-primary-foreground",
      )}
      onClick={() => toggleUpgradeOwn(upgradeType, upgrade.name)}
    >
      <div className="w-36 flex flex-col items-center justify-center gap-2">
        <img src={imgPath} alt="Icône" className="h-12 w-auto object-cover" />
        <span className="text-wrap">{upgrade.name}</span>
        <div className="font-bold">
          {formatPrice(upgrade.price ?? -1)} $
        </div>
      </div>
    </Button>
  );
}


export default UpgradeList;
