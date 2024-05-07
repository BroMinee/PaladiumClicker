import './App.css';
import BuildingList from "./Components/Building/BuildingList";
import MetierList from "./Components/Metier/MetierList";
import RPS from "./Components/RPS/RPS";
import React, {useContext, useEffect, useState} from "react";
import ClickList from "./Components/ClickList/ClickList";
import {fetchAllData, fetchAllDataButKeepOwn} from "./FetchData";
import ImportProfil from "./Components/ImportProfil/ImportProfil";
import News from "./Components/News/News";
import Graph from "./Components/Graph/Graph";
import Tuto from "./Components/Tuto/Tuto";
import Stats from "./Components/Stats/Stats";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import PalaAnimation from "./pages/PalaAnimation/PalaAnimation";
import Navbar from "./pages/NavBar";
import Profil from "./pages/Profil/Profil";
import About from "./pages/About/About";
import Bugs from "./pages/Bugs/Bugs";
import Popup from "./Components/Popup/Popup";
import {VERSION} from "./Constant";
import Header from "./pages/Header";
import {playerInfoContext} from "./Context";
import NoPseudoPage from "./Components/NoPseudoPage/NoPseudoPage";
import UpgradeList from "./Components/UpgradeList/UpgradeList";
import Countdown from "react-countdown";

let cacheHasBeenReset = false;


export const Completionist = () =>
    <div>
        Recharge la page dans quelques minutes
    </div>

function print2digits(time) {
    if (time < 10) {
        return "0" + time;
    }
    return time;
}

// Renderer callback with condition
export const renderer = ({hours, minutes, seconds, completed}) => {
    let textInRed = false;
    if(hours === 0 && minutes === 0 && seconds < 30 && seconds % 2 === 0){
        textInRed = true;
    }
    if (completed) {
        // Render a completed state
        return <Completionist/>;
    } else {
        // Render a countdown
        return <div>
            <span>Compte à rebours </span>
            <br/>
            <span style={{color: textInRed ? "red" : "inherit"}}>{print2digits(hours)}:{print2digits(minutes)}:{print2digits(seconds)}</span>
        </div>
    }
};

const App = () => {
    const [playerInfo, setPlayerInfo] = useState(JSON.parse(localStorage.getItem("cacheInfo") || "{}")["playerInfo"] || {});
    return (
        <playerInfoContext.Provider
            value={{
                playerInfo,
                setPlayerInfo
            }}>
            <div>
                <BrowserRouter>
                    <div style={{position: "absolute", marginTop: "100px", marginLeft: "10px", fontSize: "50px", background: "#FF5C00", borderRadius: "20px", zIndex: 1, maxWidth: "425px", padding: "10px"}}>
                        <Countdown date={new Date("08 May 2024 19:00 UTC+2")} renderer={renderer}/>
                    </div>

                    <header>
                        <Header/>
                    </header>
                    <body>
                    <Popup/>
                    <Routes>
                        <Route exact path="/Profil"
                               element={<Profil/>}/>
                        <Route exact path="/PaladiumClicker"
                               element={<OptiClicker/>}/>
                        <Route exact path="/PalaAnimation"
                               element={<PalaAnimation/>}/>
                        <Route exact path="/About"
                               element={<About/>}/>
                        <Route exact path="/Bugs"
                               element={<Bugs/>}/>
                    </Routes>
                    </body>
                </BrowserRouter>
            </div>
        </playerInfoContext.Provider>
    )
}

const OptiClicker = () => {

    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    const [rps, setRPS] = useState(1)
    const [estimatedRPS, setEstimatedRPS] = useState(3)

    useEffect(() => {

        async function asyncFetchAllData() {
            const newPlayerInfo = await fetchAllData();
            setPlayerInfo(newPlayerInfo)
            localStorage.setItem("cacheInfo", JSON.stringify({
                "playerInfo": newPlayerInfo,
                "version": VERSION
            }));
        }

        async function asyncFetchAllDataButKeepOwn() {
            const newPlayerInfo = await fetchAllDataButKeepOwn(playerInfo);
            setPlayerInfo(newPlayerInfo)
            localStorage.setItem("cacheInfo", JSON.stringify({
                "playerInfo": newPlayerInfo,
                "version": VERSION
            }));
        }


        if (!isCacheValid()) {
            cacheHasBeenReset = true
            console.log("No cache")
            asyncFetchAllData()
        } else if (!isCacheDateValid()) {
            cacheHasBeenReset = true
            console.log("Cache is outdated")
            asyncFetchAllDataButKeepOwn()
        } else {
            console.log("Using cache")
            setPlayerInfo(JSON.parse(localStorage.getItem("cacheInfo"))["playerInfo"])
        }

    }, []);

    useEffect(() => {
        if (Object.keys(playerInfo).length === 0)

            return
        localStorage.setItem("cacheInfo", JSON.stringify({
            "playerInfo": playerInfo,
            "version": VERSION
        }));
    }, [playerInfo]);

    if (Object.keys(playerInfo).length === 0)
        return <div>Loading</div>
    else if (playerInfo["username"] === "Entre ton pseudo")
        return <NoPseudoPage/>
    else
        return (
            <div>
                <div id="container" className="container">
                </div>
                <News cacheHasBeenReset={cacheHasBeenReset}/>
                <Graph/>
                <Tuto/>

                <div className="App">
                    <header className="App-header">
                        <div style={{flexDirection: "row", display: "flex"}}>
                            <h3 style={{marginBottom: "0px", zIndex: 1, position: "relative"}}>
                                Bienvenue sur l'optimiseur du&nbsp;
                            </h3>
                            <h3 style={{marginBottom: "0px", zIndex: 1, position: "relative"}}
                                className={"BroMine"}>
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

                    <ImportProfil resetButton={true} logError={true} idPseudoInput={"pseudoInputClicker"}/>
                    <br/>

                    <RPS RPS={rps} estimatedRPS={estimatedRPS} setEstimatedRPS={setEstimatedRPS}/>

                    <h1>Statistiques</h1>
                    <Stats rps={rps}/>

                    <h1>Métier</h1>


                    <MetierList editable={true}/>

                    <h1>Bâtiments</h1>
                    <BuildingList setRPS={setRPS}/>

                    <h1>Clic</h1>
                    <ClickList/>

                    <h1>Global</h1>
                    <UpgradeList upgradeName={"global_upgrade"}/>

                    <h1>Terrain</h1>
                    <UpgradeList upgradeName={"terrain_upgrade"}/>

                    <h1>Amélioration des bâtiments</h1>
                    <UpgradeList upgradeName={"building_upgrade"}/>

                    <h1>Many</h1>
                    <UpgradeList upgradeName={"many_upgrade"}/>

                    <h1>Postérieur</h1>
                    <UpgradeList upgradeName={"posterior_upgrade"}/>


                    <h1>Catégorie</h1>
                    <UpgradeList upgradeName={"category_upgrade"}/>
                </div>
            </div>
        )
}

export function isCacheValid() {
    const cacheInfo = localStorage.getItem("cacheInfo");
    if (cacheInfo === null || cacheInfo === "") {
        return false
    }
    try {
        const r = JSON.parse(cacheInfo);
        if (r["version"] === undefined)
            return false
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
        if (jsonCacheInfo === undefined || jsonCacheInfo["version"] === undefined) {
            if (VERSION === 1.0) {
                localStorage.clear();
                window.location.reload();
            }
            return false
        }
        if (jsonCacheInfo["version"] !== VERSION) {
            return false
        }
    } catch (e) {
        return false
    }
    return true
}


export default App;