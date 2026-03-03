import { XPCalculator } from "@/components/xp-calculator/calculator.client";
import { constants } from "@/lib/constants";

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | Calculateur d'xp | Bedrock";
  const description = "Calculez l'xp nécessaire pour atteindre le niveau souhaité sur Paladium Bedrock.";
  const image = `https://palatracker.bromine.fr${constants.imgPathProfile}JobsIcon/Mineur.webp`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image, width: 256, height: 256 }] },
  };
}

/**
 * [Xp-calculator Bedrock Page](https://palatracker.bromine.fr/xp-calculator/bedrock)
 */
export default function XpCalculatorBedrockPage() {
  return <XPCalculator defaultPlatform="bedrock" />;
}
