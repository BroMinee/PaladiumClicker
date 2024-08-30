import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { safeJoinPaths } from "@/lib/misc";
import { FaBolt, FaPercentage } from "react-icons/fa";


import BuildingJson from "@/assets/building.json"
import {
  BuildingInput,
  BuildingLvl,
  BuildingPrice,
  BuildingRPS
} from "@/components/Clicker-Optimizer/BuildingListClient.tsx";

const BuildingList = () => {
  function getImgPath(index: number, price: number) {
    if (price === -1)
      return "/unknown.png";
    else
      return "/BuildingIcon/" + index + ".png";
  }

  return (
    <ScrollArea>
      <div className="flex gap-4 pb-3">
        {BuildingJson.map((building, index) => (
          <Building
            key={building.name + index}
            imgPath={safeJoinPaths(getImgPath(index, building.price ?? 0))}
            index={index}
          />
        ))
        }
      </div>
      <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  );
}

type BuildingProps = {
  imgPath: string;
  index: number;
}

const Building = ({ imgPath, index }: BuildingProps) => {
  return (
    <Card className="min-w-60">
      <CardContent className="pt-6 space-y-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <img src={imgPath} alt="Icône" className="object-cover h-12 w-auto"/>
          <span className="text-primary text-sm text-nowrap">{BuildingJson[index].name}</span>
          <div
            className="text-primary font-bold text-center text-nowrap">
            <BuildingPrice index={index}/>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <FaPercentage className="h-4 w-4 mr-2 inline-block"/>
            <BuildingLvl index={index}/>
          </div>
          <div className="text-sm">
            <FaBolt className="h-4 w-4 mr-2 inline-block"/>
            <BuildingRPS index={index}/>
          </div>
          <BuildingInput index={index}/>
        </div>
      </CardContent>
    </Card>
  );
}

export default BuildingList;
