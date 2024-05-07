import './App.css';
import React, {useContext, useEffect, useState} from "react";

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

const App = () => {
    const [playerInfo, setPlayerInfo] = useState(JSON.parse(localStorage.getItem("cacheInfo") || "{}")["playerInfo"] || {});
    return (
        <playerInfoContext.Provider
            value={{
                playerInfo,
                setPlayerInfo
            }}>
            <BrowserRouter>
                <header>
                    <Navbar/>
                </header>
                <main>
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
                </main>
            </BrowserRouter>
        </playerInfoContext.Provider>
    )
}


export default App;