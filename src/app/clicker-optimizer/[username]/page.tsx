import { RankingType, UpgradeKey } from "@/types";
import ProfileFetcherWrapper from "@/components/ProfileFetcher.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import Tuto from "@/components/Tuto.tsx";
import ImportProfil from "@/components/shared/ImportProfil.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import RPS from "@/components/Clicker-Optimizer/RPS.tsx";

import Stats from "@/components/Clicker-Optimizer/Stats.tsx";
import MetierList from "@/components/MetierList.tsx";
import BuildingList from "@/components/Clicker-Optimizer/BuildingList.tsx";
import ClickList from "@/components/Clicker-Optimizer/ClickList.tsx";
import { Fragment } from "react";
import UpgradeList from "@/components/Clicker-Optimizer/UpgradeList.tsx";
import FallingClickImage from "@/components/PalaTime/FallingClickImage.tsx";
import GraphItem from "@/components/Clicker-Optimizer/GraphRanking.tsx";

export default function Home({ params }: { params: { username: string } }) {


  const upgrades: Array<{ title: string, upgradeType: UpgradeKey }> = [
    { title: "Global", upgradeType: "global_upgrade" },
    { title: "Terrain", upgradeType: "terrain_upgrade" },
    { title: "Amélioration des bâtiments", upgradeType: "building_upgrade" },
    { title: "Many", upgradeType: "many_upgrade" },
    { title: "Postérieur", upgradeType: "posterior_upgrade" },
    { title: "Catégorie", upgradeType: "category_upgrade" },
  ];


  return (
    <>
      <ProfileFetcherWrapper username={params.username}>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Bienvenue sur l`&apos;optimiseur du{" "}
                <GradientText className="font-extrabold">PalaClicker</GradientText>
              </CardTitle>
              <CardDescription>
                Made with <FaHeart
                className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Tuto/>
                {/*<News defaultOpen={isModalNewsOpen}/>*/}
                {/*<DailyPopup defaultOpen={showDayPopup}/>*/}
                {/*<Graph/>*/}
                <GraphItem rankingType={'clicker' as RankingType}/>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 items-start">
              <CardDescription>Vous avez la possibilité de choisir un pseudo pour voir son
                profil</CardDescription>
              <ImportProfil showResetButton/>
            </CardFooter>
          </Card>
          <RPS/>
          <HeadingSection>Statistiques</HeadingSection>
          <Stats/>
          <HeadingSection>Métiers</HeadingSection>
          <MetierList editable={true}/>
          <HeadingSection>Bâtiments</HeadingSection>
          <BuildingList/>
          <HeadingSection>Clicks</HeadingSection>
          <ClickList/>
          {upgrades.map((upgrade) => (
            <Fragment key={upgrade.upgradeType}>
              <HeadingSection>{upgrade.title}</HeadingSection>
              <UpgradeList key={upgrade.upgradeType} upgradeType={upgrade.upgradeType}/>
            </Fragment>
          ))}
        </div>
      </ProfileFetcherWrapper>
      <FallingClickImage/>
    </>
  )
}