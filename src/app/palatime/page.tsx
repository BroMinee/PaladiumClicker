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
    ligne1: "Flemme de mettre ça en ordre ?",
    ligne2: "Lis ton Palatime bien aimé",
    ligne3: "sur le PalaClicker Optimizer.",
    ligne4: "En plus, il y a les accents :)",
    ligne5: "Ainsi qu'un easter egg bien",
    ligne6: "caché qui a quand même été vu",
    ligne7: "par 20 personnes. Chacun gagne",
    ligne8: "donc 1 000 000/20 = 50 000$.",
    ligne9: "Malheureusement il est trop",
    ligne10: "tard pour recevoir une telle",
    ligne11: "somme. Mais pour vous consoler",
    ligne12: "vous trouverez de l'endium",
    ligne13: "en résolvant l'équation x=z.",
    ligne14: "Indice : c'est des coordonnées",
    ligne15: "Le x est donc égal au z. Et le",
    ligne16: "serveur ? Tu peux tjrs courir.",
    ligne17: "Ainsi, si votre base est",
    ligne18: "solution de l'équation, un",
    ligne19: "conseil : bougez la avant",
    ligne20: "qu'il ne soit trop tard ...",
    ligne21: "Second conseil : si vous avez",
    ligne22: "une pog, il n'existe aucune",
    ligne23: "technique dite cheatée",
    ligne24: "permettant de la up super vite",
    ligne25: "Ceux qui disent cela sont",
    ligne26: "des arnaqueurs qui vous feront",
    ligne27: "faire des clics droits sur un",
    ligne28: "élément tel qu'un levier.",
    ligne29: "Puis, qui, au moment opportun,",
    ligne30: "poseront un drawer devant vous",
    ligne31: "pour que vous y déposiez votre",
    ligne32: "pog et la subtiliser !Warning!",
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