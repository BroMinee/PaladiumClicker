import { NoPseudoPage } from "@/components/NoPseudoPage.tsx";
import { safeJoinPaths } from "@/lib/misc.ts";
import { constants } from "@/lib/constants.ts";

export async function generateMetadata() {

  const title = "PalaTracker | Calculateur d'xp";
  const description = "Renseignez votre pseudo Paladium et le métier que vous souhaitez xp pour obtenir des quantités à farmer pour atteindre le niveau souhaité.";
  // const defaultImage = "https://brominee.github.io/PaladiumClicker/favicon.ico";
  const imgPath = "Mineur";
  const image = safeJoinPaths("https://palatracker.bromine.fr/",constants.imgPathProfile, "/JobsIcon/", imgPath,".webp");
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: image,
          width: 256,
          height: 256,
        }
      ]
    },
  };

}

export default function HomeProfilWithoutUsername() {
  return <NoPseudoPage texth1="Calcule l'xp nécessaire pour °level up° tes métiers" texth2="Commence par saisir ton pseudo °Minecraft°"/>;
}
