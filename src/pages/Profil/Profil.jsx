import React, {useContext, useEffect, useState} from "react";
import MetierList from "../../Components/Metier/MetierList";
import ReactSkinview3d from "react-skinview3d"
import axios from "axios";
import "./Profil.css"
import {printPricePretty} from "../../Misc";
import {playerInfoContext} from "../../Context";
import NoPseudoPage from "../../Components/NoPseudoPage/NoPseudoPage";
import ImportProfil, {setTimer} from "../OptimizerClicker/Components/ImportProfil/ImportProfil";

const Profil = () => {

    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);
    const [skinUrl, setSkinUrl] = useState("");

    const pseudo = playerInfo["username"] || "";

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

    if (Object.keys(playerInfo).length === 0)
        return <div>Loading</div>
    else if (playerInfo["username"] === "Entre ton pseudo")
        return <NoPseudoPage/>;

    return (
        <div className={"profilGrid children-blurry"}>
            <SkinViewer skinUrl={skinUrl}/>
            <div className={"parentProfil"}>
                <div className="ProfilInfo blurry-lighter" style={{marginTop: "1vmin"}}>
                    <h1 style={{
                        padding: "1vmin",
                        zIndex: 1,
                        position: "relative",
                        flexDirection: "row",
                        display: "flex"
                    }}>
                        Profil de&nbsp;
                        <div className={"BroMine blurry-lighter"}>{pseudo}</div>
                        <div>&nbsp; - &nbsp;</div>
                        <div className={"BroMine blurry-lighter"}>{playerInfo["faction"]}</div>
                    </h1>
                </div>
                <div style={{display: "flex", gap: "4vmin", justifyContent: "space-around"}}>
                    <BasicStats/>

                    <MetierStats/>
                </div>
                <div>

                </div>
                <div>
                    <h1>Hôtel de vente</h1>
                    <h3>TODO</h3>
                </div>
            </div>

            <FactionInfo faction={playerInfo["faction"]}/>
        </div>

    )
}

const FactionInfo = ({faction}) => {
    return (
        <div className={"FactionInfo"}>
            <h1>
                {faction}

            </h1>
            TODO
        </div>

    )

}

const MetierStats = () => {
    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    return (
        <div className={"MetierStatProfil blurry"}>
            <MetierList playerInfo={playerInfo} grid={true}/>
        </div>)

}

const BasicStats = () => {
    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    const [errorInARow, setErrorInARow] = React.useState(0);


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
        <div className={"BasicStatProfil"}>
            <SmallInfo imgPath={`clock.gif`} title={"Temps de jeu"}
                       value={computeTimePlayed(playerInfo["timePlayed"])}/>
            <SmallInfo imgPath={`clock.gif`} title={"Première connexion"}
                       value={convertEpochToDateUTC2(playerInfo["firstJoin"])}/>
            <SmallInfo imgPath={`dollar.png`} title={"Argent actuel"}
                       value={printPricePretty(Math.round(playerInfo["money"])) + " $"}/>
            <SmallInfo imgPath={`trixium_block.webp`} title={"Rang en jeu"} value={playerInfo["rank"]}/>
        </div>);
}

export const SmallInfo = ({imgPath, title, value}) => {

    if (title === "Rang en jeu") {
        if (value === "default") {
            imgPath = "dirt.png";
        } else if (value === "titan") {
            imgPath = "titan.png";
        } else if (value === "paladin") {
            imgPath = "paladin.png";
        } else if (value === "endium") {
            imgPath = "endium.png";
        } else if (value === "trixium") {
            imgPath = "trixium.png";
        } else if (value === "trixium+") {
            imgPath = "trixium+.png";
        } else if (value === "youtuber") {
            imgPath = "yT2.png";
        } else {
            imgPath = "unknown.png"
        }
    }


    return (
        <div className={"SmallInfo"}>
            <div className="imageWrapper" style={{background: "#FF5C00", borderRadius: "17px 0px 0px 17px", marginRight: "2vmin", paddingLeft: "1vmin", paddingRight: "1vmin"}}>
                <img src={`${process.env.PUBLIC_URL}/${imgPath}`} alt="image"
                     className={"Metier-img"} style={{height: "8vmin",width: "8vmin", margin: "1vmin 1vmin"}}></img>
            </div>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly", width: "100%"}}>
                <div style={{fontWeight: "bold"}}>{title}</div>
                <div className={"largeFontSize"}>{value}</div>
            </div>
        </div>
    )

}

const SkinViewer = ({skinUrl}) => {
    return (<div className={"SkinViewerParent"}>
        <ReactSkinview3d className={"SkinViewer"}
                         skinUrl={skinUrl}
                         height="250"
                         width="250"
                         onReady={({
                                       viewer
                                   }) => {
                             // Add an animation
                             // Enabled auto rotate
                             viewer.autoRotate = true;
                         }}/>
        <ImportProfil resetButton={false} logError={true} idPseudoInput={"pseudoInputProfil"}/>
        <div id={"errorAPI"} style={{paddingBottom: "10px"}}></div>
        <div id={"ApiDown"} style={{display: "none", fontSize: "20px"}}>
            <div>L'API de pala est peut-être down:</div>
            <a href="https://status.palaguidebot.fr/">Vérifier le status</a>
        </div>
    </div>);

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