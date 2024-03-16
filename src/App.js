import './App.css';
import BuildingList from "./Components/Building/BuildingList";
import MetierList from "./Components/Metier/MetierList";
import RPS from "./Components/RPS/RPS";
import {useEffect, useState} from "react";


const App = () => {

    const [rps, setRPS] = useState(1)
    const [estimatedRPS, setEstimatedRPS] = useState(3)

    return (
        <div className="App">
            <header className="App-header">
                Welcome To PalaClicker
            </header>
            <body className="Body">
            <br/>
            <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo"/>
            <RPS RPS={rps} estimatedRPS={estimatedRPS}/>
            <h1>Metier</h1>
            <MetierList/>
            <h1>Building</h1>
            <BuildingList/>
            <h1>Upgrade</h1>
            <BuildingList/>
            <h2>Click</h2>
            <BuildingList/>
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
            </body>
        </div>
    );
}

export default App;
