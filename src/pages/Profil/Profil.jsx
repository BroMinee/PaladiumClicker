import React, {useContext, useEffect, useState} from "react";
import MetierList from "../../Components/Metier/MetierList";
import ReactSkinview3d from "react-skinview3d"
import axios from "axios";
import "./Profil.css"
import {printPricePretty} from "../../Misc";
import {playerInfoContext} from "../../Context";
import NoPseudoPage, {Contributor} from "../../Components/NoPseudoPage/NoPseudoPage";
import ImportProfil, {setTimer} from "../OptimizerClicker/Components/ImportProfil/ImportProfil";
import {fetchFactionInfo, fetchFactionLeaderboard} from "../../FetchData";

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

        const cacheInfo = JSON.parse(localStorage.getItem("cacheInfo")) || {};
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
                    <p style={{
                        padding: "1vmin",
                        zIndex: 1,
                        position: "relative",
                        fontSize: "xx-large",
                    }}>
                        Profil de&nbsp;
                        <span className={"BroMine blurry-lighter"}>{pseudo}</span>
                        &nbsp; - &nbsp;
                        <span className={"BroMine blurry-lighter"}>{playerInfo["faction"]}</span>
                    </p>
                </div>
                <div style={{display: "flex", gap: "4vmin", justifyContent: "space-around"}}>
                    <BasicStats/>

                    <MetierStats/>
                </div>
                <div>

                </div>
                <div>
                    <h1>Hôtel de vente</h1>
                    <h3>Working progress</h3>
                </div>
            </div>

            <FactionInfo faction={playerInfo["faction"]}/>
        </div>

    )
}

const FactionInfo = ({faction}) => {

    const {
        playerInfo,
        setPlayerInfo,
        factionLeaderboard,
        setFactionLeaderboard
    } = useContext(playerInfoContext);

    useEffect(() => {
            const setFactionInfo = async () => {
                if (playerInfo["uuid"] === "Entre ton pseudo") {
                    return;
                }
                if (playerInfo["faction_info"] === undefined) {
                    playerInfo["faction_info"] = await fetchFactionInfo(playerInfo["faction"]).then((data) => {
                        return data;
                    });
                    setPlayerInfo({...playerInfo});
                }
            }
            const asyncSetFactionLeaderboard = async () => {
                // Update faction leaderboard every 5 minutes
                if (Object.keys(factionLeaderboard).length === 0 || factionLeaderboard["last_update"] === undefined || Date.now() - factionLeaderboard["last_update"] > 1000 * 60 * 5) {
                    const newFactionLeaderBoard = {
                        "classement":
                            await fetchFactionLeaderboard(playerInfo["faction"]).then((data) => {
                                return data;
                            }), "last_update": Date.now()
                    };
                    console.log("Updating faction info")
                    setFactionLeaderboard(newFactionLeaderBoard);
                }
                else
                {
                    console.log("Using cached faction leaderboard")
                }
            }

            setFactionInfo();
            asyncSetFactionLeaderboard();
        }, [playerInfo]
    )

    if (playerInfo["faction_info"] === undefined || Object.keys(factionLeaderboard).length === 0 || factionLeaderboard["classement"] === undefined)
        return <div>Loading</div>

    const name = playerInfo["faction_info"]["name"];
    const factionDescription = playerInfo["faction_info"]["description"];
    const access = playerInfo["faction_info"]["access"];
    const createdAt = playerInfo["faction_info"]["createdAt"];
    const level = playerInfo["faction_info"]["level"]["level"];
    const xp = playerInfo["faction_info"]["level"]["xp"];
    const playerList = playerInfo["faction_info"]["players"];
    const factionIndex = factionLeaderboard["classement"].findIndex((faction) => faction["name"] === name) +1;
    const factionClassement = (factionIndex !== 0 ? factionIndex : `>${factionLeaderboard["classement"].length}`);


    return (
        <div className={"FactionInfo"}>
            <h1>
                {`${name} - ${factionClassement}ème`}
            </h1>
            <SmallInfo imgPath={"BookAndQuill.webp"} title={"Description"} value={factionDescription}/>
            {/*<SmallInfo imgPath={""} title={"Accès"} value={access[0] + access.slice(1).toLocaleLowerCase()}/>*/}
            <SmallInfo imgPath={"clock.gif"} title={"Créée le"} value={convertEpochToDateUTC2(createdAt)}/>
            <SmallInfo imgPath={"ExperienceOrb.webp"} title={"Niveau - [xp]"}
                       value={`${level} - [${printPricePretty(xp)}]`}/>
            <div className={"PlayerInFac"}>
                <h2>{`Membres - ${playerList.length}`}</h2>
                <div className={"FactionMemberFather children-blurry-lighter"}>
                    {
                        playerList.map((player) => {
                            return <Contributor key={player["uuid"]}
                                                pseudo={`[${player["group"]}] ${player["username"]}`}
                                                urlSkin={`https://crafatar.com/avatars/${player["uuid"]}?size=8`}
                                                description={`Rejoins le ${convertEpochToDateUTC2(player["joinedAt"])}`}
                                                url={""}/>

                        })
                    }
                </div>
            </div>
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
            <SmallInfo imgPath={`trixium_block.webp`} title={"Rang en jeu"} value={playerInfo["rank"][0].toUpperCase() + playerInfo["rank"].slice(1).toLowerCase()}/>
        </div>);
}

export const SmallInfo = ({imgPath, title, value}) => {

    if (title === "Rang en jeu") {
        if (value === "Default") {
            imgPath = "dirt.png";
        } else if (value === "Titan") {
            imgPath = "titan.png";
        } else if (value === "Paladin") {
            imgPath = "paladin.png";
        } else if (value === "Endium") {
            imgPath = "endium.png";
        } else if (value === "Trixium") {
            imgPath = "trixium.png";
        } else if (value === "Trixium+") {
            imgPath = "trixium+.png";
        } else if (value === "Youtuber") {
            imgPath = "youtuber.png";
        } else {
            imgPath = "unknown.png"
        }
    }


    return (
        <div className={"SmallInfo"}>
            <div className="imageWrapper" style={{
                background: "#FF5C00",
                borderRadius: "17px 0px 0px 17px",
                marginRight: "2vmin",
                paddingLeft: "1vmin",
                paddingRight: "1vmin"
            }}>
                <img src={`${process.env.PUBLIC_URL}/${imgPath}`} alt="image"
                     className={"Metier-img"} style={{height: "8vmin", width: "8vmin", margin: "1vmin 1vmin"}}></img>
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