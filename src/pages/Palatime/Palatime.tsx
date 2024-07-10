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

  function validateObject(obj: MonObjet): asserts obj is MonObjet {
    for (const key in obj) {
      // @ts-ignore
      if (obj[key].length !== 30) {
        console.warn(`La chaîne ${key} n'a pas exactement 30 caractères.`);
        // @ts-ignore
        obj[key] = "Erreur de longeur de la chaine"
      }
    }
  }

// Exemple d'utilisation
  const journal: MonObjet = {
    ligne1: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ligne2: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ligne3: "cccccccccccccccccccccccccccccc",
    ligne4: "dddddddddddddddddddddddddddddd",
    ligne5: "eeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    ligne6: "ffffffffffffffffffffffffffffff",
    ligne7: "gggggggggggggggggggggggggggggg",
    ligne8: "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
    ligne9: "iiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
    ligne10: "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
    ligne11: "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
    ligne12: "llllllllllllllllllllllllllllll",
    ligne13: "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
    ligne14: "nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
    ligne15: "oooooooooooooooooooooooooooooo",
    ligne16: "pppppppppppppppppppppppppppppp",
    ligne17: "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
    ligne18: "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
    ligne19: "ssssssssssssssssssssssssssssss",
    ligne20: "tttttttttttttttttttttttttttttt",
    ligne21: "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",
    ligne22: "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",
    ligne23: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    ligne24: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ligne25: "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
    ligne26: "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
    ligne27: "111111111111111111111111111111",
    ligne28: "222222222222222222222222222222",
    ligne29: "333333333333333333333333333333",
    ligne30: "444444444444444444444444444444",
    ligne31: "555555555555555555555555555555",
    ligne32: "666666666666666666666666666666",
  };

  validateObject(journal);


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
                    <div key={key} className="flex flex-row gap-2">
                      <div className="font-bold">{key.substring(5)} - {value}</div>
                    </div>
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
