import './App.css';
import BuildingList from "./Components/Building/BuildingList";
import MetierList from "./Components/Metier/MetierList";
import RPS from "./Components/RPS/RPS";
import React, {useEffect, useState} from "react";
import ClickList from "./Components/ClickList/ClickList";
import GlobalList from "./Components/GlobalList/GlobalList";
import TerrainList from "./Components/TerrainList/TerrainList";
import BuildingUpgradeList from "./Components/BuildingUpgradeList/BuildingUpgradeList";
import ManyList from "./Components/ManyList/ManyList";
import PosteriorList from "./Components/PosteriorList/PosteriorList";
import CategoryList from "./Components/CategoryList/CategoryList";



const App = () => {

    const [rps, setRPS] = useState(1)
    const [estimatedRPS, setEstimatedRPS] = useState(3)

    return (
        <div className="App" style={{"background-image": `url(${process.env.PUBLIC_URL}/background.png)`}}>
            <header className="App-header">
                Welcome To PalaClicker
            </header>
            <br/>
            <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo"/>
            <RPS RPS={rps} estimatedRPS={estimatedRPS}/>
            <h1>Metier</h1>
            <MetierList/>
            <h1>Building</h1>
            <BuildingList/>

            <h2>Click</h2>
            <ClickList/>

            <h1>Global</h1>
            <GlobalList/>

            <h2>Terrain</h2>
            <TerrainList/>

            <h2>Building</h2>
            <BuildingUpgradeList/>

            <h2>Many</h2>
            <ManyList/>

            <h2>Posterior</h2>
            <PosteriorList/>

            <h2>Category</h2>
            <CategoryList/>
        </div>
    )
        ;
}

export default App;
