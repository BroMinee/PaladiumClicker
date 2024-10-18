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
    ligne1: "A l'aide, zérolivier est",
    ligne2: "devenu fou. Après la victoire",
    ligne3: "contre la corruption, il s'est",
    ligne4: "mis à fréquenter Heimdall.",
    ligne5: "Et, en quête de pouvoir, s'est ",
    ligne6: "approprié le journal du market.",
    ligne7: "Pour semer le chaos, il a même",
    ligne8: "inversé son sens de lecture.",
    ligne9: "C'est pourquoi j'ai besoin",
    ligne10: "d'aide pour le raisonner et le",
    ligne11: "ramener dans le droit chemin.",
    ligne12: "Celui ou celle qui réussira à",
    ligne13: "le convaincre de quitter le",
    ligne14: "chaos pour rejoindre l'ordre",
    ligne15: "recevra 15 000 000 d'xp farmeur,",
    ligne16: "de quoi passer niveau 80.",
    ligne17: "Le seul moyen de le contacter",
    ligne18: "que je connaisse est la mailbox.",
    ligne19: "Soyez convainquant car lui et",
    ligne20: "ses amis seront impitoyables.",
    ligne21: "J'ai dû l'espionner pour",
    ligne22: "connaître le gagnant du tirage",
    ligne23: "au sort des 40k PBs, soit un",
    ligne24: "grade Paladin. C'est donc ",
    ligne25: "_Kushimi_ qui a été choisi.",
    ligne26: "Cependant, lors de mon",
    ligne27: "espionnage j'ai découvert",
    ligne28: "qu'il comptait capturer Fuze.",
    ligne29: "Ca serait d'ailleurs pour ça",
    ligne30: "qu'il lui aurait donné 1M de $.",
    ligne31: "Mais je n'ai pas pu en savoir",
    ligne32: "plus car il m'a vu l'observer.",
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