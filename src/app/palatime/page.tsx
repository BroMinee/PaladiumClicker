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
    ligne1: "Il se passe des trucs étranges",
    ligne2: "sur Paladium. Voici le rapport",
    ligne3: "d'enquête volé à Palatimes :",
    ligne4: "Samedi 1er mars. Il est 16h",
    ligne5: "lorsque les lobbys réouvrent.",
    ligne6: "À leur reconnexion, les joueurs",
    ligne7: "tombent face à face avec un",
    ligne8: "Arty au dialecte inconnu.",
    ligne9: "À sa gauche, le rosier n°1",
    ligne10: "dont les émanations de pollen",
    ligne11: "nous inspirent le chiffre 5.",
    ligne12: "Après recherches, voici les",
    ligne13: "positions des 10 rosiers et",
    ligne14: "les chiffres qu'ils renvoient :",
    ligne15: "4991/62/5001 Rosier 1 -> 5",
    ligne16: "5213/60/5083 Rosier 2 -> 1",
    ligne17: "5187/57/4810 Rosier 3 -> 6",
    ligne18: "4816/34/4785 Rosier 4 -> 4",
    ligne19: "5006/68/4966 Rosier 5 -> 6",
    ligne20: "5028/70/5110 Rosier 6 -> 6",
    ligne21: "4995/79/5227 Rosier 7 -> 5",
    ligne22: "5201/66/5230 Rosier 8 -> 1",
    ligne23: "5169/60/5010 Rosier 9 -> 0",
    ligne24: "5352/61/5193 Rosier 10 -> 2",
    ligne25: "En les considérant comme des",
    ligne26: "coordonnées: 5164/66/5102, on",
    ligne27: "tombe sur un coffre contenant",
    ligne28: "des items dont les ID forment",
    ligne29: "les mots 'TEN YEARS' avec A=1.",
    ligne30: "Le message d'Arty est en",
    ligne31: "réalité codé en chiffre Rozier",
    ligne32: "et on vient de trouver la clé."
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