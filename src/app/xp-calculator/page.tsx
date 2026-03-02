import { safeJoinPaths } from "@/lib/misc";
import { constants } from "@/lib/constants";
import { XpCalculatorLanding } from "@/components/xp-calculator/xp-calculator-landing.client";

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | Calculateur d'xp";
  const description = "Renseignez votre pseudo Paladium et le métier que vous souhaitez xp pour obtenir des quantités à farmer pour atteindre le niveau souhaité.";
  const image = safeJoinPaths("https://palatracker.bromine.fr/", constants.imgPathProfile, "/JobsIcon/Mineur.webp");
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image, width: 256, height: 256 }] },
  };
}

/**
 * [Xp-calculator Page](https://palatracker.bromine.fr/xp-calculator)
 */
export default function XpCalculatorEntryPage() {
  return <XpCalculatorLanding />;
}
