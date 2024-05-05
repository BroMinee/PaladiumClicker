import React, {useContext, useEffect, useState} from "react";
import MetierList from "../../Components/Metier/MetierList";
import ReactSkinview3d from "react-skinview3d"
import axios from "axios";
import "./Profil.css"
import ImportProfil, {setTimer} from "../../Components/ImportProfil/ImportProfil";
import {printPricePretty} from "../../Misc";
import {playerInfoContext} from "../../Context";

const Profil = () => {

    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);


    const pseudo = playerInfo["username"] || "";

    return (
        <div className="App">
            <header className="App-header">
                <h3 style={{
                    marginBottom: "0px",
                    zIndex: 1,
                    position: "relative",
                    flexDirection: "row",
                    display: "flex"
                }}>
                    Profil de&nbsp;
                    <div className={"BroMine"}>{pseudo}</div>
                    <div>&nbsp; - &nbsp;</div>
                    <div className={"BroMine"}>{playerInfo["faction"]}</div>
                </h3>
            </header>
            <br/>
            <ProfilBody playerInfo={playerInfo} setPlayerInfo={setPlayerInfo}/>
        </div>
    )
}

const ProfilBody = ({playerInfo, setPlayerInfo}) => {


    const [errorInARow, setErrorInARow] = React.useState(0);
    const [skinUrl, setSkinUrl] = useState("");
    const pseudo = playerInfo["username"];

    useEffect(() => {
        axios.get(`https://api.ashcon.app/mojang/v2/user/${pseudo}`)
            .then(response => {
                const skinUrl = response.data.textures.skin.url;
                setSkinUrl(skinUrl);
            }).catch(error => {
                console.error(error);
            }
        )

        const cacheInfo = JSON.parse(localStorage.getItem("cacheInfo"));
        cacheInfo["playerInfo"] = playerInfo;
        localStorage.setItem("cacheInfo", JSON.stringify(cacheInfo));
    }, [playerInfo]);

    useEffect(() => {
        if (errorInARow >= 2) {
            document.getElementById("ApiDown").style.display = "block";
            document.getElementById("errorAPI").innerHTML = "";
        }
        if (errorInARow === 4) {
            setErrorInARow(0);
        }
        if (errorInARow === 0) {
            document.getElementById("ApiDown").style.display = "none";
        }

    }, [errorInARow]);

    useEffect(() => {
        const lockSend = parseInt(localStorage.getItem("lockSend"));
        if (lockSend !== null && lockSend > 0) {
            setTimer(lockSend, false)
        }
    }, []);


    return (
        Object.keys(playerInfo).length === 0 ? <div></div> : (
            <div>
                <div style={{fontSize: "3vmin"}}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        Rank:&nbsp;
                        <div className={"BroMine"}>{playerInfo["rank"]}
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        Tu joues depuis le&nbsp;
                        <div className={"BroMine"}>{convertEpochToDateUTC2(playerInfo["firstJoin"])}</div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        Tu possèdes&nbsp;
                        <div className={"BroMine"}>{printPricePretty(playerInfo["money"])}</div>
                        &nbsp;$
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        Tu as joué un total de&nbsp;
                        <div className={"BroMine"}>{computeTimePlayed(playerInfo["timePlayed"])}</div>
                    </div>
                    {playerInfo["timePlayed"] > 43200 ? <div>Ca explique l'odeur si forte 😘</div> : ""}
                </div>

                <div className={"Profil"}>
                    <div>
                        <ReactSkinview3d className={"SkinViewer"}
                                         skinUrl={skinUrl}
                                         height="250"
                                         width="250"
                        />
                        <ImportProfil resetButton={false} logError={true} idPseudoInput={"pseudoInputProfil"}/>
                    </div>

                    <MetierList playerInfo={playerInfo}/>
                </div>


                <div id={"errorAPI"}></div>
                <div id={"ApiDown"} style={{display: "none", fontSize: "20px"}}>
                    <div>L'API de pala est peut-être down:</div>
                    <a href="https://status.palaguidebot.fr/">Vérifier le status</a>
                </div>

            </div>));
}

function computeTimePlayed(timeInMinutes) {
    const minute = timeInMinutes % 60;
    const hour = Math.floor(timeInMinutes / 60) % 24;
    const day = Math.floor(timeInMinutes / 60 / 24);
    let res = "";
    if (day > 0) {
        res += day + "j ";
    }
    if (hour > 0) {
        res += hour + "h ";
    }
    res += minute + "m";

    return res;
}

function convertEpochToDateUTC2(epoch) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(epoch / 1000);
    return d.toLocaleString();
}

export default Profil;