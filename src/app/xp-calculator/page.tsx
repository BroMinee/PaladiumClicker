import { NoPseudoPage } from "@/components/NoPseudoPage.tsx";

export async function generateMetadata() {


  const title = `Paladium Tracker - Calculateur d'xp de métier`;
  const description = `Renseignez votre pseudo Paladium et le métier que vous souhaitez xp pour obtenir des quantités à farmer pour atteindre le niveau souhaité.`;
  // const defaultImage = "https://brominee.github.io/PaladiumClicker/favicon.ico";
  let imgPath = "Mineur";
  let image = `https://palatracker.bromine.fr/JobsIcon/${imgPath}.webp`;
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
  }

}

export default function HomeProfilWithoutUsername() {
  return <NoPseudoPage noBoldText="sur le calculateur" boldText="d'xp de métier"/>
}
