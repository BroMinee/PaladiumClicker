import MetierList from "@/components/MetierList";
import News from "@/components/News";
import NoPseudoPage from "@/components/NoPseudoPage";
import Tuto from "@/components/Tuto";
import GradientText from "@/components/shared/GradientText";
import HeadingSection from "@/components/shared/HeadingSection";
import Layout from "@/components/shared/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BuildingList from "@/pages/OptimizerClicker/Components/BuildingList";
import FallingClickImage from "@/pages/OptimizerClicker/Components/FallingClickImage";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { UpgradeKey } from "@/types";
import { Fragment, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import ClickList from "./Components/ClickList";
import Graph from "./Components/Graph";
import ImportProfil from "./Components/ImportProfil";
import RPS from "./Components/RPS";
import Stats from "./Components/Stats";
import UpgradeList from "./Components/UpgradeList";

const OptimizerClickerPage = () => {

  const { data: playerInfo } = usePlayerInfoStore();
  const [isModalNewsOpen, setIsModalNewsOpen] = useState(playerInfo === null);

  const getTimeLocalStorage = localStorage.getItem("getTime");
  const [showDayPopup] = useState(getTimeLocalStorage === null || new Date(getTimeLocalStorage).getDay() != new Date().getDay());

  useEffect(() => {
    if (showDayPopup) {
      localStorage.setItem("getTime", new Date().toString());
    }
  }, []);

  useEffect(() => {
    if (playerInfo === null) {
      setIsModalNewsOpen(true);
    }
  }, [playerInfo]);

  const [showGraph] = useState(false);

  const upgrades: Array<{ title: string, upgradeType: UpgradeKey }> = [
    { title: "Global", upgradeType: "global_upgrade" },
    { title: "Terrain", upgradeType: "terrain_upgrade" },
    { title: "Amélioration des bâtiments", upgradeType: "building_upgrade" },
    { title: "Many", upgradeType: "many_upgrade" },
    { title: "Postérieur", upgradeType: "posterior_upgrade" },
    { title: "Catégorie", upgradeType: "category_upgrade" },
  ];


  if (!playerInfo) {
    return (
      <Layout>
        <NoPseudoPage/>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="flex flex-col gap-4">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Bienvenue sur l'optimiseur du{" "}
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
                <News defaultOpen={isModalNewsOpen}/>
                {/*<DailyPopup defaultOpen={showDayPopup}/>*/}
                <Graph defaultOpen={showGraph}/>
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
      </Layout>
      <FallingClickImage/>
    </>
  )
}

export default OptimizerClickerPage;
