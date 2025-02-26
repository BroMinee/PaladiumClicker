import { NoPseudoPage } from "@/components/NoPseudoPage.tsx";

export function generateMetadata() {
  return {
    title: "PalaTracker | Profil",
    description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝",
    openGraph: {
      title: "PalaTracker | Profil",
      description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝"
    },
  }
}

export default function HomeProfilWithoutUsername() {
  return <NoPseudoPage texth1="Consulte tes °métiers°, ton °market°, tes °succès° et surtout ton °évolution°" texth2="Commence par saisir ton pseudo °Minecraft°"/>
}
