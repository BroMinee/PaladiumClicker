import React, {useContext, useEffect, useState} from "react";
import {playerInfoContext} from "../../Context";
import {fetchAllData, fetchAllDataButKeepOwn} from "../../FetchData";
import {VERSION} from "../../Constant";
import NoPseudoPage from "../../Components/NoPseudoPage/NoPseudoPage";
import News from "../../Components/News/News";
import Tuto from "../../Components/Tuto/Tuto";
import MetierList from "../../Components/Metier/MetierList";
import Graph from "./Components/Graph/Graph";
import ImportProfil from "./Components/ImportProfil/ImportProfil";
import RPS from "./Components/RPS/RPS";
import BuildingList from "./Components/Building/BuildingList";
import ClickList from "./Components/ClickList/ClickList";
import UpgradeList from "./Components/UpgradeList/UpgradeList";
import Stats from "./Components/Stats/Stats";

import "./OptimizerClicker.css"

let cacheHasBeenReset = false;

function isCacheValid() {
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

function isCacheDateValid() {
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

export const OptiClicker = () => {

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
                <div className="App gridClicker children-blurry">
                    <div style={{justifySelf: "center"}}>
                        <p style={{fontSize: "xx-large", marginBottom: "0px"}}>
                                Bienvenue sur l'optimiseur du&nbsp;
                            <span className={"BroMine"}>
                                PalaClicker
                            </span>
                        </p>
                        <p style={{fontSize: "x-large", marginTop: "0px"}}>
                            Made by&nbsp;
                            <span className={"BroMine"}> BroMine__</span>
                        </p>


                        <div style={{flexDirection: "row", display: "flex", padding: "10px 0px", columnGap: "10px"}}>
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
                        <ImportProfil resetButton={true} logError={true} idPseudoInput={"pseudoInputClicker"}/>
                    </div>


                    <RPS RPS={rps} estimatedRPS={estimatedRPS} setEstimatedRPS={setEstimatedRPS}/>

                    <div>
                        <h1>Statistiques</h1>
                        <Stats rps={rps}/>
                    </div>

                    <div>
                        <h1>Métier</h1>
                        <MetierList editable={true}/>
                    </div>

                    <div>
                        <h1>Bâtiments</h1>
                        <BuildingList setRPS={setRPS}/>
                    </div>

                    <div>
                        <h1>Clic</h1>
                        <ClickList/>
                    </div>

                    <div>
                        <h1>Global</h1>
                        <UpgradeList upgradeName={"global_upgrade"}/>
                    </div>

                    <div>
                        <h1>Terrain</h1>
                        <UpgradeList upgradeName={"terrain_upgrade"}/>
                    </div>

                    <div>
                        <h1>Amélioration des bâtiments</h1>
                        <UpgradeList upgradeName={"building_upgrade"}/>

                    </div>
                    <div>
                        <h1>Many</h1>
                        <UpgradeList upgradeName={"many_upgrade"}/>
                    </div>

                    <div>
                        <h1>Postérieur</h1>
                        <UpgradeList upgradeName={"posterior_upgrade"}/>
                    </div>

                    <div>
                        <h1>Catégorie</h1>
                        <UpgradeList upgradeName={"category_upgrade"}/>
                    </div>

                </div>
            </div>
        )
}
