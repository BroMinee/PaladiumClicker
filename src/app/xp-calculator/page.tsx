import { NoPseudoPage } from "@/components/home/no-pseudo-page.server";
import { XpHomePageWrapper } from "@/components/xp-calculator/xp-calculator-landing.client";
import { constants } from "@/lib/constants";

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | Calculateur d'xp";
  const description = "Renseignez votre pseudo Paladium et le métier que vous souhaitez xp pour obtenir des quantités à farmer pour atteindre le niveau souhaité.";
  const image = `https://palatracker.bromine.fr${constants.imgPathProfile}JobsIcon/Mineur.webp`;
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
  return <NoPseudoPage texth1="Calcule l'xp nécessaire pour °level up° tes métiers" texth2="Commence par saisir ton pseudo °Minecraft°" inputWrapper={XpHomePageWrapper}/>;
}
