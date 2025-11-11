import { NoPseudoPage } from "@/components/NoPseudoPage";

/**
 * Gemerate Metadata
 */
export function generateMetadata() {
  return {
    title: "PalaTracker | Clicker Optimizer",
    description: "🚀 Tu cherches à optimiser le PalaClicker ? C'est ici que ça se passe ! 📈 Calcule le meilleur achat en fonction de tes métiers et ton avancement sur Paladium.",
    openGraph: {
      title: "PalaTracker | Clicker Optimizer",
      description: "🚀 Tu cherches à optimiser le PalaClicker ? C'est ici que ça se passe ! 📈 Calcule le meilleur achat en fonction de tes métiers et ton avancement sur Paladium."
    },
  };
}

/**
 * [Clicker page](https://palatracker.bromine.fr/clicker-optimizer)
 */
export default function HomeProfilWithoutUsername() {
  return <NoPseudoPage texth1="Optimise ton °PalaClicker° pour gagner un maximum de °ClicCoins° et battre tes amis" texth2="Commence par saisir ton pseudo °Minecraft°"/>;
}