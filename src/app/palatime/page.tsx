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
    ligne1: "Message du camp de l'ordre :",
    ligne2: "Moi Frigg, première du nom,",
    ligne3: "Pilier de la discipline",
    ligne4: "Gardienne de la paix et",
    ligne5: "représentante du droit chemin,",
    ligne6: "majoritaire dans les comtés",
    ligne7: "d'Egopolis et de Kilmordra",
    ligne8: "depuis la nuit des temps,",
    ligne9: "cherche valeureux guerriers",
    ligne10: "pour faire face à la montée en",
    ligne11: "puissance de la menace dans",
    ligne12: "les grandes plaines d'Aeloria.",
    ligne13: "Seuls ceux qui réussiront le",
    ligne14: "jump du lobby de paladium",
    ligne15: "seront dignes d'intégrer mes",
    ligne16: "armées et de gagner 100 000$.",
    ligne17: "Pour prouver vos exploits,",
    ligne18: "envoyez un screen de vous sur",
    ligne19: "le dernier bloc du jump (avec",
    ligne20: "la date du jour dans le chat)",
    ligne21: "sur le discord de Palatimes.",
    ligne22: "Adressez vous à lui pour toute",
    ligne23: "question. Ce challenge est",
    ligne24: "évidemment ouvert à tous.",
    ligne25: "Astuce anti-concurrence :",
    ligne26: "pour détecter un secret chest",
    ligne27: "aérien il suffit d'équiper les",
    ligne28: "Goggles of Community. Et il",
    ligne29: "apparaitra comme par magie.",
    ligne30: "Une dernière chose importante:",
    ligne31: "Les actes de OlivierMinecraft",
    ligne32: "ne resteront pas impunis. Frigg",
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