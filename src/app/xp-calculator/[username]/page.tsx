import ProfileFetcherWrapper from "@/components/ProfileFetcher.tsx";
import { MetierComponentWrapper } from "@/components/MetierList.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitleH1 } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import {
  MetierSelectorClient,
  MetierToReachWrapper,
  SetLevelInUrl
} from "@/components/Xp-Calculator/MetierSelectorClient.tsx";
import { MetierKey } from "@/types";
import { HowToXp, searchParamsXpBonusPage, XpBonus } from "@/components/Xp-Calculator/XpCalculator.tsx";
import constants from "@/lib/constants.ts";
import { safeJoinPaths } from "@/lib/misc.ts";

export async function generateMetadata(
  props: { params: Promise<{ username: string }>, searchParams: Promise<searchParamsXpBonusPage> }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const title = `PalaTracker | Calculateur d'xp | ${params.username}`;
  const description = "Renseignez votre pseudo Paladium et le métier que vous souhaitez xp pour obtenir des quantités à farmer pour atteindre le niveau souhaité.";
  // const defaultImage = "https://brominee.github.io/PaladiumClicker/favicon.ico";
  let imgPath = "Mineur";
  if (searchParams.metier !== undefined) {
    switch (searchParams.metier) {
    case "miner":
      imgPath = "Mineur";
      break;
    case "farmer":
      imgPath = "Fermier";
      break;
    case "hunter":
      imgPath = "Chasseur";
      break;
    case "alchemist":
      imgPath = "Alchimiste";
      break;
    default:
      imgPath = "Mineur";
      break;
    }
  }
  let image = safeJoinPaths("https://palatracker.bromine.fr/", constants.imgPathProfile, "/JobsIcon/", imgPath, ".webp");
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: image,
          width: 256,
          height: 256,
        }
      ]
    },
  };
}

export default async function Home(
  props: {
    params: Promise<{ username: string }>,
    searchParams: Promise<searchParamsXpBonusPage>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const metierAvailable: MetierKey[] = ["miner", "farmer", "hunter", "alchemist"];
  if (searchParams.metier === undefined || !metierAvailable.includes(searchParams.metier as MetierKey)) {
    return <SetLevelInUrl selected="miner" searchParams={searchParams} params={params} />;
  }
  searchParams.metier = searchParams.metier?.toLowerCase();
  searchParams.dailyBonus = searchParams.dailyBonus !== undefined ? Number(searchParams.dailyBonus) : undefined;
  searchParams.level = searchParams.level !== undefined ? Number(searchParams.level) : undefined;

  const metierSelected = searchParams.metier as MetierKey;

  return (
    <ProfileFetcherWrapper username={params.username}>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitleH1>
              Bienvenue sur le calculateur{" "}
              <GradientText className="font-extrabold">d&apos;xp de métier</GradientText>
            </CardTitleH1>
            <CardDescription>
              Made with <FaHeart
                className="text-primary inline-block" /> by <GradientText>BroMine__</GradientText>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-evenly">
            <SetLevelInUrl selected={metierSelected} searchParams={searchParams} params={params} />
            <div className="grid-cols-2 grid sm:grid-cols-4">
              {metierAvailable.map((e, index) => {
                return (
                  <MetierSelectorClient key={index} metier={e} username={params.username}
                    selected={searchParams.metier === e} searchParams={searchParams} />
                );
              })
              }
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 grid-rows-1 gap-4">
          <Card className="pt-6 flex flex-col items-center justify-center gap-2">
            <CardHeader>
              <h3>Niveau actuel</h3>
            </CardHeader>
            <CardContent id="metier-current-level">
              <MetierComponentWrapper editable={false} metierKey={metierSelected} />
            </CardContent>
          </Card>

          <Card className="pt-6 flex flex-col items-center justify-center gap-2">
            <CardHeader>
              <h3>Niveau à atteindre</h3>
            </CardHeader>
            <CardContent id="metier-target-level">
              <MetierToReachWrapper metierKey={metierSelected} searchParams={searchParams} />
            </CardContent>
          </Card>
        </div>
        <XpBonus params={params} searchParams={searchParams} />
        <HowToXp searchParams={searchParams} />
      </div>
    </ProfileFetcherWrapper>
  );
}