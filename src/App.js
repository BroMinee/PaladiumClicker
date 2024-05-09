import './App.css';
import React, {useEffect, useState} from "react";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import PalaAnimation from "./pages/PalaAnimation/PalaAnimation";
import Navbar from "./pages/NavBar";
import Profil from "./pages/Profil/Profil";
import About from "./pages/About/About";
import Popup from "./Components/Popup/Popup";
import {playerInfoContext} from "./Context";
import {OptiClicker} from "./pages/OptimizerClicker/OptimizerClicker";
import News from "./Components/News/News";
import {fetchAllData, fetchAllDataButKeepOwn} from "./FetchData";
import {VERSION} from "./Constant";


let cacheHasBeenReset = false;

const App = () => {
    const [playerInfo, setPlayerInfo] = useState(JSON.parse(localStorage.getItem("cacheInfo") || "{}")["playerInfo"] || {});
    const [factionLeaderboard, setFactionLeaderboard] = useState(JSON.parse(localStorage.getItem("cacheInfo") || "{}")["factionLeaderboard"] || {});


    useEffect(() => {

        async function asyncFetchAllData() {
            const newPlayerInfo = await fetchAllData();
            setPlayerInfo(newPlayerInfo)
            console.log(newPlayerInfo)
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

        console.log(JSON.parse(localStorage.getItem("cacheInfo")));
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
        console.log("UPDATING CACHE")
        if (Object.keys(playerInfo).length === 0)
            return
        localStorage.setItem("cacheInfo", JSON.stringify({
            "playerInfo": playerInfo,
            "version": VERSION
        }));


    }, [playerInfo]);

    return (
        <playerInfoContext.Provider
            value={{
                playerInfo,
                setPlayerInfo,
                factionLeaderboard,
                setFactionLeaderboard,
            }}>
            <BrowserRouter>
                <header>
                    <Navbar/>
                </header>
                <main>
                    <div id={"errorAPI"}></div>
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
                    </Routes>
                    <News cacheHasBeenReset={cacheHasBeenReset}/>
                </main>
            </BrowserRouter>
        </playerInfoContext.Provider>
    )
}


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

export default App;