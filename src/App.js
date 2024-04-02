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
import fetchDataOnPublicURL from "./FetchData";
import ImportExport from "./Components/ImportExport/ImportExport";
import News from "./Components/News/News";

let cacheHasBeenReset = false;
const App = () => {

    const [rps, setRPS] = useState(1)
    const [estimatedRPS, setEstimatedRPS] = useState(3)

    const [playerInfo, setPlayerInfo] = useState({})


    useEffect(() => {
        const fetchAllData = async () => {
            var newPlayerInfo = {}
            await fetchDataOnPublicURL("/metier.json").then((data) => {
                newPlayerInfo["metier"] = data
            })
            await fetchDataOnPublicURL("/building.json").then((data) => {
                newPlayerInfo["building"] = data
            })
            await fetchDataOnPublicURL("/building_upgrade.json").then((data) => {
                newPlayerInfo["building_upgrade"] = data
            })
            await fetchDataOnPublicURL("/category_upgrade.json").then((data) => {
                newPlayerInfo["category_upgrade"] = data
            })
            await fetchDataOnPublicURL("/CPS.json").then((data) => {
                newPlayerInfo["CPS"] = data
            })
            await fetchDataOnPublicURL("/global_upgrade.json").then((data) => {
                newPlayerInfo["global_upgrade"] = data
            })
            await fetchDataOnPublicURL("/many_upgrade.json").then((data) => {
                newPlayerInfo["many_upgrade"] = data
            })
            await fetchDataOnPublicURL("/posterior_upgrade.json").then((data) => {
                newPlayerInfo["posterior_upgrade"] = data
            })
            await fetchDataOnPublicURL("/terrain_upgrade.json").then((data) => {
                newPlayerInfo["terrain_upgrade"] = data
            })

            setPlayerInfo(newPlayerInfo)
            localStorage.setItem("cacheInfo", JSON.stringify({
                "playerInfo": newPlayerInfo,
                "timestamp": new Date().getTime()
            }));

        }

        if (Object.keys(playerInfo).length === 0) {
            if(!isCacheValid()) {
                cacheHasBeenReset = true
                console.log("No cache")
                fetchAllData()
            }
            else
            {
                console.log("Using cache")
                setPlayerInfo(JSON.parse(localStorage.getItem("cacheInfo"))["playerInfo"])
            }
        }


    }, []);

    useEffect(() => {
        if (Object.keys(playerInfo).length === 0)

            return
        localStorage.setItem("cacheInfo", JSON.stringify({
            "playerInfo": playerInfo,
            "timestamp": new Date().getTime()
        }));
    }, [playerInfo]);


    return (
        Object.keys(playerInfo).length === 0 ? <div>Loading</div> :
            <div>
                <div id="container" className="container">
                </div>
                <News cacheHasBeenReset={cacheHasBeenReset}/>

                <div className="App" style={{"background-image": `url(${process.env.PUBLIC_URL}/background.png)`}}>
                    <header className="App-header">
                        <h3 style={{marginBottom: "0px", zIndex: 1, position: "relative"}}>
                            Bienvenue sur l'optimiseur du PalaClicker
                        </h3>
                        Made by BroMine__
                        <div onClick={() => alert("Not yet implemented")} style={{cursor: "pointer"}}>Voir l'evolution du top 10</div>
                        <div onClick={() => alert("Not yet implemented")} style={{cursor: "pointer"}}>Comment utiliser
                            l'outil
                        </div>
                        <div onClick={() => {
                            document.getElementById("modal").style.display = "block";
                        }} style={{cursor: "pointer"}}>Voir les nouvelles fonctionnalitées
                        </div>
                    </header>
                    <br/>


                    <RPS RPS={rps} estimatedRPS={estimatedRPS} playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}
                         setEstimatedRPS={setEstimatedRPS}/>
                    <br/>
                    <ImportExport playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>
                    <h1>Métier</h1>

                    <MetierList playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>
                    <h1>Bâtiments</h1>
                    <BuildingList playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} setRPS={setRPS}/>

                    <h1>Clic</h1>
                    <ClickList playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>

                    <h1>Global</h1>
                    <GlobalList playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>

                    <h1>Terrain</h1>
                    <TerrainList playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>

                    <h1>Amélioration des bâtiments</h1>
                    <BuildingUpgradeList playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>

                    <h1>Many</h1>
                    <ManyList playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>

                    <h1>Postérieur</h1>
                    <PosteriorList playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>

                    <h1>Catégorie</h1>
                    <CategoryList playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>
                </div>
            </div>
    )
        ;
}

export function isCacheValid()
{
    const cacheInfo = localStorage.getItem("cacheInfo");
    if (cacheInfo === null || cacheInfo === "") {
        return false
    }
    try {
        const jsonCacheInfo = JSON.parse(cacheInfo);
        if (jsonCacheInfo["timestamp"] < new Date("02 April 2024")) {
            return false
        }
    } catch (e) {
        return false
    }
    return true
}



export default App;
