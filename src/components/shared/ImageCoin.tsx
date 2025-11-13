import { safeJoinPaths } from "@/lib/misc";
import Image from "next/image";

/**
 * A pixelated coin image component of 24x24 size.
 */
export const ImageCoin = () => {
  return (
    <Image width={24} height={24} src={safeJoinPaths("/coin.png")} alt="Coin pixelated" className='h-6 max-h-6 max-w-6 w-6' unoptimized/>
  );
};