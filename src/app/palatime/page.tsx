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
    ligne1: "Après décodage, le message d'",
    ligne2: "ARTY du lobby est le suivant :",
    ligne3: "'J'ai découvert un trou noir",
    ligne4: "près du nexus du chaos.'",
    ligne5: "Ce trou noir, qui au début",
    ligne6: "semblait inoffensif, affichait",
    ligne7: "un timer de 7 jours durant",
    ligne8: "lesquels il droppait du stuff.",
    ligne9: "Au bout de ce délai, l'énergie",
    ligne10: "qu'il a accumulée téléporte les",
    ligne11: "joueurs alentours dans le",
    ligne12: "musée des 10 ans de Paladium.",
    ligne13: "On y retrouve les éléments",
    ligne14: "majeurs de chaque version",
    ligne15: "ainsi qu'un vote pour choisir",
    ligne16: "la prochaine feature ajoutée.",
    ligne17: "Mais le trou noir a commencé",
    ligne18: "à menacer l'équilibre du serv,",
    ligne19: "grossissant à vue d'œil,",
    ligne20: "emportant tout sur son chemin.",
    ligne21: "Heureusement, une poignée de",
    ligne22: "valeureux joueurs ont freiné",
    ligne23: "sa croissance lors d'un event",
    ligne24: "dans la dernière vidéo de Fuze.",
    ligne25: "Ce dernier donne les résultats",
    ligne26: "du vote : c'est la dimension",
    ligne27: "mineur 2.0 qui est en tête",
    ligne28: "avec 57% des voix (984 votes).",
    ligne29: "La semaine prochaine, ce sera",
    ligne30: "le retour du Palatime tel que",
    ligne31: "vous le connaissez : ses",
    ligne32: "histoires ainsi que son GW."
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
        <div className="flex flex-row w-full justify-center">
          <div className="flex-grow md:block hidden fallingPapers">
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
          <div className="flex-grow md:block hidden fallingPapers">
            <FallingClickImagePalaTime/>
          </div>
        </div>
      </div>

    </>
  )
}