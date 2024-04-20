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
import fetchDataOnPublicURL, {fetchDataOnPaladiumAPI} from "./FetchData";
import Refesh from "./Components/RefeshAll/Refesh";
import News from "./Components/News/News";
import Graph from "./Components/Graph/Graph";
import Tuto from "./Components/Tuto/Tuto";

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
        const fetchAllDataButKeepOwn = async () => {
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

            const cachePlayerInfo = JSON.parse(localStorage.getItem("cacheInfo"))["playerInfo"]
            console.log("Keeping own")
            newPlayerInfo["metier"].forEach((metier, index) => {
                newPlayerInfo["metier"][index]["level"] = cachePlayerInfo["metier"][index]["level"];
            })

            // Building
            newPlayerInfo["building"].forEach((building, index) => {
                if (cachePlayerInfo["building"][index] !== undefined)
                    newPlayerInfo["building"][index]["own"] = cachePlayerInfo["building"][index]["own"];
            })

            // Global
            newPlayerInfo["global_upgrade"].forEach((global, index) => {
                newPlayerInfo["global_upgrade"][index]["own"] = cachePlayerInfo["global_upgrade"][index]["own"];
            })


            // Terrain
            newPlayerInfo["terrain_upgrade"].forEach((terrain, index) => {
                newPlayerInfo["terrain_upgrade"][index]["own"] = cachePlayerInfo["terrain_upgrade"][index]["own"];
            })

            // building_upgrade
            newPlayerInfo["building_upgrade"].forEach((building, index) => {
                newPlayerInfo["building_upgrade"][index]["own"] = cachePlayerInfo["building_upgrade"][index]["own"];
            })


            // many_upgrade
            newPlayerInfo["many_upgrade"].forEach((many, index) => {
                newPlayerInfo["many_upgrade"][index]["own"] = cachePlayerInfo["many_upgrade"][index]["own"];
            })


            // posterior_upgrade
            newPlayerInfo["posterior_upgrade"].forEach((posterior, index) => {
                newPlayerInfo["posterior_upgrade"][index]["own"] = cachePlayerInfo["posterior_upgrade"][index]["own"];
            })

            // category_upgrade
            newPlayerInfo["category_upgrade"].forEach((category, index) => {
                newPlayerInfo["category_upgrade"][index]["own"] = cachePlayerInfo["category_upgrade"][index]["own"];
            })

            // CPS
            newPlayerInfo["CPS"].forEach((category, index) => {
                newPlayerInfo["CPS"][index]["own"] = cachePlayerInfo["CPS"][index]["own"];
            })


            setPlayerInfo(newPlayerInfo)
            localStorage.setItem("cacheInfo", JSON.stringify({
                "playerInfo": newPlayerInfo,
                "timestamp": new Date().getTime()
            }));

        }

        if (Object.keys(playerInfo).length === 0) {
            if (!isCacheValid()) {
                cacheHasBeenReset = true
                console.log("No cache")
                fetchAllData()
            } else if (!isCacheDateValid()) {
                cacheHasBeenReset = true
                console.log("Cache is outdated")
                fetchAllDataButKeepOwn()
            } else {
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
                <Graph/>
                <Tuto/>
                {/*<Popup/>*/}

                <div className="App" style={{"background-image": `url(${process.env.PUBLIC_URL}/background.png)`}}>
                    <header className="App-header">
                        <div style={{flexDirection: "row", display: "flex"}}>
                            <h3 style={{marginBottom: "0px", zIndex: 1, position: "relative"}}>
                                Bienvenue sur l'optimiseur du&nbsp;
                            </h3>
                            <h3 style={{marginBottom: "0px", zIndex: 1, position: "relative"}} className={"BroMine"}>
                                PalaClicker
                            </h3>

                        </div>
                        <div style={{flexDirection: "row", display: "flex"}}>
                            <div>
                                Made by&nbsp;
                            </div>
                            <div className={"BroMine"}> BroMine__</div>
                        </div>
                        <div style={{flexDirection: "row", display: "flex", paddingTop: "20px", columnGap: "10px"}}>
                            <button onClick={() => {
                                document.getElementById("modal3").style.display = "block"
                            }
                            } style={{cursor: "pointer"}}>Comment utiliser
                                l'outil
                            </button>
                            <button onClick={() => {
                                document.getElementById("modal").style.display = "block";
                            }} style={{cursor: "pointer"}}>Voir les nouvelles fonctionnalitées
                            </button>
                            <button onClick={() => {
                                document.getElementById("modal2").style.display = "block"
                            }} style={{cursor: "pointer"}}>Voir l'évolution
                                du top 10
                            </button>
                        </div>
                    </header>
                    <br/>

                    <RPS RPS={rps} estimatedRPS={estimatedRPS} playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}
                         setEstimatedRPS={setEstimatedRPS}/>
                    <br/>
                    <Refesh playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>
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

export function isCacheValid() {
    const cacheInfo = localStorage.getItem("cacheInfo");
    if (cacheInfo === null || cacheInfo === "") {
        return false
    }
    try {
        JSON.parse(cacheInfo);
    } catch (e) {
        return false
    }
    return true
}

export function isCacheDateValid() {
    const cacheInfo = localStorage.getItem("cacheInfo");
    if (cacheInfo === null || cacheInfo === "") {
        return false
    }
    try {
        const jsonCacheInfo = JSON.parse(cacheInfo);
        if (jsonCacheInfo["timestamp"] < new Date("20 April 2024 03:00 UTC+2")) {
            return false
        }
    } catch (e) {
        return false
    }
    return true
}


export default App;
