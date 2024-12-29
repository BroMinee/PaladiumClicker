import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import Contributors from "@/components/Contributors.tsx";
import Discord from "@/components/Discord.tsx";

export async function generateMetadata() {
  const title = "PalaTracker | A propos";
  const description = "Le site qui te permet de suivre ton profil Paladium, d'optimiser ton PalaClicker, de suivre les historiques de vente de l'AH et bien plus encore !";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  }
}

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-4 ">
      <Card className="flex flex-col gap-4 font-bold center">
        <CardHeader className="flex flex-row">
          <p>
            Ce site a été développé principalement par{" "}
            <a
              href="https://github.com/BroMinee"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-orange-700 transition-colors duration-300"
            >
              BroMine__
            </a>.
          </p>
        </CardHeader>
        <CardContent>
          <p className="p-2">
            Le site était open source avant l&apos;introduction des clés d&apos;API nécessaires pour récupérer les informations de
            Paladium. L&apos;ancien repository est disponible à <a
            href="https://github.com/BroMinee/PaladiumClicker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
            cette
            addresse
          </a>.
            Si vous souhaitez contribuer au projet, vous trouverez davantage d&apos;informations <a
            href="https://github.com/BroMineCorp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
            ici
          </a> ou sur le discord ci-dessous.

          </p>
        </CardContent>

      </Card>

      <Discord/>
      <Contributors/>

    </div>
  )
    ;
};
export default AboutPage;