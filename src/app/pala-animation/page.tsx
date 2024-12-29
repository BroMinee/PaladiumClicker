import { NoPseudoPage } from "@/components/NoPseudoPage.tsx";

export function generateMetadata() {
  return {
    title: "PalaTracker | Pala Animation Trainer",
    description: "Viens t'entraîner sur PalaAnimation et compare ton temps avec les autres joueurs ! 🚀",
    openGraph: {
      title: "PalaTracker | Pala Animation Trainer",
      description: "Viens t'entraîner sur PalaAnimation et compare ton temps avec les autres joueurs ! 🚀"
    },
  }
}

export default function HomeProfilWithoutUsername() {
  return <NoPseudoPage noBoldText="la zone d'entraînement du" boldText="PalaAnimation"/>
}

