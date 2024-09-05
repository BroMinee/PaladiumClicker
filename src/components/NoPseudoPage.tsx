import GradientText from "@/components/shared/GradientText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import Contributors from "@/components/Contributors.tsx";
import Discord from "@/components/Discord.tsx";
import ImportProfil from "@/components/shared/ImportProfil.tsx";
import News from "@/components/News.tsx";
import GraphItem from "@/components/Clicker-Optimizer/GraphRanking.tsx";
import { RankingType } from "@/types";


export function NoPseudoPage({ noBoldText, boldText }: { noBoldText: string, boldText: string }) {

  return (
    <div className="flex flex-col gap-4">
      <Card className="h-96">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bienvenue{" "}{noBoldText}{" "}
            <GradientText className="font-extrabold">{boldText}</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart
            className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 m-8">
              <CardTitle className="pt-3 font-semibold">
                Entrez un pseudo <span className="text-primary">Minecraft</span> pour voir son
                profil <span className="text-primary">Paladium</span>
              </CardTitle>
              <ImportProfil classNameInput="w-40 sm:w-96"/>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row gap-2 pb-4">
            <News/>
            {/*<DailyPopup defaultOpen={showDayPopup}/>*/}
            <GraphItem rankingType={'clicker' as RankingType}/>
          </div>
        </CardContent>
      </Card>
      <Discord/>
      <Contributors/>
    </div>
  );
}