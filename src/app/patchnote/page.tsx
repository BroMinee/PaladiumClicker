import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import Discord from "@/components/Discord.tsx";
import newsJson from "@/assets/news.json";
import New from "@/components/News.tsx";

export async function generateMetadata() {


  const title = `PalaTracker | Patchnotes`;
  const description = `📝 Viens consulter les dernières nouveautés de PalaTracker ! 📝`;
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  }

}

export default function Home() {

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bienvenue sur la liste des patchnotes du{" "}
            <GradientText className="font-extrabold">PalaTracker</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart
            className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-primary">Plus d&apos;informations techniques sur le discord</h2>
          <Discord className="mt-4"/>
        </CardContent>
      </Card>
      <div className="py-2 gap-2 flex flex-col">
        {newsJson.map((element, index) => (
          <New
            key={index}
            date={element.date}
            events={element.events}
          />
        ))}
      </div>
    </div>
  )
}