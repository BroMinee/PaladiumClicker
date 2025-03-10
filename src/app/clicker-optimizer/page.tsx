import { NoPseudoPage } from "@/components/NoPseudoPage.tsx";

export function generateMetadata() {
  return {
    title: "PalaTracker | Clicker Optimizer",
    description: "🚀 Tu cherches à optimiser le PalaClicker ? C'est ici que ça se passe !! 📈 Ce site calcule le meilleur achat en fonction de tes métiers, tes améliorations et tes bâtiments.",
    openGraph: {
      title: "PalaTracker | Clicker Optimizer",
      description: "🚀 Tu cherches à optimiser le PalaClicker ? C'est ici que ça se passe !! 📈 Ce site calcule le meilleur achat en fonction de tes métiers, tes améliorations et tes bâtiments."
    },
  }
}

export default function HomeProfilWithoutUsername() {
  return <NoPseudoPage texth1="Optimise ton °PalaClicker° pour gagner un maximum de °ClicCoins° et battre tes amis" texth2="Commence par saisir ton pseudo °Minecraft°"/>
}