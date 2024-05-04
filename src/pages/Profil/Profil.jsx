import React, {useEffect, useState} from "react";
import fetchDataOnPublicURL, {fetchDataOnPaladiumAPI} from "../../FetchData";
import MetierList from "../../Components/Metier/MetierList";
import ReactSkinview3d from "react-skinview3d"
import axios from "axios";
import "./Profil.css"
import {setTimer} from "../../Components/RefeshAll/Refesh";
import {isCacheDateValid, isCacheValid} from "../../App";
import {VERSION} from "../../Constant";
import {printPricePretty} from "../../Misc";

const Profil = () => {


    const cacheInfo = JSON.parse(localStorage.getItem("cacheInfo"));
    const [playerInfo, setPlayerInfo] = useState(cacheInfo["playerInfo"] || {});

    const pseudo = playerInfo["username"] || "";

    return (
        <div className="App"
             style={{backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`, height: "calc(100vh - 91.4px)"}}>
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
            setTimer(lockSend)
        }
    }, []);

    async function fetchPseudo(pseudo) {
        if (pseudo.includes(" ")) {
            throw "Pseudo contains space";
        } else if (/^[a-zA-Z0-9_]+$/.test(pseudo) === false) {
            throw "Pseudo doit contenir que des lettres ou des chiffres";
        } else if (pseudo.length <= 3) {
            throw "Pseudo trop court";
        } else if (pseudo.length > 16) {
            throw "Pseudo trop long";
        }
        localStorage.setItem("pseudo", pseudo);


        const translateBuildingName = await fetchDataOnPublicURL("/translate_building.json").then((data) => {
            return data;
        })
        const translateBuildingUpgradeName = await fetchDataOnPublicURL("/translate_upgrade.json").then((data) => {
            return data;
        })

        const [uuid, profil, clickerInfo] = await fetchDataOnPaladiumAPI(pseudo);

        const upgrades = clickerInfo["upgrades"];
        const buildings = clickerInfo["buildings"];

        let newPlayerInfo = {...playerInfo}

        // Reset all
        newPlayerInfo["building"].forEach((building, index) => {
            newPlayerInfo["building"][index]["own"] = 0;
        });

        newPlayerInfo["metier"].forEach((metier, index) => {
            newPlayerInfo["metier"][index]["level"] = 0;
            newPlayerInfo["metier"][index]["xp"] = 0;
        });
        newPlayerInfo["production"] = 0.5;

        ["building_upgrade", "category_upgrade", "CPS", "global_upgrade", "many_upgrade", "posterior_upgrade", "terrain_upgrade"].forEach((key) => {
            newPlayerInfo[key].forEach((upgrade, index) => {
                newPlayerInfo[key][index]["own"] = false;
            });
        })

        buildings.forEach((building) => {
            const buildingIndex = translateBuildingName[building["name"]];
            if (buildingIndex === undefined)
                throw `Unknown building name : '${building["name"]}', please contact the developer to fix it`;
            newPlayerInfo["building"][buildingIndex]["own"] = building["quantity"];
            newPlayerInfo["production"] += building["production"];
        })
        upgrades.forEach((upgrade) => {
            const pathToFollow = translateBuildingUpgradeName[upgrade];
            if (pathToFollow === undefined)
                throw `Unknown upgrade name : '${upgrade}', please contact the developer to fix it`;
            newPlayerInfo[pathToFollow[0]][pathToFollow[1]]["own"] = true;
        });

        const jobs = profil["jobs"];

        newPlayerInfo["faction"] = profil["faction"] === "" ? "Wilderness" : profil["faction"];
        newPlayerInfo["firstJoin"] = profil["firstJoin"];
        newPlayerInfo["money"] = profil["money"];
        newPlayerInfo["timePlayed"] = profil["timePlayed"];
        newPlayerInfo["username"] = profil["username"];
        newPlayerInfo["uuid"] = profil["uuid"];
        newPlayerInfo["rank"] = profil["rank"];

        Object.keys(jobs).forEach((job) => {
            switch (job) {
                case "miner":
                    newPlayerInfo["metier"][0]["level"] = jobs[job]["level"];
                    newPlayerInfo["metier"][0]["xp"] = jobs[job]["xp"];
                    break;
                case "farmer":
                    newPlayerInfo["metier"][1]["level"] = jobs[job]["level"];
                    newPlayerInfo["metier"][1]["xp"] = jobs[job]["xp"];
                    break;
                case "hunter":
                    newPlayerInfo["metier"][2]["level"] = jobs[job]["level"];
                    newPlayerInfo["metier"][2]["xp"] = jobs[job]["xp"];
                    break;
                case "alchemist":
                    newPlayerInfo["metier"][3]["level"] = jobs[job]["level"];
                    newPlayerInfo["metier"][3]["xp"] = jobs[job]["xp"];
                    break;
                default:
                    throw `Unknown job ${job} please contact the developer to fix it`;
            }
        })

        setPlayerInfo(newPlayerInfo)
        document.getElementById("errorAPI").innerText = "";
        document.getElementById("pseudoInput").value = "";
        document.getElementById("pseudoInput").placeholder = pseudo;
        setErrorInARow(0);

    }

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
                        <input type="pseudo" id={"pseudoInput"} className={"pseudoInputProfil"}
                               placeholder={playerInfo["username"] ? playerInfo["username"] + " - " + playerInfo["faction"] : "Entre ton pseudo"}
                               onKeyUp={async (e) => {
                                   if (e.key === "Enter") {

                                       fetchPseudo(e.target.value).catch((e) => {
                                           setErrorInARow(errorInARow + 1);
                                           if (e.status === 429) {
                                               setTimer(120)
                                           } else if (e.status === 403) {
                                               document.getElementById("errorAPI").innerText = "Ton profil n'est pas visible, c'est le cas si tu es Youtubeur ou Streamer\n";
                                           } else if (e.status === 404) {
                                               document.getElementById("errorAPI").innerText = "Pseudo non trouvé, veuillez vérifier le pseudo";
                                           } else if (e.stats === 500) {
                                               document.getElementById("errorAPI").innerText = "Erreur interne du serveur, veuillez réessayer plus tard";
                                               setTimer(60 * 5);
                                           } else {
                                               document.getElementById("errorAPI").innerText = e["data"] !== undefined && e["data"]["message"] !== undefined ? JSON.stringify(e["data"]["message"]) : e;
                                           }
                                       });
                                   }
                               }}></input>
                    </div>

                    <MetierList playerInfo={playerInfo}/>
                </div>


                <div id={"errorAPI"}></div>
                <div id={"ApiDown"} style={{display: "none", fontSize: "20px"}}>
                    <div>L'API de pala est peut-être down:</div>
                    <a href="https://status.palaguidebot.fr/" target="_blank">Vérifier le status</a>
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