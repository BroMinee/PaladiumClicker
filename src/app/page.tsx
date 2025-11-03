import { NoPseudoPage } from "@/components/NoPseudoPage.tsx";

/**
 * Generates metadata
 */
export function generateMetadata(): { title: string; description: string; openGraph: { title: string; description: string; }; } {
  const title = "PalaTracker | Accueil";
  const description = "Boostez votre progression et votre clicker sur Paladium comme jamais auparavant !";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

/**
 * [Home page](https://palatracker.bromine.fr)
 */
export default function Home() {
  return (
    <NoPseudoPage texth1={"Améliore ton °clicker°, consulte les °statistiques° et booste ta °progression° sur Paladium."} texth2={"Commence par saisir ton pseudo °Minecraft°"}/>
  );
}
