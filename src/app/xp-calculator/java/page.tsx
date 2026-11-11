import { XPCalculator } from "@/components/xp-calculator/calculator.client";
import { constants } from "@/lib/constants";

/**
 * Generate Metadata
 */
export function generateMetadata() {
  const title = "PalaTracker | Calculateur d'xp Java";
  const description = "Renseignez votre pseudo Paladium et le métier que vous souhaitez xp pour obtenir des quantités à farmer pour atteindre le niveau souhaité.";
  const image = `https://palatracker.bromine.fr${constants.imgPathProfile}JobsIcon/Mineur.webp`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 256, height: 256 }],
    },
  };
}

/**
 * XP Calculator Java page.
 */
export default function XpCalculatorPage() {
  return <XPCalculator />;
}