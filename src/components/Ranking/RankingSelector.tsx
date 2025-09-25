import { Card, CardContent, CardDescription, CardHeader, CardTitleH1 } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { rankingTypeToUserFriendlyText } from "@/lib/misc.ts";
import { FaHeart } from "react-icons/fa";
import { RankingType } from "@/types";
import { RankingSelectorClient } from "@/components/Ranking/RankingSelectorClient.tsx";
import { cn } from "@/lib/utils.ts";

export type searchParamsRankingPage = {
  category: string,
  usernames?: string,
  noUsernames?: string,
}

export function RankingSelectorCard({ rankingType, rankingPage }: { rankingType: RankingType, rankingPage: boolean }) {
  return <Card className={cn("flex flex-col gap-4", !rankingPage && "rounded-b-xl rounded-t-none")}>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitleH1>
        Bienvenue sur le visualisateur du classement{" "}
        <GradientText className="font-extrabold">{rankingTypeToUserFriendlyText(rankingType)}</GradientText>
      </CardTitleH1>
      <CardDescription>
        Made with <FaHeart
        className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
      </CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-3 md:flex md:flex-row items-center justify-between gap-2" id="ranking-selector">
      {Object.keys(RankingType).map((key) => {
        return <RankingSelectorClient key={key} rankingType={key as RankingType} rankingPage={rankingPage}/>;

      })}
    </CardContent>
  </Card>;
}
