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
    ligne1: "La rentrée approche à grands",
    ligne2: "pas, et c'est aussi le cas",
    ligne3: "pour les employés du journal.",
    ligne4: "Notre journaliste, Palatimes",
    ligne5: "ne vas plus se connecter bcp",
    ligne6: "pour pouvoir focus ses études.",
    ligne7: "Afin de l'encourager, il faut",
    ligne8: "le mp quand il se connecte IG.",
    ligne9: "Les premiers à le faire lors",
    ligne10: "de ses prochaines connexions",
    ligne11: "reçevront 50 000 $ par /trade",
    ligne12: "et ce jusqu'au numéro suivant.",
    ligne13: "Bientôt à cours d'idées",
    ligne14: "d'évènements, nous faisons",
    ligne15: "appel pour savoir lesquels ",
    ligne16: "vous avez le plus aimés.",
    ligne17: "N'hésitez pas à nous suggérer",
    ligne18: "des idées de nouveautés via la",
    ligne19: "mailbox. Des events longs pour",
    ligne20: "que tout le monde en profite.",
    ligne21: "Cette semaine, la quête de",
    ligne22: "faction est de 300 000 lianes.",
    ligne23: "Comme c'est souvent les mêmes",
    ligne24: "qdf qui sortent je vous",
    ligne25: "propose un petit jeu : ceux",
    ligne26: "qui arriveront à deviner",
    ligne27: "la suivante dans ma mailbox",
    ligne28: "auront un petit cadeau. Bref,",
    ligne29: "que vous soyez au college,",
    ligne30: "lycée, grandes études ou",
    ligne31: "autres, le Palatime vous ",
    ligne32: "souhaite BONNE RENTREE 2024",
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
