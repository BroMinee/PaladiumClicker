import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatPrice, getJsonToUseForUpgrade } from "@/lib/misc";
import type { UpgradeKey } from "@/types";

import { redirect } from "next/navigation";
import { ButtonUpgrade, PreconditionDisplay } from "@/components/Clicker-Optimizer/UpgradeListClient.tsx";

type UpgradeListProps = {
  upgradeType: UpgradeKey;
}

const UpgradeList = ({ upgradeType }: UpgradeListProps) => {
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

  let jsonToUse = getJsonToUseForUpgrade(upgradeType);
  if (!jsonToUse)
    redirect("/error?message=UpgradeType%20not%20found");

  return (
    <ScrollArea>
      <div className="flex gap-4 pb-3">
        {jsonToUse.map((upgrade, index) => (
          <Upgrade
            key={`${upgrade.name}-${index}`}
            upgradeType={upgradeType}
            jsonToUse={jsonToUse}
            index={index}
            imgPath={getImgPath(index, upgrade.name)}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  );
}

interface UpgradeProps {
  upgradeType: UpgradeKey;
  index: number;
  imgPath: string;
  jsonToUse: any;
}

function Upgrade({ upgradeType, index, imgPath, jsonToUse }: UpgradeProps) {
  // NOTE price here can be server side since it's not variable for all upgrades

  return (
    <ButtonUpgrade upgradeType={upgradeType} index={index}>
      <div className="w-36 flex flex-col items-center justify-center gap-2">
        <img src={imgPath} alt="Icône" className="h-12 w-auto object-cover"/>
        <span className="text-wrap">{jsonToUse[index].name}</span>
        <div className="font-bold">
          {formatPrice(jsonToUse[index].price ?? -1)} $
        </div>
        <PreconditionDisplay index={index} upgradeType={upgradeType}/>
      </div>
    </ButtonUpgrade>
  );
}


export default UpgradeList;
