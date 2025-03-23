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
    ligne1: "Il était une fois un joueur",
    ligne2: "comme les autres mais qui",
    ligne3: "commençait à s'ennuyer sur",
    ligne4: "le serveur nommé Paladium.",
    ligne5: "Au lieu de partir vers de",
    ligne6: "nouveaux horizons inconnus,",
    ligne7: "la nostalgie le fit retenir",
    ligne8: "prisonnier pour toujours.",
    ligne9: "Depuis, il erre sans but dans",
    ligne10: "ce qui est désormais sa prison",
    ligne11: "et passe son temps à refaire",
    ligne12: "les mêmes choses, encore et",
    ligne13: "encore, de saison en saison,",
    ligne14: "mais sans savoir pourquoi.",
    ligne15: "Pour s'occuper, il décida de",
    ligne16: "créer un journal: Le Palatime.",
    ligne17: "Et c'est ainsi qu'il commença",
    ligne18: "à vendre du papier à des prix",
    ligne19: "exorbitants, récompensant ceux",
    ligne20: "qui sauraient les déchiffrer.",
    ligne21: "Malheureusement le format a",
    ligne22: "ses limites, contraignant son",
    ligne23: "auteur, freinant sa créativité",
    ligne24: "avec ses 900 caractères max.",
    ligne25: "Il est donc temps pour moi de",
    ligne26: "passer du papier au numérique,",
    ligne27: "du Palatime au PalaTimeV alias",
    ligne28: "PalaTV, le premier journal TV.",
    ligne29: "Envoyez votre avis sur ce new",
    ligne30: "format dans la mailbox de",
    ligne31: "0livierMinecraft, où un tirage",
    ligne32: "au sort de 100 000$ aura lieu."
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