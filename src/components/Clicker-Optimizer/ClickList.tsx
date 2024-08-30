import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatPrice, safeJoinPaths } from "@/lib/misc";

import CPSJson from "@/assets/CPS.json"
import { ButtonCPS, PreconditionDisplay } from "@/components/Clicker-Optimizer/ClickListClient.tsx";

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
      <div className="flex gap-4 pb-3">
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

  return (
    <ButtonCPS index={index}>
      <div className="flex flex-col items-center justify-center">
        <img src={imgPath} alt="Icône" className="h-12 w-auto object-cover"/>
        <div>{CPSJson[index].name}</div>
        <div className="font-bold">
          {formatPrice(CPSJson[index].price)} $
        </div>
        <PreconditionDisplay index={index}/>
      </div>

    </ButtonCPS>
  );
}

export default ClickList;
