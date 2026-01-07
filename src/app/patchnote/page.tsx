import { GradientText } from "@/components/shared/gradient-text";
import { FaHeart } from "react-icons/fa";
import Discord from "@/components/discord";
import newsJson from "@/public/news.json";
import { News } from "@/components/news";
import { ChangeLogs } from "@/types";
import { Card } from "@/components/ui/card";
import { CardContent, CardDescription, CardHeader, CardTitleH1 } from "@/components/ui/card";

/**
 * Generate Metadata
 */
export async function generateMetadata() {

  const title = "PalaTracker | Patchnotes";
  const description = "📝 Viens consulter les dernières nouveautés de PalaTracker ! 📝";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };

}

/**
 * [Patchnote page](https://palatracker.bromine.fr/patchnote)
 */
export default function Home() {
  const json: ChangeLogs[] = newsJson;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitleH1>
            Bienvenue sur la liste des patchnotes du{" "}
            <GradientText className="font-extrabold">PalaTracker</GradientText>
          </CardTitleH1>
          <CardDescription>
            Made with <FaHeart
              className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-primary font-black">Plus d&apos;informations techniques sur le discord</h2>
          <Discord className="mt-4"/>
        </CardContent>
      </Card>
      <div className="py-2 gap-2 flex flex-col">
        {json.map((element, index) => (
          <News
            key={index}
            update={element}
          />
        ))}
      </div>
    </div>
  );
}