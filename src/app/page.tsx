import { NoPseudoPage } from "@/components/NoPseudoPage.tsx";

export function generateMetadata()
{
  const title = `Paladium Tracker`;
  const description = `Paladium Tracker : boostez votre progression et votre clicker sur Paladium comme jamais auparavant !"`;
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  }
}
export default function Home() {
  return (<NoPseudoPage noBoldText="sur " boldText="PalaTracker"/>
  );
}
