import './App.css';
import BuildingList from "./Components/Building/BuildingList";
import MetierList from "./Components/Metier/MetierList";
import RPS from "./Components/RPS/RPS";
import React, {useEffect, useState} from "react";
import ClickList from "./Components/ClickList/ClickList";
import GlobalList from "./Components/GlobalList/GlobalList";


function Test() {

}

const App = () => {

    const [rps, setRPS] = useState(1)
    const [estimatedRPS, setEstimatedRPS] = useState(3)

    return (
        <div className="App">
            <header className="App-header">
                Welcome To PalaClicker
            </header>
            <br/>
            <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo"/>
            <RPS RPS={rps} estimatedRPS={estimatedRPS}/>
            <h1>Metier</h1>
            <Test/>
            {/*<MetierList/>*/}
            <h1>Building</h1>
            <BuildingList/>

            <h2>Click</h2>
            <ClickList/>

            <h1>Global</h1>
            <GlobalList/>

            <h2>Global</h2>
            <BuildingList/>

            <h2>Terrain</h2>
            <BuildingList/>

            <h2>Building</h2>
            <BuildingList/>

            <h2>Many</h2>
            <BuildingList/>

            <h2>Posterior</h2>
            <BuildingList/>

            <h2>Category</h2>
            <BuildingList/>
        </div>
    )
        ;
}

export default App;
