import { PaladiumEmblem } from "@/types";
import { ImageLoading } from "@/components/ui/image-loading";

/**
 * Display the faction emblem using for following URL : https://palatracker.bromine.fr/blog/faction/.../opengraph-image
 * In case the emblem any texture use it instead of the given emblem. (Wilderness, Warzone case)
 */
export function Emblem({ emblem, className }: { emblem: PaladiumEmblem, className?: string }) {
  if (emblem.forcedTexture !== undefined) {
    return <ImageLoading src={`/img/Faction/defaults/${emblem.forcedTexture}.png`} alt={"faction icon"}
      width={0} height={0} unoptimized={true}
      className={className} blurDataURL="/img/Faction/defaults/wilderness.png" />;
  }

  return (
    <ImageLoading src={`/blog/faction/${emblem.backgroundColor}/${emblem.backgroundId}/${emblem.backgroundColor}/${emblem.foregroundColor}/${emblem.foregroundId}/${emblem.iconBorderColor}/${emblem.iconColor}/${emblem.iconId}/opengraph-image`} alt={"faction icon"}
      width={0} height={0} unoptimized={true}
      className={className} blurDataURL="/img/Faction/defaults/wilderness.png" />
  );
}