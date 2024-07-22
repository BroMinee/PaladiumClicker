import GradientText from "@/components/shared/GradientText";
import Layout from "@/components/shared/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import FallingClickImage from "@/pages/OptimizerClicker/Components/FallingClickImage.tsx";


const PalatimePage = () => {
// Vous pouvez ensuite spécifier le type plus précisément comme suit
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


// Exemple d'utilisation
  const journal: MonObjet = {
    ligne1: "Tu en as marre de passer une",
    ligne2: "éternité à lire ton journal",
    ligne3: "paladien préféré ? C'est vrai",
    ligne4: "que c'est relou de devoir ran-",
    ligne5: "ger tout ces bouts de papier",
    ligne6: "dans l'ordre !! Je regrette le",
    ligne7: "temps où le contenu des lucky",
    ligne8: "drawers n'était pas mélangé.",
    ligne9: "Mais heureusement, grâce à",
    ligne10: "BroMine, le Palatime est",
    ligne11: "désormais disponible en",
    ligne12: "version texte sur le ",
    ligne13: "PalaClicker Optimizer.",
    ligne14: "Pour fêter cette collaboration,",
    ligne15: "il offre 1 000 000 $ pour le",
    ligne16: "cashprize de cette semaine !!!",
    ligne17: "Il faut simplement trouver",
    ligne18: "l'easter egg qu'il a caché sur",
    ligne19: "la page & suivre les consignes",
    ligne20: "Ensuite, l'argent sera",
    ligne21: "distribue équitablement entre",
    ligne22: "ceux qui l'auront découvert.",
    ligne23: "Par exemple, s'il y a 10",
    ligne24: "gagnants, chacun reçoit 100k.",
    ligne25: "Petite prévention arnaque :",
    ligne26: "Si vous faites un /trade,",
    ligne27: "assurez vous d'être seul(e).",
    ligne28: "Sinon certaines personnes mal",
    ligne29: "intentionnées pourrait remplir",
    ligne30: "votre inventaire avec un DC",
    ligne31: "puis annuler le trade et voler",
    ligne32: "tout votre stuff. 0Mc & Plt",
  };


  return (
    <>
      <Layout>
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
              Une fois par semaine tu y trouveras l'actualité du serveur comme la quête de faction ; des astuces
              indispensables ; mais surtout un évent communautaire. Que ce soit tirage au sort, énigme, chasse au
              trésor,
              loto, etc... Tu vas bien t'amuser.
            </CardContent>
          </Card>
          <div className="flex flex-row w-full">
            <div className="flex-grow">
              <FallingClickImage PalaTime={true}/>
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
              <FallingClickImage PalaTime={true}/>
            </div>
          </div>
        </div>
      </Layout>

    </>
  )
}

export default PalatimePage;
