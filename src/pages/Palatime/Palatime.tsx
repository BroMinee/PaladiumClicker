import GradientText from "@/components/shared/GradientText";
import Layout from "@/components/shared/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FallingClickImage from "@/pages/OptimizerClicker/Components/FallingClickImage";
import { FaHeart } from "react-icons/fa";


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
    ligne1: "Zerolivier a ecrit 1 dinguerie",
    ligne2: "= ) alors ouvrez bien les yeux",
    ligne3: "Malgre tout les indices, votre",
    ligne4: "objectif n'a pas ete atteint.",
    ligne5: "Il y a donc sur un serveur (",
    ligne6: "non je ne redirais pas lequel,",
    ligne7: "seul les lecteurs reguliers",
    ligne8: "sauront le serv dont on parle)",
    ligne9: "et sur lequel se trouve l'",
    ligne10: "incroyable butin de 400k$. Le",
    ligne11: "z de ce coffre est cache ici",
    ligne12: "et 4 000 titane ore, en fr des",
    ligne13: "minerais de titane sont ",
    ligne14: "insere dans le chest tresor.",
    ligne15: "La piste a suivre est ainsi :",
    ligne16: "La solution est en dbt de page",
    ligne17: "En parallele, mefiez vous de",
    ligne18: "cette arnaque qui consiste",
    ligne19: "en la vente d'item cher",
    ligne20: "n'etant pas directement vendu",
    ligne21: "tres cher mais mis en vente au",
    ligne22: "travers de oak drawer. En",
    ligne23: "realite, l'item n'y est pas.",
    ligne24: "En effet, demandez vous pk il",
    ligne25: "ne vend pas normalement comme",
    ligne26: "tout le monde l'item direct ?",
    ligne27: "Enfin, qdf, 275 000 Bamboo",
    ligne28: "seront necessaire a votre fac.",
    ligne29: "Eh au fait j'oubliais il n'y a",
    ligne30: "pas de prochain Palatime",
    ligne31: "tant que le coffre est impille",
    ligne32: ". Cherchez bien, a bientot.Plt",
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
              tresor,
              loto, etc... Tu vas bien t'amuser.
            </CardContent>
          </Card>
          <div className="flex flex-col w-full items-center">
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
          </div>
        </div>
        <FallingClickImage PalaTime={true}/>
      </Layout>

    </>
  )
}

export default PalatimePage;
