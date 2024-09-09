import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import { Suspense } from "react";
import GraphStatus, { GraphStatusFallback } from "@/components/Status/GraphStatus.tsx";


export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bienvenue sur le visualisateur du{" "}
            <GradientText className="font-extrabold">Status</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart
            className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-between gap-2 h-[calc(100vh-30vh)]">
          Cette page n&apos;est pas encore finie, mais vous pouvez déjà voir le graphique des joueurs connectés sur Paladium.
          <Suspense fallback={<GraphStatusFallback/>}>
            <GraphStatus/>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}