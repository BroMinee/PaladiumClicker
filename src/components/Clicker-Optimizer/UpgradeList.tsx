// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatPrice, getJsonToUseForUpgrade, safeJoinPaths } from "@/lib/misc";
import type { UpgradeKey } from "@/types";

import { redirect } from "next/navigation";
import { ButtonUpgrade } from "@/components/Clicker-Optimizer/UpgradeListClient.tsx";
import Image from "next/image";
import { ReactNode } from "react";
import HoverText from "@/components/ui/hovertext.tsx";
import { PreconditionDisplay } from "@/lib/PreconditionDisplay.tsx";
import { constants } from "@/lib/constants.ts";

type UpgradeListProps = {
  upgradeType: UpgradeKey;
}

const UpgradeList = ({ upgradeType }: UpgradeListProps) => {
  function getImgPath(index: number, name: string) {
    const majUpgradeName = upgradeType[0].toUpperCase() + upgradeType.slice(1);
    const nameShort = majUpgradeName.split("_")[0];
    const upgradeWithOnlyOne = ["Many", "Posterior"];

    if (Number(name) === -1) {
      return "/unknown.png";
    } else if (nameShort === "Building") {
      return safeJoinPaths(constants.imgPathClicker,`/BuildingUpgradeIcon/${index <= 15 ? 0 : 1}.png`);
    } else if (upgradeWithOnlyOne.includes(nameShort)) {
      return safeJoinPaths(constants.imgPathClicker,`/${nameShort}Icon/0.png`);
    } else {
      return safeJoinPaths(constants.imgPathClicker,`/${nameShort}Icon/${index}.png`);
    }
  }

  const jsonToUse = getJsonToUseForUpgrade(upgradeType);
  if (!jsonToUse) {
    redirect("/error?message=UpgradeType%20not%20found");
  }

  return (
    // <ScrollArea>
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-16 gap-2">
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
    //   <ScrollBar orientation="horizontal"/>
    // </ScrollArea>
  );
};

interface UpgradeProps {
  upgradeType: UpgradeKey;
  index: number;
  imgPath: string;
  jsonToUse: any;
}

function Upgrade({ upgradeType, index, imgPath, jsonToUse }: UpgradeProps) {
  // NOTE price here can be server side since it's not variable for all upgrades

  const hoverElement: ReactNode = (
    <div className="flex flex-col items-center justify-center border-black border-2 rounded-xl p-2 bg-secondary">
      <span className="text-wrap">{jsonToUse[index].name}</span>
      <div className="font-bold">
        {formatPrice(jsonToUse[index].price ?? -1)} $
      </div>
      <PreconditionDisplay index={index} upgradeType={upgradeType}/>
    </div>
  );

  return (
    <HoverText text={hoverElement}>
      <ButtonUpgrade upgradeType={upgradeType} index={index}>
        <Image src={imgPath} width={48} height={48} alt="Icône" className="object-cover pixelated" unoptimized/>
      </ButtonUpgrade>
    </HoverText>
  );
}

export default UpgradeList;
