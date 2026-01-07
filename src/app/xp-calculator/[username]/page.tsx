import { ProfileFetcherWrapper } from "@/components/profile-fetcher.client";
import { XPCalculator } from "@/components/xp-calculator/calculator.client";
import { constants } from "@/lib/constants";
import { safeJoinPaths } from "@/lib/misc";
import { searchParamsXpBonusPage } from "@/types";
import React from "react";

/**
 * Generate Metadata
 * @param props.params - Username
 * @param props.searchParams - Search Params
 */
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
  const image = safeJoinPaths("https://palatracker.bromine.fr/", constants.imgPathProfile, "/JobsIcon/", imgPath, ".webp");
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

/**
 * [xp-calculator page](https://palatracker.bromine.fr/xp-calculator/BroMine__)
 */
export default async function XpCaclulatorPage(props: {
  params: Promise<{ username: string }>,
}
) {
  const params = await props.params;

  return (<ProfileFetcherWrapper username={params.username}>
    <XPCalculator/>
  </ProfileFetcherWrapper>);
}