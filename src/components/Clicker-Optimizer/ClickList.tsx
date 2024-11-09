import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatPrice, safeJoinPaths } from "@/lib/misc";

import CPSJson from "@/assets/CPS.json"
import { ButtonCPS } from "@/components/Clicker-Optimizer/ClickListClient.tsx";
import Image from "next/image";
import HoverText from "@/components/ui/hovertext.tsx";
import { ReactNode } from "react";
import { PreconditionDisplay } from "@/lib/PreconditionDisplay.tsx";

const ClickList = () => {
  function getImgPath(index: number, price: string) {
    if (Number(price) === -1)
      return "/unknown.png";
    else if (index === 24)
      return "/CPSIcon/" + index + ".webp";
    else
      return "/CPSIcon/" + index + ".png";
  }

  return (
    <ScrollArea>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-2">
        {CPSJson.map((cps, index) => (
          <CPS key={cps.name + index} imgPath={safeJoinPaths(getImgPath(index, cps.name))} index={index}/>
        ))}
      </div>
      <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  )
}

type CPSProps = {
  index: number;
  imgPath: string;
}


const CPS = ({ index, imgPath }: CPSProps) => {
  // NOTE price here can be server side since it's not variable

  const hoverElement: ReactNode = (
    <div className="flex flex-col items-center justify-center border-black border-2 rounded-xl p-2 bg-secondary">
      <div>{CPSJson[index].name}</div>
      <div className="font-bold">
        {formatPrice(CPSJson[index].price)} $
      </div>
      <div>
        {formatPrice(CPSJson[index].CPS)} / clic
      </div>
      <PreconditionDisplay index={index} upgradeType="CPS"/>
    </div>
  );

  return (
    <HoverText text={hoverElement}>
      <ButtonCPS index={index}>
        <Image width={48} height={48} src={imgPath} alt="Icône" className="object-cover pixelated" unoptimized/>
      </ButtonCPS>
    </HoverText>

  );
}

export default ClickList;
