import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { FaGithub } from "react-icons/fa";
import Contributors from "@/components/Contributors.tsx";
import Discord from "@/components/Discord.tsx";

export async function generateMetadata() {
  const title = `PalaTracker | About`;
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
            Ce site a été entièrement développé par{" "}
            <span className="text-primary">BroMine__</span>
          </p>
        </CardHeader>
        <CardContent>
          <p className="p-2">
            Le site est open-source, plus d&apos;informations sur ce que vous pouvez faire pour
            contribuer à partir du
            code dans le README du git.
          </p>
        </CardContent>

      </Card>
      <Card className="hover:scale-105 duration-300">
        <a
          href="https://github.com/BroMinee/PaladiumClicker"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CardContent className="h-full pt-6 flex items-center gap-4">
            <FaGithub className="w-14 h-14 p-2 rounded-md"/>
            <div className="flex flex-col gap-2">
              <div className="font-bold text-primary">
                Code source
              </div>
            </div>
          </CardContent>
        </a>
      </Card>

      <Discord/>
      <Contributors/>

    </div>
  )
    ;
};
export default AboutPage;