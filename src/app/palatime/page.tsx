import GradientText from "@/components/shared/GradientText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import FallingClickImagePalaTime from "@/components/PalaTime/FallingClickImage.tsx";


export async function generateMetadata() {


  const title = `PalaTracker - Palatime`;
  const description = "📰 Le Palatime est un journal indépendant écrit et publié par 0livierMinecraft le rédacteur en chef et Palatimes le journaliste.\n" +
    "🗓️ Tu y trouveras l'actualité du serveur comme la quête de faction ; des astuces indispensables ; mais surtout un évent communautaire.\n" +
    "🕵️ Que ce soit tirage au sort, énigme, chasse au trésor, loto, etc... Tu vas bien t'amuser.";
  // const defaultImage = "https://palatracker.bromine.fr/AH_img/paper.png";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      // images: [
      //   {
      //     url: defaultImage,
      //     width: 500,
      //     height: 500,
      //   }
      // ]
    },
  }
}

export default function PalatimePage() {
  type Lignes = {
    [K in `ligne${number}`]: string;
  };

  type MonObjet = {
    [K in keyof Lignes]: K extends `ligne${infer N}`
      ? N extends `${number}`
        ? string
        : never
      : never;
  };

  const journal: MonObjet = {
    ligne1: "Le Palatime est de retour :)",
    ligne2: "Message pour ceux qui ralent",
    ligne3: "si j'occupe la mise en avant :",
    ligne4: "laissez-moi vendre du papier",
    ligne5: "à 110k/u si cela me chante, je",
    ligne6: "ne répondrais pas à vos mp.",
    ligne7: "Et ce, même si ça me coûte",
    ligne8: "500 000$ par semaine merci.",
    ligne9: "Qui dit V10 dit objectifs.",
    ligne10: "Pour le journal, son but est",
    ligne11: "d'atteindre l'autofinancement",
    ligne12: "tout en vous régalant encore +",
    ligne13: "Chose assez complexe étant",
    ligne14: "donné le fonctionnement actuel",
    ligne15: "de la mise en avant. 500k$ par",
    ligne16: "numéro ça risque de piquer.",
    ligne17: "C'est pourquoi le tirage au",
    ligne18: "sort de cette semaine va",
    ligne19: "permettre de déterminer si",
    ligne20: "c'est vraiment nécessaire à",
    ligne21: "la visibilité du Palatime.",
    ligne22: "Pour tenter de gagner 39k PB,",
    ligne23: "soit un grade Paladin, envoyez",
    ligne24: "moi dans la mailbox le support",
    ligne25: "par lequel vous lisez ceci.",
    ligne26: "Soit palaclicker de BroMine,",
    ligne27: "soit recherche à l'hdv soit",
    ligne28: "la mise en avant du market.",
    ligne29: "Au fait, ne me parlez plus de",
    ligne30: "Palatimes, ce gredin a pactisé",
    ligne31: "avec l'ennemi du chaos, maître",
    ligne32: "de la lecture inversée hahaha",
  };


  return (
    <>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Bienvenue sur le{" "}
              <GradientText className="font-extrabold">Palatime</GradientText>
            </CardTitle>
            <CardDescription>
              Made with <FaHeart
              className="text-primary inline-block"/> by <GradientText>0livierMinecraft</GradientText>
            </CardDescription>
          </CardHeader>
          <CardContent>
            Le Palatime est un journal indépendant écrit et publié
            par <GradientText>0livierMinecraft</GradientText> le
            rédacteur en chef et <GradientText>Palatimes</GradientText> le journaliste.
            <br/>
            Une fois par semaine tu y trouveras l&apos;actualité du serveur comme la quête de faction ; des astuces
            indispensables ; mais surtout un évent communautaire. Que ce soit tirage au sort, énigme, chasse au
            trésor,
            loto, etc... Tu vas bien t&apos;amuser.
          </CardContent>
        </Card>
        <div className="flex flex-row w-full">
          <div className="flex-grow md:block hidden">
            <FallingClickImagePalaTime/>
          </div>

          <Card className="w-fit">
            <CardContent className="mt-4">
              {
                Object.entries(journal).map(([key, value]) => (
                  <p key={key} className="flex justify-around">
                    {value}
                  </p>
                ))
              }
            </CardContent>
          </Card>
          <div className="flex-grow">
            <FallingClickImagePalaTime/>
          </div>
        </div>
      </div>
    </>
  )
}