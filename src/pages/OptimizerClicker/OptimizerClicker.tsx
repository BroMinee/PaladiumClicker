import BuildingList from "@/pages/OptimizerClicker/Components/Building/BuildingList";
import MetierList from "@/components/Metier/MetierList";
import News from "@/components/News/News";
import NoPseudoPage from "@/components/NoPseudoPage/NoPseudoPage";
import Tuto from "@/components/Tuto/Tuto";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useState } from "react";
import ClickList from "./Components/ClickList/ClickList";
import Graph from "./Components/Graph/Graph";
import ImportProfil from "./Components/ImportProfil/ImportProfil";
import RPS from "./Components/RPS/RPS";
import Stats from "./Components/Stats/Stats";
import UpgradeList from "./Components/UpgradeList/UpgradeList";
import "./OptimizerClicker.css";
import Layout from "@/components/shared/Layout";

const OptimizeClickerPage = () => {

  const {
    data: playerInfo,
  } = usePlayerInfoStore();

  const [isModalNewsOpen, setIsModalNewsOpen] = useState(playerInfo === null);
  const [isModalTutoOpen, setIsModalTutoOpen] = useState(false);
  const [isModalGraphOpen, setIsModalGraphOpen] = useState(false);

  const [rps, setRPS] = useState(1)

  if (!playerInfo) {
    return (<NoPseudoPage />);
  }

  return (
    <Layout>
      <div id="container" className="container">
      </div>
      <News open={isModalNewsOpen} onOpenChange={setIsModalNewsOpen} />
      <Graph open={isModalGraphOpen} onOpenChange={setIsModalGraphOpen} />
        <Tuto open={isModalTutoOpen} onOpenChange={setIsModalTutoOpen} />
      <div className="App gridClicker children-blurry">
        <div style={{ justifySelf: "center" }}>
          <p style={{ fontSize: "xx-large", marginBottom: "0px" }}>
            Bienvenue sur l'optimiseur du&nbsp;
            <span className={"BroMine"}>
              PalaClicker
            </span>
          </p>
          <p style={{ fontSize: "x-large", marginTop: "0px" }}>
            Made by&nbsp;
            <span className={"BroMine"}> BroMine__</span>
          </p>


          <div style={{ flexDirection: "row", display: "flex", paddingTop: "20px", columnGap: "10px" }}>
            <button onClick={() => setIsModalTutoOpen(true)} style={{ cursor: "pointer" }}>
              Comment utiliser l'outil
            </button>
            <button onClick={() => setIsModalNewsOpen(true)} style={{ cursor: "pointer" }}>
              Voir les nouvelles fonctionnalitées
            </button>
            <button onClick={() => setIsModalGraphOpen(true)} style={{ cursor: "pointer" }}>
              Voir l'évolution du top 10
            </button>
          </div>
          <ImportProfil showResetButton={true} />
        </div>


        <RPS rps={rps} />
        <h1>Statistiques</h1>
        <Stats rps={rps} />

        <h1>Métier</h1>
        <MetierList editable={true} />

        <h1>Bâtiments</h1>
        <BuildingList setRPS={setRPS} />

        <h1>Clic</h1>
        <ClickList />

        <h1>Global</h1>
        <UpgradeList upgradeName={"global_upgrade"} />

        <h1>Terrain</h1>
        <UpgradeList upgradeName={"terrain_upgrade"} />

        <h1>Amélioration des bâtiments</h1>
        <UpgradeList upgradeName={"building_upgrade"} />

        <h1>Many</h1>
        <UpgradeList upgradeName={"many_upgrade"} />

        <h1>Postérieur</h1>
        <UpgradeList upgradeName={"posterior_upgrade"} />

        <h1>Catégorie</h1>
        <UpgradeList upgradeName={"category_upgrade"} />

      </div>
    </Layout>
  )
}

export default OptimizeClickerPage;
