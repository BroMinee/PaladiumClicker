import { PaladiumEmblem } from "@/types";
import Image from "next/image";

export function Emblem({emblem, className}: {emblem: PaladiumEmblem, className?: string}) {

  if (emblem.forcedTexture !== undefined) {
    return <Image src={`/img/faction/defaults/${emblem.forcedTexture}.png`} alt={"faction icon"}
      width={0} height={0} unoptimized={true}
      className={className}/>;
  }

  return <Image src={`/blog/faction/${emblem.backgroundColor}/${emblem.backgroundId}/${emblem.backgroundColor}/${emblem.foregroundColor}/${emblem.foregroundId}/${emblem.iconBorderColor}/${emblem.iconColor}/${emblem.iconId}/opengraph-image`} alt={"faction icon"}
    width={0} height={0} unoptimized={true}
    className={className}/>;
}