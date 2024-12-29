import GradientText from "@/components/shared/GradientText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import FallingClickImagePalaTime from "@/components/PalaTime/FallingClickImage.tsx";


export async function generateMetadata() {


  const title = `PalaTracker | Palatime`;
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
    ligne1: "L'équipe de l'Emitalap vous",
    ligne2: "souhaite une bonne année 5202.",
    ligne3: "Que le chaos règne en maître",
    ligne4: "sur le royaume de Paladium et",
    ligne5: "puisse l'ordre admettre sa",
    ligne6: "flagrante infériorité actuelle",
    ligne7: "En effet, d'après nos espions,",
    ligne8: "seule 1 personne aurait réussi",
    ligne9: "le défi du dernier Palatime",
    ligne10: "visant à trouver des soldats :",
    ligne11: "GG VitalFlow pour ton exploit",
    ligne12: "d'avoir fini le jump du lobby.",
    ligne13: "En cette nouvelle année, bcp",
    ligne14: "de bonnes résolutions. On va",
    ligne15: "aller au bout des choses et",
    ligne16: "finir ce que l'on a commencé.",
    ligne17: "Comme un concours de blague",
    ligne18: "qui n'a jamais été terminé.",
    ligne19: "Dans cette V2 de l'évent, en-",
    ligne20: "voie ta meilleure vanne COURTE",
    ligne21: "sur le thème de PALADIUM dans",
    ligne22: "la mailbox de 0livierMinecraft",
    ligne23: "pour tenter de gagner un prix.",
    ligne24: "Environ 100-150 caractères max",
    ligne25: "Les mots en gras sont aussi",
    ligne26: "IMPORTANT que le RÈGLEMENT IG.",
    ligne27: "non respect = disqualification",
    ligne28: "Une sélection sera faite par",
    ligne29: "0Mc pour garder 4 propositions",
    ligne30: "Pareil que la V1 le jury sera",
    ligne31: "communautaire mais vous en",
    ligne32: "saurez plus dans 2 semaines.",
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