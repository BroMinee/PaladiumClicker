import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { safeJoinPaths } from "@/lib/misc";


import BuildingJson from "@/assets/building.json"
import { BuildingInput, BuildingPrice, BuildingRPS } from "@/components/Clicker-Optimizer/BuildingListClient.tsx";
import Image from "next/image";
import React from "react";
import constants from "@/lib/constants.ts";
const BuildingList = () => {
  function getImgPath(index: number, price: number) {
    if (price === -1)
      return "/unknown.png";
    else
      return safeJoinPaths(constants.imgPathClicker,"/BuildingIcon/" + index + ".png");
  }

  return (
    <ScrollArea>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-2 pr-3">
        {BuildingJson.map((building, index) => (
          <Building
            key={building.name + index}
            imgPath={getImgPath(index, Number(building.price) ?? -1)}
            index={index}
          />
        ))
        }
      </div>
      <ScrollBar orientation="vertical"/>
    </ScrollArea>
  );
}

type BuildingProps = {
  imgPath: string;
  index: number;
}

const Building = ({ imgPath, index }: BuildingProps) => {
  return (
    <Card
      className="flex flex-col pt-4 pb-2 h-auto w-auto text-sm items-center gap-4 justify-start">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row flex-wrap items-center gap-4 mb-2">
          <Image width={48} height={48} src={imgPath} alt="Icône" className="object-cover pixelated" unoptimized/>
          <BuildingInput index={index}/>
        </div>

        <span className="text-primary text-center break-words mx-2">{BuildingJson[index].name}</span>
        <BuildingPrice index={index}/>
      </div>

      <div className="space-y-2">
        <div className="flex flex-row items-center gap-1" id={`building-rps-${index}`}>
          <BuildingRPS index={index}/>
          <Image src={safeJoinPaths("/coin.png")} height={16} width={16} alt="Coin"/>
          <span>/s</span>
        </div>
      </div>
    </Card>
  );
}

export default BuildingList;
