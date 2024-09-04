import ProfileFetcherWrapper from "@/components/ProfileFetcher.tsx";
import { MetierComponentWrapper } from "@/components/MetierList.tsx";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import {
  MetierSelectorClient,
  MetierToReachWrapper,
  SetLevelInUrl
} from "@/components/Xp-Calculator/MetierSelectorClient.tsx";
import { MetierKey } from "@/types";
import { HowToXp, searchParamsXpBonusPage, XpBonus } from "@/components/Xp-Calculator/XpCalculator.tsx";
import { getFactionInfo, getJobsFromUUID, getPaladiumProfileByPseudo } from "@/lib/api/apiPala.ts";
import { formatPrice } from "@/lib/misc.ts";


export async function generateMetadata(
  { params ,searchParams }: { params: { username: string }, searchParams: searchParamsXpBonusPage},
) {


    const title = `Paladium Tracker - Calculateur d'xp de métier - ${params.username}`;
    const description = `Renseignez votre pseudo Paladium et le métier que vous souhaitez xp pour obtenir des quantités à farmer pour atteindre le niveau souhaité.`;
    // const defaultImage = "https://brominee.github.io/PaladiumClicker/favicon.ico";
    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        // images: [
        //   {
        //     url: defaultImage,
        //     width: 800,
        //     height: 600,
        //   }
        // ]
      },
    }
  
}

export default function Home({ params, searchParams }: {
  params: { username: string },
  searchParams: searchParamsXpBonusPage
}) {
  if (searchParams.metier === undefined)
    redirect(`/xp-calculator/${params.username}?metier=miner`);

  searchParams.metier = searchParams.metier?.toLowerCase();
  searchParams.dailyBonus = searchParams.dailyBonus !== undefined ? Number(searchParams.dailyBonus) : undefined;
  searchParams.level = searchParams.level !== undefined ? Number(searchParams.level) : undefined;


  const metierAvailable: MetierKey[] = ["miner", "farmer", "hunter", "alchemist"]
  if (!metierAvailable.includes(searchParams.metier as MetierKey))
    redirect(`/xp-calculator/${params.username}?metier=miner`);

  const metierSelected = searchParams.metier as MetierKey;

  return (
    <ProfileFetcherWrapper username={params.username}>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Bienvenue sur le calculateur{" "}
              <GradientText className="font-extrabold">d&apos;xp de métier</GradientText>
            </CardTitle>
            <CardDescription>
              Made with <FaHeart
              className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-evenly">
            <SetLevelInUrl selected={metierSelected} searchParams={searchParams} params={params}/>
            {/*<select onChange={(e) => {*/}
            {/*  setMetierSelected(e.target.value)*/}
            {/*}}>*/}
            {/*  {playerInfo["metier"].map((e, index) => {*/}
            {/*        return <option key={index}*/}
            {/*                       value={e["name"]}>{e["name"][0].toUpperCase() + e["name"].slice(1)}</option>*/}
            {/*      }*/}
            {/*  )}*/}
            {/*</select>*/}
            <div className="grid-cols-2 grid sm:grid-cols-4">
              {metierAvailable.map((e, index) => {
                return (
                  <MetierSelectorClient key={index} metier={e} username={params.username}
                                        selected={searchParams.metier === e} searchParams={searchParams}/>
                )
              })
              }
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 grid-rows-1 gap-4">
          <Card className="pt-6 flex flex-col items-center justify-center gap-2">
            <CardHeader>
              <h1>Niveau actuel</h1>
            </CardHeader>
            <CardContent>
              <MetierComponentWrapper editable={false} metierKey={metierSelected}/>
            </CardContent>
          </Card>

          <Card className="pt-6 flex flex-col items-center justify-center gap-2">
            <CardHeader>
              <h1>Niveau à atteindre</h1>
            </CardHeader>
            <CardContent>
              <MetierToReachWrapper metierKey={metierSelected} searchParams={searchParams}/>
            </CardContent>
          </Card>
        </div>
        <XpBonus params={params} searchParams={searchParams}/>
        <HowToXp searchParams={searchParams}/>
      </div>
    </ProfileFetcherWrapper>
  )
}