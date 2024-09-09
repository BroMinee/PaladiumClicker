import { NoPseudoPage } from "@/components/NoPseudoPage.tsx";

export function generateMetadata() {
  return {
    title: "PalaTracker - Profil",
    description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝",
    openGraph: {
      title: "PalaTracker - Profil",
      description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝"
    },
  }
}

export default function HomeProfilWithoutUsername() {
  return <NoPseudoPage noBoldText="sur le" boldText="PalaTracker"/>
}
