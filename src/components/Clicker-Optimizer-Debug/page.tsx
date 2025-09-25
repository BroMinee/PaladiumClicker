import { UpgradeKey } from "@/types";
import ProfileFetcherWrapper from "@/components/ProfileFetcher.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaHeart } from "react-icons/fa";
import Tuto from "@/components/Tuto.tsx";
import ImportProfil from "@/components/shared/ImportProfil.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import RPS from "@/components/Clicker-Optimizer/RPS.tsx";
import { MetierComponentWrapper } from "@/components/MetierList.tsx";
import BuildingList from "@/components/Clicker-Optimizer/BuildingList.tsx";
import ClickList from "@/components/Clicker-Optimizer/ClickList.tsx";
import UpgradeList from "@/components/Clicker-Optimizer/UpgradeList.tsx";
import FallingClickImage from "@/components/Clicker-Optimizer/FallingClick.tsx";
import { PlayerSkin } from "@/components/Profil/ProfilInfoClient.tsx";
import StatsDebug from "@/components/Clicker-Optimizer-Debug/StatsDebug.tsx";

export function ClickerOptimizerDebug({ params }: { params: { username: string } }) {

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
                Bienvenue sur l&apos;optimiseur du{" "}
                <GradientText className="font-extrabold">PalaClicker</GradientText>
              </CardTitle>
              <CardDescription>
                Made with <FaHeart
                className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">

              <div className="flex flex-wrap gap-2">
                <Tuto/>
              </div>

              <ImportProfil showResetButton/>

              <div className="grid grid-cols-2 2xl:grid-cols-5 justify-center items-center">
                <CardContent className="pt-6 flex-col hidden 2xl:flex items-center justify-center gap-2 w-96">
                  <PlayerSkin/>
                </CardContent>
                <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                  <MetierComponentWrapper editable metierKey="miner"/>
                </CardContent>
                <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                  <MetierComponentWrapper editable metierKey="farmer"/>
                </CardContent>
                <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                  <MetierComponentWrapper editable metierKey="hunter"/>
                </CardContent>
                <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                  <MetierComponentWrapper editable metierKey="alchemist"/>
                </CardContent>
              </div>
            </CardContent>
          </Card>
          <RPS/>
          <HeadingSection>Statistiques</HeadingSection>
          <StatsDebug/>

          <HeadingSection>Bâtiments</HeadingSection>
          <BuildingList/>
          <Card>
            <CardHeader>
              <CardTitle>Amélioration</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <HeadingSection>Clicks</HeadingSection>
                <ClickList/>
              </div>

              {upgrades.map((upgrade) => (
                <div key={upgrade.upgradeType}>
                  <HeadingSection>{upgrade.title}</HeadingSection>
                  <UpgradeList key={upgrade.upgradeType} upgradeType={upgrade.upgradeType}/>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ProfileFetcherWrapper>
      <FallingClickImage/>
    </>
  );
}