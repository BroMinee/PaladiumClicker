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
    ligne1: "Palatimes, tu as vraiment cru",
    ligne2: "que tes sbires allaient me",
    ligne3: "faire changer d'avis ? Jamais",
    ligne4: "je ne quitterai le chaos !!!!!",
    ligne5: "Cependant je dois admettre que",
    ligne6: "les arguments d'EDESSE1 et de",
    ligne7: "LeVraiFuze étaient plus que",
    ligne8: "convainquant. C'est pourquoi,",
    ligne9: "malgré ta traitrise, je te",
    ligne10: "propose la garde alternée du",
    ligne11: "journal : une fois sur 2 tu",
    ligne12: "publieras le Palatime dans",
    ligne13: "l'ordre et le reste du temps",
    ligne14: "je posterai l'Emitalap à",
    ligne15: "l'envers. Avis aux lecteurs,",
    ligne16: "après réflexion il n'y aura",
    ligne17: "plus usage de la mise en avant",
    ligne18: "du market pour des raisons de",
    ligne19: "budget (1M/semaine= ça pique).",
    ligne20: "Il faudra donc chercher le mot",
    ligne21: "\"lire\" dans le ah pour retrouver",
    ligne22: "votre lecture favorite. Ou",
    ligne23: "passer par le site de BroMine",
    ligne24: "pour une lecture plus fluide.",
    ligne25: "Une dernière chose Palatimes,",
    ligne26: "sache que je déteste qu'on me",
    ligne27: "mette des bâtons dans les",
    ligne28: "roues. Pour avoir dévoilé mes",
    ligne29: "plans, voici les coordonnées",
    ligne30: "de ta base sur egopolis :",
    ligne31: "x=-10 000 et y= 10 000 environ",
    ligne32: "vu que ta base fait 64 chunks.",
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